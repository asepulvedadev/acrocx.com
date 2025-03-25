// Service Worker para Acrocx
const CACHE_NAME = 'acrocx-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/index.css',
  '/assets/vendor.js',
  '/assets/main.js',
  '/img/placeholder.jpg',
  '/vite.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Estrategia de caché: Network First para API, Cache First para recursos estáticos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Para peticiones a la API, usar Network First
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Verificar si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta ya que la vamos a usar dos veces
          const responseToCache = response.clone();
          
          // Guardar en caché
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar usar caché
          return caches.match(event.request)
            .then(cachedResponse => {
              // Si hay respuesta en caché, devolverla
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si la petición era para una página HTML, mostrar la página offline
              if (event.request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              
              // Para otros recursos, simplemente fallar
              return new Response('Sin conexión', {
                status: 503,
                statusText: 'Sin conexión a Internet'
              });
            });
        })
    );
  } 
  // Para recursos estáticos, usar Cache First
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Si está en caché, devolver respuesta desde caché
          if (response) {
            return response;
          }
          
          // Si no está en caché, obtener de la red
          return fetch(event.request)
            .then((networkResponse) => {
              // Si la respuesta no es válida, simplemente devolverla
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }
              
              // Clonar la respuesta ya que la vamos a usar dos veces
              const responseToCache = networkResponse.clone();
              
              // Guardar en caché
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return networkResponse;
            })
            .catch(() => {
              // Si falla la petición de un documento HTML, mostrar página offline
              if (event.request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              
              // Si es una imagen, devolver imagen placeholder
              if (event.request.headers.get('Accept').includes('image')) {
                return caches.match('/img/placeholder.jpg');
              }
              
              // Para otros recursos, simplemente fallar
              return new Response('Sin conexión a Internet', {
                status: 503,
                statusText: 'Sin conexión a Internet'
              });
            });
        })
    );
  }
}); 