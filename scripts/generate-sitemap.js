/**
 * Script para generar un sitemap estático para el proyecto Acrocx
 * Ejecutar con: npm run generate-sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

// URL base del sitio
const SITE_URL = 'https://acrocxweb.vercel.app';

// Fecha actual en formato ISO
const now = new Date().toISOString();

// Rutas principales del sitio
const MAIN_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/ventas', priority: '0.9', changefreq: 'daily' },
  { path: '/rentas', priority: '0.9', changefreq: 'daily' },
  { path: '/propietarios', priority: '0.8', changefreq: 'weekly' }
];

/**
 * Genera el contenido del sitemap XML
 */
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                http://www.google.com/schemas/sitemap-image/1.1
                http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
`;

  // Añadir rutas principales
  MAIN_ROUTES.forEach(route => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Cerrar XML
  sitemap += `
</urlset>`;

  return sitemap;
}

/**
 * Guarda el sitemap generado
 */
function saveSitemap(content) {
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  try {
    fs.writeFileSync(sitemapPath, content);
    console.log(`✅ Sitemap generado correctamente en: ${sitemapPath}`);
  } catch (error) {
    console.error('❌ Error al guardar el sitemap:', error.message);
  }
}

// Generar y guardar el sitemap
console.log('🔍 Generando sitemap...');
const sitemapContent = generateSitemap();
saveSitemap(sitemapContent);

console.log(`
📊 Resumen:
- Rutas principales: ${MAIN_ROUTES.length}
- URL base: ${SITE_URL}
- Fecha de generación: ${new Date().toLocaleString()}

🌐 Para indexar tu sitio, asegúrate de verificar la propiedad en Google Search Console
y enviar el sitemap desde: ${SITE_URL}/sitemap.xml
`); 