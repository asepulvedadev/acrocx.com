
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function ImageSlider({ type, className }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, [type]);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const loadSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('system_images')
        .select('*')
        .eq('type', type)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Si no hay imágenes en la base de datos, usar imágenes por defecto
      if (!data || data.length === 0) {
        const defaultImages = {
          slider_home: [
            {
              image_url: "https://images.unsplash.com/photo-1684565454479-c346f3565454",
              alt_text: "Lujoso apartamento moderno en Monterrey"
            },
            {
              image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
              alt_text: "Elegante casa con diseño contemporáneo"
            },
            {
              image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
              alt_text: "Residencia exclusiva con acabados de lujo"
            }
          ],
          slider_sales: [
            {
              image_url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
              alt_text: "Propiedades exclusivas en venta"
            },
            {
              image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
              alt_text: "Casas de lujo en Monterrey"
            },
            {
              image_url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
              alt_text: "Inversiones inmobiliarias premium"
            }
          ],
          slider_rentals: [
            {
              image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
              alt_text: "Apartamentos de lujo en renta"
            },
            {
              image_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
              alt_text: "Espacios exclusivos para rentar"
            },
            {
              image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
              alt_text: "Propiedades en renta de alto nivel"
            }
          ]
        };

        setSlides(defaultImages[type] || []);
      } else {
        setSlides(data);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
      // Cargar imágenes por defecto en caso de error
      setSlides([
        {
          image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
          alt_text: "Propiedad de lujo"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || slides.length === 0) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div 
        className="relative h-full w-full"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40" /> {/* Overlay oscuro */}
            <img 
              className="h-full w-full object-cover"
              alt={slides[currentSlide].alt_text}
              src={slides[currentSlide].image_url}
            />
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de slides */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ImageSlider;
