import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente SEO para optimizar el posicionamiento en buscadores
 * Permite configurar metatags, títulos y descripciones en cada página
 */
const SEO = ({
  title = 'Acrocx - Tu Socio Inmobiliario',
  description = 'Encuentra las mejores propiedades en venta y renta con Acrocx, expertos en bienes raíces.',
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://acrocxweb.vercel.app/img/acrocx-social-card.jpg',
  keywords = 'inmobiliaria, propiedades, bienes raíces, casas en venta, apartamentos en renta',
  noIndex = false,
  structuredData = null,
  children
}) => {
  // Construir la URL canónica
  const siteUrl = 'https://acrocxweb.vercel.app';
  const pageUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.pathname : '');
  const fullUrl = `${siteUrl}${pageUrl}`;
  
  // Palabras clave específicas del sector inmobiliario
  const defaultKeywords = 'inmobiliaria, propiedades, bienes raíces, casas en venta, apartamentos en renta, asesoría inmobiliaria, propiedades de lujo';
  const allKeywords = `${defaultKeywords}, ${keywords}`.trim();
  
  // Datos JSON-LD por defecto para inmobiliaria
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Acrocx Inmobiliaria',
    'description': 'Agencia inmobiliaria especializada en propiedades de lujo, ventas, rentas y asesoría a propietarios.',
    'url': siteUrl,
    'logo': `${siteUrl}/img/logo.png`,
    'sameAs': [
      'https://www.facebook.com/acrocxInmobiliaria',
      'https://www.instagram.com/acrocxInmobiliaria',
      'https://www.linkedin.com/company/acrocx-inmobiliaria'
    ],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Ciudad de México',
      'addressRegion': 'CDMX',
      'addressCountry': 'MX'
    },
    'openingHours': 'Mo,Tu,We,Th,Fr 09:00-18:00',
    'telephone': '+525512345678',
    'email': 'contacto@acrocx.com'
  };
  
  // Usar datos estructurados personalizados o los predeterminados
  const jsonLd = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      {/* Título y metadatos básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Control de indexación */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* URL canónica */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph para redes sociales */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Acrocx Inmobiliaria" />
      <meta property="og:locale" content="es_MX" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      
      {/* Contenido adicional */}
      {children}
    </Helmet>
  );
};

export default SEO; 