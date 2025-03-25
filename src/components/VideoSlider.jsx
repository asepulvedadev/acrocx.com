import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function VideoSlider({ className }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const { data, error } = await supabase
        .from('system_videos')
        .select('*')
        .eq('type', 'hero_video')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        setError(true);
        throw error;
      }
      
      // Si hay un video en la base de datos, usarlo
      if (data) {
        setVideoUrl(data.video_url);
      } else {
        // Video por defecto si no hay ninguno en la base de datos
        setVideoUrl("https://player.vimeo.com/progressive_redirect/playback/805226289/rendition/720p/file.mp4?loc=external");
      }
    } catch (error) {
      console.error('Error loading video:', error);
      // Video por defecto en caso de error
      setVideoUrl("https://player.vimeo.com/progressive_redirect/playback/805226289/rendition/720p/file.mp4?loc=external");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoError = () => {
    setError(true);
    console.error("Error al cargar el video");
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-black`}>
        <div className="flex flex-col items-center text-white">
          <Loader2 className="h-10 w-10 animate-spin" />
          <div className="mt-4 text-lg">Cargando video...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-black flex items-center justify-center`}>
        <div className="text-center text-white px-6">
          <div className="text-xl font-semibold">No se pudo cargar el video</div>
          <button 
            onClick={loadVideo}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div 
        className="relative h-full w-full overflow-hidden"
        animate={{ opacity: isPlaying ? 1 : 0.7 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay oscuro */}
        <video 
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlay={handleVideoPlay}
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </motion.div>
    </div>
  );
}

export default VideoSlider; 