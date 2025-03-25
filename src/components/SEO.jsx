import React, { memo } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Componente SEO para optimizar el posicionamiento en buscadores
 * Permite configurar metatags, títulos y descripciones en cada página
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
  
  // Configuración básica para el head
  return (
    <HelmetProvider>
      <Helmet prioritizeSeoTags>
        {/* Etiquetas básicas */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={allKeywords} />
        <link rel="canonical" href={canonical} />
        
        {/* Etiquetas para indexación */}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {!noindex && <meta name="robots" content="index, follow" />}
        
        {/* OpenGraph básico */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={metaOgTitle} />
        <meta property="og:description" content={metaOgDescription} />
        <meta property="og:url" content={metaOgUrl} />
        
        {/* OpenGraph imagen - con lazy load para no bloquear renderizado */}
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content="Acrocx" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaOgTitle} />
        <meta name="twitter:description" content={metaOgDescription} />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
        
        {/* Metadatos de performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Datos estructurados JSON-LD si existen */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
        
        {/* Recursos de imágenes optimizados */}
        <link 
          rel="preload" 
          as="image" 
          href={`${siteUrl}${ogImage}`} 
          media="(max-width: 0)" 
          onLoad="this.media='all'"
        />
      </Helmet>
      {children}
    </HelmetProvider>
  );
});

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonicalUrl: PropTypes.string,
  ogUrl: PropTypes.string,
  ogType: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.string,
  structuredData: PropTypes.object,
  noindex: PropTypes.bool,
  children: PropTypes.node
};

export default SEO; 