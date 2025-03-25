/**
 * Script optimizado para generar un sitemap dinámico
 * Reducida la carga de recursos externos y mejorado el rendimiento
 */

(async function() {
  // No ejecutar en conexiones lentas
  if (document.documentElement.classList.contains('slow-connection')) {
    return;
  }

  // Función para obtener todas las propiedades de manera optimizada
  async function fetchProperties() {
    try {
      // Verificar si hay datos en caché local
      const cacheKey = 'acrocx-properties-cache';
      const cachedData = localStorage.getItem(cacheKey);
      const cacheAge = localStorage.getItem(cacheKey + '-timestamp');
      const now = Date.now();
      
      // Usar caché si existe y tiene menos de 24 horas
      if (cachedData && cacheAge && (now - parseInt(cacheAge, 10) < 86400000)) {
        return JSON.parse(cachedData);
      }
      
      // Crear cliente de Supabase con carga optimizada
      const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
        .catch(err => {
          console.warn('Error al cargar Supabase, usando datos de caché si están disponibles:', err);
          return { createClient: null };
        });
      
      if (!supabaseModule || !supabaseModule.createClient) {
        // Si falla la carga del módulo, intentar usar caché aunque sea antigua
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        return [];
      }
      
      const { createClient } = supabaseModule;

      // Inicializar el cliente Supabase con timeout
      const supabaseUrl = window.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
      const supabaseKey = window.SUPABASE_KEY || 'tu-clave-publica';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Consulta con timeout
      const fetchPromise = supabase
        .from('properties')
        .select('id, title, updated_at, property_type, status')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });
      
      // Timeout para evitar bloqueo
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al obtener propiedades')), 3000)
      );
      
      // Competir entre fetch y timeout
      const { data: properties, error } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]);

      if (error) throw error;
      
      // Guardar en caché
      if (properties && properties.length) {
        localStorage.setItem(cacheKey, JSON.stringify(properties));
        localStorage.setItem(cacheKey + '-timestamp', now.toString());
      }
      
      return properties || [];
    } catch (error) {
      console.warn('Error al obtener propiedades para sitemap:', error);
      // Intentar recuperar de caché en caso de error
      const cachedData = localStorage.getItem('acrocx-properties-cache');
      return cachedData ? JSON.parse(cachedData) : [];
    }
  }

  // Función para generar y enviar el sitemap de manera eficiente
  async function generateSitemap() {
    // Verificar si se ha generado un sitemap recientemente
    const lastGenerated = localStorage.getItem('sitemap-last-generated');
    const now = Date.now();
    
    // Generar máximo una vez al día
    if (lastGenerated && (now - parseInt(lastGenerated, 10) < 86400000)) {
      return;
    }
    
    try {
      // Obtener propiedades sin bloquear la UI
      const propertiesPromise = new Promise(resolve => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            fetchProperties().then(resolve);
          }, { timeout: 2000 });
        } else {
          setTimeout(() => {
            fetchProperties().then(resolve);
          }, 2000);
        }
      });
      
      const properties = await propertiesPromise;
      
      // No continuar si no hay propiedades o no hay conexión
      if (!properties.length || !navigator.onLine) return;
      
      // Construir el sitemap - limitar a 50 propiedades máximo para rendimiento
      const limitedProperties = properties.slice(0, 50);
      let sitemapData = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Añadir cada propiedad
      for (const property of limitedProperties) {
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
      
      // Almacenar timestamp de generación
      localStorage.setItem('sitemap-last-generated', now.toString());
      
      // Información para diagnóstico
      localStorage.setItem('sitemap_info', JSON.stringify({
        timestamp: new Date().toISOString(),
        property_count: limitedProperties.length
      }));
      
      // Enviar solo en producción y solo si hay buena conexión
      if (window.location.hostname !== 'localhost' && navigator.onLine) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isFastConnection = connection && 
          (connection.effectiveType === '4g' || connection.effectiveType === '3g') && 
          !connection.saveData;
          
        if (isFastConnection) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);  // 5s timeout
            
            await fetch('/api/update-sitemap', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                properties_count: limitedProperties.length,
                generated_at: new Date().toISOString(),
                sitemap_data: sitemapData
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
          } catch (fetchError) {
            // Silenciar errores en producción para evitar mensajes en consola
            if (window.location.hostname === 'localhost') {
              console.warn('Error enviando datos de sitemap:', fetchError);
            }
          }
        }
      }
    } catch (error) {
      // Silenciar errores en producción para evitar mensajes en consola
      if (window.location.hostname === 'localhost') {
        console.warn('Error generando sitemap:', error);
      }
    }
  }

  // Ejecutar generación de sitemap en tiempo idle
  if (window.location.hostname !== 'localhost') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        generateSitemap();
      }, { timeout: 10000 });
    } else {
      // Fallback para navegadores sin requestIdleCallback
      setTimeout(generateSitemap, 5000);
    }
  }
})(); 