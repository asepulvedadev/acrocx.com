import React from 'react';
import SEO from './SEO';

/**
 * Componente SEO específico para páginas de propiedades inmobiliarias
 * Optimizado para motores de búsqueda inmobiliarios
 */
const PropertySEO = ({
  property,
  canonicalUrl,
  noIndex = false
}) => {
  if (!property) return null;
  
  // Extraer datos de la propiedad
  const {
    id,
    title,
    description,
    price,
    property_type,
    bedrooms,
    bathrooms,
    area,
    location,
    features = [],
    images = [],
    status = 'available',
    currency = 'MXN'
  } = property;
  
  // Construir URL de la propiedad
  const propertyUrl = canonicalUrl || `/propiedad/${id}`;
  
  // Imagen principal para compartir
  const mainImage = images && images.length > 0 
    ? images[0] 
    : 'https://acrocxweb.vercel.app/img/property-placeholder.jpg';
  
  // Generar título optimizado para SEO
  const seoTitle = `${title} | ${bedrooms} Recámaras ${bathrooms} Baños | ${area}m² | Acrocx Inmobiliaria`;
  
  // Generar descripción optimizada para SEO
  const seoDescription = `${property_type} en ${location.city}: ${bedrooms} recámaras, ${bathrooms} baños, ${area}m². ${description.substring(0, 100)}... Ver más detalles y fotos.`;
  
  // Generar palabras clave específicas para la propiedad
  const seoKeywords = `${property_type}, ${location.city}, ${location.state}, ${bedrooms} recámaras, ${bathrooms} baños, ${features.join(', ')}, inmueble, propiedad, bienes raíces`;
  
  // Datos estructurados para esta propiedad específica (Schema.org)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': title,
    'description': description,
    'url': `https://acrocxweb.vercel.app${propertyUrl}`,
    'datePosted': property.created_at,
    'image': images.map(img => img),
    'offers': {
      '@type': 'Offer',
      'price': price,
      'priceCurrency': currency,
      'availability': status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut'
    },
    'accommodationCategory': property_type,
    'numberOfRooms': bedrooms,
    'floorSize': {
      '@type': 'QuantitativeValue',
      'value': area,
      'unitCode': 'MTK' // metros cuadrados
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': location.city,
      'addressRegion': location.state,
      'addressCountry': 'MX', // México
      'postalCode': location.zip_code || '',
      'streetAddress': location.address || ''
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': location.latitude || '',
      'longitude': location.longitude || ''
    },
    'amenityFeature': features.map(feature => ({
      '@type': 'LocationFeatureSpecification',
      'name': feature
    })),
    'broker': {
      '@type': 'RealEstateAgent',
      'name': 'Acrocx Inmobiliaria',
      'url': 'https://acrocxweb.vercel.app',
      'logo': 'https://acrocxweb.vercel.app/img/logo.png',
      'telephone': '+525512345678'
    }
  };
  
  return (
    <SEO
      title={seoTitle}
      description={seoDescription}
      keywords={seoKeywords}
      canonicalUrl={propertyUrl}
      ogType="product"
      ogImage={mainImage}
      noIndex={noIndex || status !== 'available'} // No indexar propiedades no disponibles
      structuredData={structuredData}
    />
  );
};

export default PropertySEO; 