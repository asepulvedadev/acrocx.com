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
  Star,
  ExternalLink,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import ErrorModal from "@/components/ui/ErrorModal";

function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [templateProperties, setTemplateProperties] = useState([]);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: ""
  });
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
    is_featured: false,
    google_maps_url: "",
    features: [],
    amenities: []
  });

  useEffect(() => {
    if (id) {
      loadProperty();
    } else {
      loadLastProperty();
    }
  }, [id]);

  const loadLastProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      // Duplicar la última propiedad sin las imágenes
      setProperty({
        ...data,
        id: undefined,
        title: `${data.title} (Copia)`,
        created_at: undefined,
        updated_at: undefined,
        images: [] // Inicializar con array vacío de imágenes
      });
    } catch (error) {
      console.error('Error loading last property:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la propiedad plantilla",
        variant: "destructive",
      });
    }
  };

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

      // Asegurarse de que las imágenes tengan el formato correcto
      const formattedImages = data.property_images.map(img => ({
        id: img.id,
        image_url: img.image_url
      }));

      setProperty({
        ...data,
        images: formattedImages
      });

      toast({
        title: "Propiedad cargada",
        description: "La propiedad se ha cargado correctamente",
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

  const useAsTemplate = (templateProperty) => {
    setProperty({
      ...templateProperty,
      id: undefined, // Eliminar el ID para que se cree como nueva propiedad
      title: `${templateProperty.title} (Copia)`,
      created_at: undefined,
      updated_at: undefined,
      property_images: templateProperty.property_images.map(img => ({
        ...img,
        id: undefined,
        property_id: undefined
      }))
    });
  };

  const removeImage = async (index) => {
    try {
      const imageToRemove = property.images[index];
      
      // Si la imagen ya está en la base de datos, marcarla para eliminación
      if (imageToRemove.id) {
        setProperty(prev => ({
          ...prev,
          images: prev.images.map((img, i) => 
            i === index ? { ...img, markedForDeletion: true } : img
          )
        }));
      } else {
        // Si es una imagen nueva, simplemente eliminarla del estado
        setProperty(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }));
      }

      setErrorModal({
        isOpen: true,
        title: "Imagen marcada para eliminación",
        message: "La imagen será eliminada cuando guardes los cambios",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      setErrorModal({
        isOpen: true,
        title: "Error al eliminar imagen",
        message: error.message || "No se pudo eliminar la imagen. Por favor, intente nuevamente.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let propertyId;
      
      // Preparar los datos para la base de datos
      const propertyData = {
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        type: property.type,
        status: property.status,
        bedrooms: parseInt(property.bedrooms) || 0,
        bathrooms: parseFloat(property.bathrooms) || 0,
        area: parseFloat(property.area) || 0,
        is_featured: property.is_featured,
        google_maps_url: property.google_maps_url,
        features: property.features,
        amenities: property.amenities
      };
      
      if (id) {
        // Actualizar propiedad existente
        const { data, error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;

        // Obtener las imágenes existentes
        const { data: existingImages, error: imagesError } = await supabase
          .from('property_images')
          .select('id, image_url')
          .eq('property_id', id);

        if (imagesError) throw imagesError;

        // Identificar imágenes a eliminar
        const imagesToDelete = property.images
          .filter(img => img.markedForDeletion)
          .map(img => img.id)
          .filter(Boolean);

        // Eliminar imágenes marcadas para eliminación
        if (imagesToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('property_images')
            .delete()
            .in('id', imagesToDelete);

          if (deleteError) throw deleteError;

          // Eliminar archivos del storage
          for (const image of property.images.filter(img => img.markedForDeletion)) {
            const fileName = image.image_url.split('/').pop();
            await supabase.storage
              .from('property-images')
              .remove([fileName]);
          }
        }

        // Actualizar o crear imágenes
        const imagesToUpdate = property.images.filter(img => !img.markedForDeletion);
        if (imagesToUpdate.length > 0) {
          const imagePromises = imagesToUpdate.map(async (image) => {
            if (image.id) {
              // Actualizar imagen existente
              const { error } = await supabase
                .from('property_images')
                .update({
                  image_url: image.image_url
                })
                .eq('id', image.id);

              if (error) throw error;
            } else {
              // Crear nueva imagen
              const { error } = await supabase
                .from('property_images')
                .insert({
                  property_id: propertyId,
                  image_url: image.image_url
                });

              if (error) throw error;
            }
          });

          await Promise.all(imagePromises);
        }
      } else {
        // Crear nueva propiedad
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;

        // Crear imágenes para la nueva propiedad
        const imagesToCreate = property.images.filter(img => !img.markedForDeletion);
        if (imagesToCreate.length > 0) {
          const imagePromises = imagesToCreate.map(async (image) => {
            const { error } = await supabase
              .from('property_images')
              .insert({
                property_id: propertyId,
                image_url: image.image_url
              });

            if (error) throw error;
          });

          await Promise.all(imagePromises);
        }
      }

      toast({
        title: "Éxito",
        description: id 
          ? "Propiedad actualizada correctamente" 
          : "Propiedad creada correctamente",
      });

      if (property.is_featured) {
        toast({
          title: "Propiedad Destacada",
          description: "La propiedad ha sido marcada como destacada",
        });
      }

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Error saving property:', error);
      setErrorModal({
        isOpen: true,
        title: "Error al guardar propiedad",
        message: error.message || "No se pudo guardar la propiedad. Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        return {
          image_url: publicUrl
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setProperty(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      
      toast({
        title: "Imágenes subidas",
        description: `Se han subido ${newImages.length} imagen(es) correctamente`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        title={errorModal.title}
        message={errorModal.message}
      />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl py-8"
      >
        {!id && templateProperties.length > 0 && (
          <div className="mb-8 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Usar como plantilla</h3>
            <div className="grid gap-4">
              {templateProperties.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50"
                >
                  <div>
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-sm text-muted-foreground">{template.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useAsTemplate(template)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Usar como plantilla
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <option value="local_comercial">Local Comercial</option>
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
                required={property.type !== 'local_comercial'}
                disabled={property.type === 'local_comercial'}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Número de Baños
              </label>
              <input
                type="number"
                value={property.bathrooms}
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir números decimales con un máximo de 1 decimal
                  if (value === '' || /^\d*\.?\d{0,1}$/.test(value)) {
                    setProperty({ ...property, bathrooms: value });
                  }
                }}
                min="0"
                step="0.1"
                className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required={property.type !== 'local_comercial'}
                disabled={property.type === 'local_comercial'}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Puedes usar decimales para medias baños (ej: 2.5)
              </p>
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

            <div>
              <label className="mb-2 block text-sm font-medium">
                URL de Google Maps
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={property.google_maps_url || ''}
                  onChange={(e) => setProperty({ ...property, google_maps_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://www.google.com/maps', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Ingresa la URL de la ubicación en Google Maps
              </p>
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
                    onClick={() => removeImage(index)}
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
