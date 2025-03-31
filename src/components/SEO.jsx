import React, { memo } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Componente SEO optimizado para rendimiento y posicionamiento
 */
const SEO = memo(function SEO({
  title = 'Acrocx - Tu Socio Inmobiliario',
  description = 'Encuentra las mejores propiedades en venta y renta con Acrocx, expertos en bienes raíces.',
  canonicalUrl,
  ogUrl,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage = '/img/acrocx-social-card.svg',
  keywords = 'inmobiliaria, propiedades, bienes raíces, casas en venta, apartamentos en renta',
  noindex = false,
  structuredData = null,
  children
}) {
  // Determinar URL canónica
  const siteUrl = 'https://acrocxweb.vercel.app';
  const canonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;
  
  // Valores predeterminados de OpenGraph
  const metaOgTitle = ogTitle || title;
  const metaOgDescription = ogDescription || description;
  const metaOgUrl = ogUrl || canonical;
  
  // Palabras clave optimizadas para SEO
  const defaultKeywords = 'inmobiliaria, propiedades, bienes raíces, casas en venta, apartamentos en renta, asesoría inmobiliaria, propiedades de lujo';
  const allKeywords = `${defaultKeywords}, ${keywords}`.trim();
  
  // Datos estructurados optimizados
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Acrocx Inmobiliaria",
    "description": description,
    "url": canonical,
    "logo": `${siteUrl}/img/logo.png`,
    "image": `${siteUrl}${ogImage}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad de México",
      "addressRegion": "CDMX",
      "addressCountry": "MX"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.4326",
      "longitude": "-99.1332"
    },
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-18:00",
    "priceRange": "$$",
    "telephone": "+525512345678",
    "email": "contacto@acrocx.com"
  };

  const jsonLd = structuredData || defaultStructuredData;

  return (
    <HelmetProvider>
      <Helmet prioritizeSeoTags>
        {/* Etiquetas básicas optimizadas */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={allKeywords} />
        <link rel="canonical" href={canonical} />
        
        {/* Control de indexación */}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
        
        {/* OpenGraph optimizado */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={metaOgTitle} />
        <meta property="og:description" content={metaOgDescription} />
        <meta property="og:url" content={metaOgUrl} />
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content="Acrocx" />
        <meta property="og:locale" content="es_MX" />
        
        {/* Twitter Card optimizada */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaOgTitle} />
        <meta name="twitter:description" content={metaOgDescription} />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
        <meta name="twitter:site" content="@acrocx" />
        
        {/* Metadatos de rendimiento */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2e3d40" />
        
        {/* DNS Prefetch y Preconnect optimizados */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        
        {/* Datos estructurados optimizados */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href={`${siteUrl}${ogImage}`}
          as="image"
          type="image/svg+xml"
        />
      </Helmet>
      {children}
    </HelmetProvider>
  );
});

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogUrl: PropTypes.string,
  ogType: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.string,
  keywords: PropTypes.string,
  noindex: PropTypes.bool,
  structuredData: PropTypes.object,
  children: PropTypes.node
};

export default SEO; 