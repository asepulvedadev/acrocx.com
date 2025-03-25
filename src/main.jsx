import React, { useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from "./lib/supabase";
import "./index.css";

// Importación normal para rutas críticas
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";

// Importación diferida (lazy loading) para componentes no críticos
const App = lazy(() => import("./App"));
const Ventas = lazy(() => import("./pages/Ventas"));
const Rentas = lazy(() => import("./pages/Rentas"));
const Propietarios = lazy(() => import("./pages/Propietarios"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PropertyForm = lazy(() => import("./pages/admin/PropertyForm"));
const SystemImages = lazy(() => import("./pages/admin/SystemImages"));
const SystemVideos = lazy(() => import("./pages/admin/SystemVideos"));
const ContactInfo = lazy(() => import("./pages/admin/ContactInfo"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));

// Precarga de datos iniciales básicos - evitar múltiples solicitudes
const preloadBasicData = async () => {
  try {
    // Verificar si hay caché válida
    const cacheKey = 'preload_basic_data';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheAge = localStorage.getItem(cacheKey + '-timestamp');
    const now = Date.now();
    
    // Usar caché si existe y tiene menos de 24 horas
    if (cachedData && cacheAge && (now - parseInt(cacheAge, 10) < 86400000)) {
      // Usar datos en caché
      return JSON.parse(cachedData);
    }
    
    // Detección de conexión lenta
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection && 
      (connection.effectiveType === '2g' || 
       connection.effectiveType === 'slow-2g' ||
       connection.saveData || 
       document.documentElement.classList.contains('slow-connection'));
       
    // En conexiones lentas, cargar mínimo indispensable
    if (isSlow) {
      return null;
    }
    
    // Establecer un timeout para cancelar la solicitud si tarda demasiado
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    
    // Cargar solo datos esenciales - ajustar según la app
    const { data, error } = await Promise.race([
      supabase.from('settings').select('site_name,logo_url').single().abortSignal(controller.signal),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
    ]);
    
    clearTimeout(timeoutId);
    
    if (error) throw error;
    
    // Guardar en caché
    if (data) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheKey + '-timestamp', now.toString());
    }
    
    return data;
  } catch (error) {
    console.warn('Error en precarga inicial:', error);
    return null;
  }
};

// Función para cargar el favicon desde la base de datos
const loadFavicon = async () => {
  try {
    const { data, error } = await supabase
      .from('system_images')
      .select('image_url')
      .eq('type', 'favicon')
      .single();

    if (error) throw error;
    
    if (data && data.image_url) {
      // Actualizar el favicon
      const faviconEl = document.getElementById('favicon');
      if (faviconEl) {
        faviconEl.href = data.image_url;
      }
    }
  } catch (error) {
    console.error('Error cargando el favicon:', error);
  }
};

// Cargar el favicon al iniciar la aplicación
loadFavicon();

// Registrar Service Worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
          console.error('Error al registrar Service Worker:', error);
        });
    });
  }
};

// Registrar el Service Worker
registerServiceWorker();

// Fallback durante la carga de componentes
const LoadingFallback = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
  </div>
);

const AppRoutes = () => {
  // También cargar el favicon cuando se monta el componente
  // para asegurar que se carga incluso después de cambios de ruta
  useEffect(() => {
    loadFavicon();
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Rutas del dashboard con layout compartido */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/:id/edit" element={<PropertyForm />} />
            <Route path="system-images" element={<SystemImages />} />
            <Route path="system-videos" element={<SystemVideos />} />
            <Route path="contact-info" element={<ContactInfo />} />
            <Route path="contact-messages" element={<ContactMessages />} />
          </Route>
          
          {/* Rutas del sitio principal */}
          <Route
            path="/"
            element={<Layout><App /></Layout>}
          />
          <Route
            path="/ventas"
            element={<Layout><Ventas /></Layout>}
          />
          <Route
            path="/rentas"
            element={<Layout><Rentas /></Layout>}
          />
          <Route
            path="/propietarios"
            element={<Layout><Propietarios /></Layout>}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<LoadingFallback />}>
        <AppRoutes />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);

// Ejecutar tareas no críticas después de que la app esté renderizada
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    console.log('Aplicación cargada completamente');
    // Iniciar la precarga de datos
    preloadBasicData();
  }, { timeout: 2000 });
} else {
  setTimeout(() => {
    console.log('Aplicación cargada completamente');
    // Iniciar la precarga de datos
    preloadBasicData();
  }, 1000);
}

// Reportar métricas web vitales si está en producción
if (import.meta.env.PROD) {
  import('./utils/reportWebVitals').then(({ reportWebVitals }) => {
    reportWebVitals();
  });
}
