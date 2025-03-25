/**
 * Script para generar un sitemap dinámico
 * Actualiza automáticamente el sitemap.xml con las propiedades actuales
 */

(async function() {
  // Función para obtener todas las propiedades
  async function fetchProperties() {
    try {
      // Utilizar Supabase para obtener las propiedades
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

      // Inicializar el cliente Supabase (usar variables de entorno)
      const supabaseUrl = window.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
      const supabaseKey = window.SUPABASE_KEY || 'tu-clave-publica';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Obtener propiedades
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, updated_at, property_type, status')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return properties || [];
    } catch (error) {
      console.error('Error fetching properties for sitemap:', error);
      return [];
    }
  }

  // Función para generar y enviar el sitemap
  async function generateSitemap() {
    try {
      // Obtener propiedades
      const properties = await fetchProperties();
      
      // No enviar si no hay conexión a internet
      if (!navigator.onLine) return;
      
      // No enviar si no tenemos propiedades (evita sitemap vacío)
      if (!properties.length) return;
      
      // Construir el sitemap
      let sitemapData = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Añadir cada propiedad
      for (const property of properties) {
        const url = `https://acrocxweb.vercel.app/propiedad/${property.id}`;
        const lastmod = new Date(property.updated_at).toISOString();
        const priority = property.status === 'featured' ? '0.8' : '0.6';
        
        sitemapData += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }
      
      // Cerrar el sitemap
      sitemapData += `
</urlset>`;
      
      // Enviar a un endpoint que lo guarde (esto requiere backend)
      const timestamp = new Date().toISOString();
      const sitemapInfo = {
        properties_count: properties.length,
        generated_at: timestamp,
        sitemap_data: sitemapData
      };
      
      // Almacenar en localStorage como caché y para diagnóstico
      localStorage.setItem('sitemap_info', JSON.stringify({
        timestamp,
        property_count: properties.length
      }));
      
      // En producción, enviar a un endpoint para guardar el sitemap
      if (window.location.hostname !== 'localhost') {
        try {
          await fetch('/api/update-sitemap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sitemapInfo)
          });
        } catch (fetchError) {
          console.error('Error sending sitemap data:', fetchError);
        }
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  }

  // Ejecutar generación de sitemap solo en producción
  if (window.location.hostname !== 'localhost') {
    // Esperar a que la página esté completamente cargada
    if (document.readyState === 'complete') {
      generateSitemap();
    } else {
      window.addEventListener('load', generateSitemap);
    }
  }
})(); 