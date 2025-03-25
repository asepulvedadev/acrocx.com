import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Upload,
  Trash2,
  Loader2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "casa",
    status: "venta",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [],
    is_featured: false
  });

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setProperty({
        ...data,
        images: data.property_images || []
      });
    } catch (error) {
      console.error('Error loading property:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la propiedad",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        title: property.title,
        description: property.description,
        price: parseFloat(property.price),
        location: property.location,
        type: property.type,
        status: property.status,
        bedrooms: parseInt(property.bedrooms),
        bathrooms: parseFloat(property.bathrooms),
        area: parseFloat(property.area),
        is_featured: property.is_featured
      };

      let propertyId = id;

      if (id) {
        // Actualizar propiedad existente
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Crear nueva propiedad
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;
      }

      toast({
        title: "Éxito",
        description: id 
          ? "Propiedad actualizada correctamente"
          : "Propiedad creada correctamente",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la propiedad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      for (const file of files) {
        // Validar tamaño (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Las imágenes deben ser menores a 2MB');
        }

        // Crear nombre único
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        // Subir a Storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        // Si estamos editando, guardar en la base de datos
        if (id) {
          const { error: dbError } = await supabase
            .from('property_images')
            .insert({
              property_id: id,
              image_url: publicUrl,
              alt_text: file.name.split('.')[0]
            });

          if (dbError) throw dbError;
        }

        // Actualizar estado local
        setProperty(prev => ({
          ...prev,
          images: [...prev.images, { image_url: publicUrl, alt_text: file.name.split('.')[0] }]
        }));
      }

      toast({
        title: "Éxito",
        description: "Imágenes subidas correctamente",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const image = property.images[index];
      
      if (id && image.id) {
        // Eliminar de la base de datos
        const { error: dbError } = await supabase
          .from('property_images')
          .delete()
          .eq('id', image.id);

        if (dbError) throw dbError;

        // Eliminar de Storage
        const fileName = image.image_url.split('/').pop();
        const { error: storageError } = await supabase.storage
          .from('property-images')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Actualizar estado local
      setProperty(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));

      toast({
        title: "Éxito",
        description: "Imagen eliminada correctamente",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl py-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Título
            </label>
            <input
              type="text"
              value={property.title}
              onChange={(e) => setProperty({ ...property, title: e.target.value })}
              className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Descripción
            </label>
            <textarea
              value={property.description}
              onChange={(e) => setProperty({ ...property, description: e.target.value })}
              className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows="4"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Precio (MXN)
              </label>
              <input
                type="number"
                value={property.price}
                onChange={(e) => setProperty({ ...property, price: e.target.value })}
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Ubicación
              </label>
              <input
                type="text"
                value={property.location}
                onChange={(e) => setProperty({ ...property, location: e.target.value })}
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Tipo de Propiedad
              </label>
              <select
                value={property.type}
                onChange={(e) => setProperty({ ...property, type: e.target.value })}
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Estado
              </label>
              <select
                value={property.status}
                onChange={(e) => setProperty({ ...property, status: e.target.value })}
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Número de Recámaras
              </label>
              <input
                type="number"
                value={property.bedrooms}
                onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
                min="0"
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Número de Baños
              </label>
              <input
                type="number"
                value={property.bathrooms}
                onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
                min="0"
                step="0.5"
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Área (m²)
              </label>
              <input
                type="number"
                value={property.area}
                onChange={(e) => setProperty({ ...property, area: e.target.value })}
                min="0"
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={property.is_featured}
                onChange={(e) => setProperty({ ...property, is_featured: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <label htmlFor="featured" className="ml-2 flex items-center gap-2 text-sm font-medium">
                <Star className="h-4 w-4 text-yellow-400" />
                Marcar como propiedad destacada
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Imágenes
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              {property.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={() => handleRemoveImage(index)}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <label className="flex aspect-video cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50">
                <div className="text-center">
                  {uploading ? (
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <span className="mt-2 block text-sm text-muted-foreground">
                        Agregar Imagen
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/dashboard")}
              disabled={loading || uploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || uploading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {id ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                id ? "Actualizar" : "Crear"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

export default PropertyForm;
