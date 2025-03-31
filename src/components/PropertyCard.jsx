import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  Star,
  X,
  Navigation,
  Building2,
  Home,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

function PropertyCard({ property, showFeatured = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = property.property_images?.map(img => img.image_url) || [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price, status) => {
    const formattedPrice = price.toLocaleString('es-MX');
    return status === 'renta' ? `$${formattedPrice}/mes` : `$${formattedPrice}`;
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'casa':
        return <Home className="h-5 w-5" />;
      case 'departamento':
        return <Building2 className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  return (
    <>
      <motion.div 
        className="group relative overflow-hidden rounded-[var(--radius)] border bg-[#dde5f0] text-card-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:shadow-primary/5"
        whileHover={{ y: -10 }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Indicador de propiedad destacada */}
        {showFeatured && property.is_featured && (
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-1 text-xs font-medium text-yellow-900 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current" />
            Destacada
          </div>
        )}

        {/* Imagen Principal con Slider */}
        <div className="relative aspect-[4/3] cursor-pointer overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex] || '/img/property-placeholder.jpg'}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* Controles del Slider */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {/* Indicadores de Imágenes */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`h-1 w-1 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Botón de Ubicación */}
          {property.google_maps_url && (
            <a
              href={property.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
            >
              <Navigation className="h-4 w-4" />
            </a>
          )}

          {/* Etiqueta de Estado */}
          <div className="absolute left-2 bottom-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
            {property.status === 'renta' ? 'Renta' : 'Venta'}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{property.title}</h3>
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            {property.type !== 'local_comercial' && (
              <>
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area}m²</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(property.price, property.status)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal de Imágenes y Detalles */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 text-white hover:bg-white/20"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Imagen Principal */}
              <div className="relative aspect-[16/9]">
                <img
                  src={images[currentImageIndex] || '/img/property-placeholder.jpg'}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Información de la Propiedad */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{property.title}</h2>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xl font-bold">
                      {formatPrice(property.price, property.status)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                  {getPropertyTypeIcon(property.type)}
                  <span className="capitalize">{property.type}</span>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>

                <div className="mb-6 flex items-center gap-6 text-sm text-muted-foreground">
                  {property.type !== 'local_comercial' && (
                    <>
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.bedrooms} Recámaras</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} Baños</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{property.area}m²</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Descripción</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {property.description || 'No hay descripción disponible.'}
                    </p>
                  </div>

                  {property.features && property.features.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Características</h3>
                      <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
                        {property.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Amenidades</h3>
                      <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
                        {property.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {property.google_maps_url && (
                  <div className="mt-6">
                    <a
                      href={property.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <Navigation className="h-4 w-4" />
                      Ver ubicación en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PropertyCard; 