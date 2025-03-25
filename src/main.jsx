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

// Componente para mostrar durante la carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-gray-700">Cargando...</p>
    </div>
  </div>
);

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

// Optimización: Renderizar primero el estado de carga y luego hidratar
let appMounted = false;
const renderApp = () => {
  if (!appMounted) {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <HelmetProvider>
          <AppRoutes />
        </HelmetProvider>
      </React.StrictMode>
    );
    appMounted = true;
  }
};

// Si documento está listo, renderizar inmediatamente
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(renderApp, 0);
} else {
  // De lo contrario, esperar a que esté listo
  document.addEventListener('DOMContentLoaded', renderApp);
}
