import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image,
  Upload,
  Trash2,
  ArrowLeft,
  X,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function SystemImages() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('system_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      showNotification('error', 'No se pudieron cargar las imágenes');
      toast({
        title: "Error",
        description: "No se pudieron cargar las imágenes",
        variant: "destructive",
      });
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const uploadImage = async (file, type) => {
    try {
      setUploading(true);

      // Validar tamaño máximo (2MB)
      const maxSize = 2;
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > maxSize) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxSize}MB permitidos.`);
      }

      // Validar formato
      const allowedTypes = type === 'favicon' || type === 'logo'
        ? ['image/png', 'image/webp', 'image/svg+xml']
        : ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Formato no permitido. Use: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
      }

      // Si es logo o favicon, eliminar el anterior
      if (type === 'logo' || type === 'favicon') {
        const existingImage = images.find(img => img.type === type);
        if (existingImage) {
          await handleDelete(existingImage.id, existingImage.image_url, false);
        }
      }

      // Crear nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;

      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from('system_images')
        .insert({
          type,
          image_url: publicUrl,
          alt_text: file.name.split('.')[0],
          order_index: type === 'logo' || type === 'favicon' ? 0 : images.filter(img => img.type === type).length + 1
        });

      if (dbError) {
        // Si hay error en DB, limpiar storage
        await supabase.storage
          .from('property-images')
          .remove([fileName]);
        throw dbError;
      }

      // Si es un favicon, actualizarlo en tiempo real
      if (type === 'favicon') {
        const faviconEl = document.getElementById('favicon');
        if (faviconEl) {
          faviconEl.href = publicUrl;
        }
      }

      showNotification('success', 'Imagen subida correctamente');
      toast({
        title: "Éxito",
        description: "Imagen subida correctamente",
      });

      await loadImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', error.message || "No se pudo subir la imagen");
      toast({
        title: "Error",
        description: error.message || "No se pudo subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl, showConfirmation = true) => {
    if (showConfirmation && !window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      // Eliminar de Storage
      const fileName = imageUrl.split('/').pop();
      const { error: storageError } = await supabase.storage
        .from('property-images')
        .remove([fileName]);

      if (storageError) {
        console.error('Error al eliminar de storage:', storageError);
      }

      // Eliminar de la base de datos
      const { error: dbError } = await supabase
        .from('system_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      if (showConfirmation) {
        showNotification('success', 'Imagen eliminada correctamente');
        toast({
          title: "Éxito",
          description: "Imagen eliminada correctamente",
        });
      }

      await loadImages();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showNotification('error', 'No se pudo eliminar la imagen');
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      await uploadImage(file, type);
    }
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadImage(file, type);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getImagesByType = (type) => {
    return images.filter(img => img.type === type);
  };

  const getSizeInfo = (type) => {
    const sizeInfo = {
      slider_home: "1920x1080px, máx 2MB (jpg, png, webp)",
      slider_sales: "1920x1080px, máx 2MB (jpg, png, webp)",
      slider_rentals: "1920x1080px, máx 2MB (jpg, png, webp)",
      logo: "200x60px, máx 2MB (png, webp, svg)",
      favicon: "32x32px, máx 2MB (png, webp, svg)"
    };
    return sizeInfo[type];
  };

  return (
    <>
      {/* Notification area */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg px-6 py-3 shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium">Información importante</h3>
            <p className="mt-1 text-xs">
              Aquí puedes gestionar todas las imágenes del sitio. Recuerda que el slider principal ha sido reemplazado por un video, 
              pero aún puedes gestionar las imágenes para las secciones de ventas y rentas.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Logo */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Logo</h2>
              <p className="text-sm text-gray-600">
                Logo principal del sitio
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('logo')}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {getImagesByType('logo').map((image) => (
              <motion.div 
                key={image.id}
                className="relative aspect-[3/1] overflow-hidden rounded-xl border bg-white shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-contain p-4"
                  onClick={() => setSelectedImage(image.image_url)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="truncate text-sm text-gray-500">
                    {image.alt_text}
                  </p>
                </div>
                <div className="absolute right-2 top-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative aspect-[3/1] overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'logo')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'logo')}
                accept=".png,.webp,.svg"
              />
              <label
                htmlFor="logo-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block text-center text-base font-medium text-primary">
                  Arrastra o haz clic para subir
                </span>
                <span className="mt-2 block text-center text-sm text-gray-500">
                  PNG, WebP o SVG, máximo 2MB
                </span>
              </label>
            </motion.div>
          </div>
        </section>

        {/* Favicon */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Favicon</h2>
              <p className="text-sm text-gray-600">
                Icono de la pestaña del navegador
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('favicon')}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
            {getImagesByType('favicon').map((image) => (
              <motion.div 
                key={image.id} 
                className="relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-contain p-4"
                  onClick={() => setSelectedImage(image.image_url)}
                />
                <div className="absolute right-2 top-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 rounded-full shadow"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'favicon')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="favicon-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'favicon')}
                accept=".ico,.png,.webp,.svg"
              />
              <label
                htmlFor="favicon-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <span className="mt-2 block text-center text-sm font-medium text-primary">
                  Subir favicon
                </span>
                <span className="mt-1 block text-center text-xs text-muted-foreground">
                  ICO, PNG, WebP o SVG
                </span>
              </label>
            </motion.div>
          </div>
        </section>

        {/* Slider Home */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Slider Principal</h2>
              <p className="text-sm text-muted-foreground">
                Imágenes del slider de la página de inicio
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('slider_home')}
            </div>
          </div>
          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Slider reemplazado por video</h3>
                <p className="mt-1 text-xs">
                  El slider principal ha sido reemplazado por un video. Estas imágenes ya no se mostrarán en la página principal.
                  Puedes usar la sección "Gestionar Videos" para configurar el video principal.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getImagesByType('slider_home').map((image) => (
              <motion.div 
                key={image.id} 
                className="relative aspect-video overflow-hidden rounded-xl border shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-cover"
                  onClick={() => setSelectedImage(image.image_url)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="truncate text-lg font-medium text-white">
                    {image.alt_text}
                  </h3>
                </div>
                <div className="absolute right-2 top-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'slider_home')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="slider-home-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'slider_home')}
                accept=".jpg,.jpeg,.png,.webp"
              />
              <label
                htmlFor="slider-home-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block text-center text-base font-medium text-primary">
                  Arrastra o haz clic para subir
                </span>
                <span className="mt-2 block text-center text-sm text-muted-foreground">
                  JPG, PNG o WebP, máximo 2MB
                </span>
              </label>
            </motion.div>
          </div>
        </section>

        {/* Slider Ventas */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Slider Ventas</h2>
              <p className="text-sm text-muted-foreground">
                Imágenes del slider de la página de ventas
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('slider_sales')}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getImagesByType('slider_sales').map((image) => (
              <motion.div 
                key={image.id} 
                className="relative aspect-video overflow-hidden rounded-xl border shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-cover"
                  onClick={() => setSelectedImage(image.image_url)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="truncate text-lg font-medium text-white">
                    {image.alt_text}
                  </h3>
                </div>
                <div className="absolute right-2 top-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'slider_sales')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="slider-sales-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'slider_sales')}
                accept=".jpg,.jpeg,.png,.webp"
              />
              <label
                htmlFor="slider-sales-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block text-center text-base font-medium text-primary">
                  Arrastra o haz clic para subir
                </span>
                <span className="mt-2 block text-center text-sm text-muted-foreground">
                  JPG, PNG o WebP, máximo 2MB
                </span>
              </label>
            </motion.div>
          </div>
        </section>

        {/* Slider Rentas */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Slider Rentas</h2>
              <p className="text-sm text-muted-foreground">
                Imágenes del slider de la página de rentas
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('slider_rentals')}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getImagesByType('slider_rentals').map((image) => (
              <motion.div 
                key={image.id} 
                className="relative aspect-video overflow-hidden rounded-xl border shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-cover"
                  onClick={() => setSelectedImage(image.image_url)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="truncate text-lg font-medium text-white">
                    {image.alt_text}
                  </h3>
                </div>
                <div className="absolute right-2 top-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'slider_rentals')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="slider-rentals-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'slider_rentals')}
                accept=".jpg,.jpeg,.png,.webp"
              />
              <label
                htmlFor="slider-rentals-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block text-center text-base font-medium text-primary">
                  Arrastra o haz clic para subir
                </span>
                <span className="mt-2 block text-center text-sm text-muted-foreground">
                  JPG, PNG o WebP, máximo 2MB
                </span>
              </label>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modal de imagen */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 -top-3 z-10 h-8 w-8 rounded-full bg-white text-gray-800 shadow-lg hover:bg-gray-100"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={selectedImage}
                alt="Vista ampliada"
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de carga */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-lg bg-background p-6 shadow-xl"
            >
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-center font-medium">Subiendo imagen...</p>
              <p className="mt-2 text-center text-sm text-muted-foreground">Esto puede tomar un momento dependiendo del tamaño del archivo.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SystemImages;
