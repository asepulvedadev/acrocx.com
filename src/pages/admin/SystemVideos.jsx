import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video,
  Upload,
  Trash2,
  X,
  Loader2,
  Info,
  Play,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function SystemVideos() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('system_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      showNotification('error', 'No se pudieron cargar los videos');
      toast({
        title: "Error",
        description: "No se pudieron cargar los videos",
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

  const uploadVideo = async (file, type) => {
    try {
      setUploading(true);

      // Validar tamaño máximo (10MB)
      const maxSize = 10;
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > maxSize) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxSize}MB permitidos.`);
      }

      // Validar formato
      const allowedTypes = ['video/mp4'];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Formato no permitido. Use: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
      }

      // Si ya existe un video de este tipo, eliminar el anterior
      if (type === 'hero_video') {
        const existingVideo = videos.find(vid => vid.type === type);
        if (existingVideo) {
          await handleDelete(existingVideo.id, existingVideo.video_url, false);
        }
      }

      // Crear nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;

      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from('property-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('property-videos')
        .getPublicUrl(fileName);

      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from('system_videos')
        .insert({
          type,
          video_url: publicUrl,
          title: file.name.split('.')[0],
          description: `Video principal para la página`
        });

      if (dbError) {
        // Si hay error en DB, limpiar storage
        await supabase.storage
          .from('property-videos')
          .remove([fileName]);
        throw dbError;
      }

      showNotification('success', 'Video subido correctamente');
      toast({
        title: "Éxito",
        description: "Video subido correctamente",
      });

      await loadVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
      showNotification('error', error.message || "No se pudo subir el video");
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, videoUrl, showConfirmation = true) => {
    if (showConfirmation && !window.confirm('¿Estás seguro de que quieres eliminar este video?')) {
      return;
    }

    try {
      // Eliminar de Storage
      const fileName = videoUrl.split('/').pop();
      const { error: storageError } = await supabase.storage
        .from('property-videos')
        .remove([fileName]);

      if (storageError) {
        console.error('Error al eliminar de storage:', storageError);
      }

      // Eliminar de la base de datos
      const { error: dbError } = await supabase
        .from('system_videos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      if (showConfirmation) {
        showNotification('success', 'Video eliminado correctamente');
        toast({
          title: "Éxito",
          description: "Video eliminado correctamente",
        });
      }

      await loadVideos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showNotification('error', "No se pudo eliminar el video");
      toast({
        title: "Error",
        description: "No se pudo eliminar el video",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      await uploadVideo(file, type);
    }
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadVideo(file, type);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getVideosByType = (type) => {
    return videos.filter(vid => vid.type === type);
  };

  const getSizeInfo = (type) => {
    return "1920x1080px, máx 10MB (mp4)";
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

      {/* Main Content */}
      <div className="space-y-8">
        {/* Video Principal */}
        <section>
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Información importante</h3>
                <p className="mt-1 text-xs">
                  El video que subas aquí se mostrará automáticamente en la sección principal de la página de inicio.
                  Reemplazará el slider de imágenes y se reproducirá en bucle. Asegúrate de que sea un video de alta calidad y corta duración.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Video Principal</h2>
              <p className="text-sm text-muted-foreground">
                Video que se muestra en la página principal
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              {getSizeInfo('hero_video')}
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getVideosByType('hero_video').map((video) => (
              <motion.div 
                key={video.id} 
                className="relative aspect-video overflow-hidden rounded-xl border shadow-sm transition duration-200 hover:shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/40"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Play className="h-6 w-6 text-white" />
                  </Button>
                </div>
                <video
                  className="h-full w-full object-cover"
                  src={video.video_url}
                  muted
                  playsInline
                  preload="metadata"
                ></video>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="truncate text-lg font-medium text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 truncate text-sm text-white/70">
                    {video.description}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full shadow"
                  onClick={() => handleDelete(video.id, video.video_url)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            
            <motion.div
              className="relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition duration-200 hover:border-primary/50 hover:bg-primary/10"
              whileHover={{ scale: 1.02 }}
              onDrop={(e) => handleDrop(e, 'hero_video')}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="hero-video-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'hero_video')}
                accept=".mp4"
              />
              <label
                htmlFor="hero-video-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block text-center text-base font-medium text-primary">
                  Arrastra o haz clic para subir
                </span>
                <span className="mt-2 block text-center text-sm text-muted-foreground">
                  MP4, máximo 10MB, 1920x1080px
                </span>
              </label>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modal de video */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
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
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <video
                src={selectedVideo.video_url}
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
                controls
                autoPlay
              ></video>
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
              <p className="mt-4 text-center font-medium">Subiendo video...</p>
              <p className="mt-2 text-center text-sm text-muted-foreground">Esto puede tomar un momento dependiendo del tamaño del archivo.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SystemVideos; 