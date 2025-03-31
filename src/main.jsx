import React, { useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";

// Importación de estilos
import "./index.css";
import "./critical.css";

// Importación normal para rutas críticas
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";

// Importación diferida (lazy loading) para componentes no críticos
const App = lazy(() => import("./App"));
const Ventas = lazy(() => import("./pages/Ventas"));
const Rentas = lazy(() => import("./pages/Rentas"));
const Propietarios = lazy(() => import("./pages/Propietarios"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const CopyrightPage = lazy(() => import("./pages/legal/Copyright"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PropertyForm = lazy(() => import("./pages/admin/PropertyForm"));
const SystemImages = lazy(() => import("./pages/admin/SystemImages"));
const SystemVideos = lazy(() => import("./pages/admin/SystemVideos"));
const ContactInfo = lazy(() => import("./pages/admin/ContactInfo"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));

// Fallback durante la carga de componentes
const LoadingFallback = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
  </div>
);

// Función simplificada para cargar recursos básicos
const loadBasicResources = async () => {
  try {
    // Cargar favicon
    const { data } = await supabase
      .from('system_images')
      .select('image_url')
      .eq('type', 'favicon')
      .single();
    
    if (data && data.image_url) {
      const faviconEl = document.getElementById('favicon');
      if (faviconEl) {
        faviconEl.href = data.image_url;
      }
    }
  } catch (error) {
    console.warn('Error cargando recursos básicos:', error);
  }
};

// Registrar Service Worker de forma simplificada
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const AppRoutes = () => {
  // Cargar recursos básicos al montar el componente
  useEffect(() => {
    loadBasicResources();
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
          <Route
            path="/privacidad"
            element={<Layout><Privacy /></Layout>}
          />
          <Route
            path="/derechos-autor"
            element={<Layout><CopyrightPage /></Layout>}
          />
          <Route
            path="/terminos-condiciones"
            element={<Layout><Terms /></Layout>}
          />
          
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
