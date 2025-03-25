import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Ventas from "./pages/Ventas";
import Rentas from "./pages/Rentas";
import Propietarios from "./pages/Propietarios";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PropertyForm from "./pages/admin/PropertyForm";
import SystemImages from "./pages/admin/SystemImages";
import SystemVideos from "./pages/admin/SystemVideos";
import ContactInfo from "./pages/admin/ContactInfo";
import ContactMessages from "./pages/admin/ContactMessages";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { supabase } from "./lib/supabase";
import "./index.css";

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

const AppRoutes = () => {
  // También cargar el favicon cuando se monta el componente
  // para asegurar que se carga incluso después de cambios de ruta
  useEffect(() => {
    loadFavicon();
  }, []);

  return (
    <Router>
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
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
