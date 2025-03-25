import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import SEO from './SEO';

/**
 * Componente SEO específico para páginas de propiedades inmobiliarias
 * Optimizado para motores de búsqueda inmobiliarios
 */
const PropertySEO = memo(function PropertySEO({ property }) {
  // Memoizar datos estructurados para evitar recálculos
  const structuredData = useMemo(() => {
    if (!property) return null;
    
    // Formatear precio adecuadamente para los datos estructurados
    const formatPrice = () => {
      if (!property.price) return null;
      return {
        "@type": "MonetaryAmount",
        "currency": "MXN",
        "value": property.price
      };
    };

    // Formatear imágenes de manera optimizada
    const formatImages = () => {
      if (!property.images || !property.images.length) {
        return [`https://acrocxweb.vercel.app/img/property-placeholder.jpg`];
      }
      
      // Limitar a 5 imágenes para rendimiento
      return property.images.slice(0, 5).map(img => img.url);
    };

    // Construir datos estructurados optimizados para RealEstateListing
    return {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": property.title,
      "description": property.description,
      "url": `https://acrocxweb.vercel.app/propiedad/${property.id}`,
      "datePosted": property.created_at,
      "image": formatImages(),
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "MXN",
        "availability": property.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
      },
      "geo": property.latitude && property.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": property.latitude,
        "longitude": property.longitude
      } : undefined,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MX",
        "addressLocality": property.city || "México",
        "addressRegion": property.state || "Ciudad de México",
        "postalCode": property.postal_code || ""
      }
    };
  }, [property]);
  
  // Si no hay propiedad, no renderizar nada
  if (!property) return null;
  
  // Determinar la URL de imagen principal para OpenGraph - con fallback
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0].url 
    : '/img/property-placeholder.jpg';
  
  // Generar meta descripción optimizada para SEO
  const getMetaDescription = () => {
    let desc = `${property.property_type || 'Propiedad'} `;
    
    if (property.status === 'for_sale') {
      desc += 'en venta ';
    } else if (property.status === 'for_rent') {
      desc += 'en renta ';
    }
    
    if (property.bedrooms) {
      desc += `con ${property.bedrooms} habitaciones, `;
    }
    
    if (property.bathrooms) {
      desc += `${property.bathrooms} baños, `;
    }
    
    if (property.area) {
      desc += `${property.area} m², `;
    }
    
    if (property.city && property.state) {
      desc += `ubicada en ${property.city}, ${property.state}. `;
    }
    
    // Añadir precio si disponible
    if (property.price) {
      desc += `Precio: $${property.price.toLocaleString('es-MX')} MXN. `;
    }
    
    return desc.substring(0, 157) + '...';
  };
  
  // Título optimizado para SEO
  const title = `${property.title} | ${property.city || ''} | Acrocx`;
  
  return (
    <SEO
      title={title}
      description={getMetaDescription()}
      ogTitle={property.title}
      ogDescription={property.description?.substring(0, 160) || getMetaDescription()}
      ogType="product"
      ogImage={mainImage}
      structuredData={structuredData}
    />
  );
});

PropertySEO.propTypes = {
  property: PropTypes.object.isRequired
};

export default PropertySEO; 