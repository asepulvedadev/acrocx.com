import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { Toaster } from "@/components/ui/toaster";
import { checkAuth, updateLastActivity } from "@/lib/supabase";

function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const session = await checkAuth();
      if (!session) {
        navigate("/admin/login");
      }
    };

    // Verificar autenticación al montar el componente
    verifyAuth();

    // Verificar autenticación cada 5 minutos
    const authInterval = setInterval(verifyAuth, 5 * 60 * 1000);

    // Actualizar última actividad cuando hay interacción del usuario
    const handleActivity = () => {
      updateLastActivity();
    };

    // Agregar listeners para detectar actividad
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Forzar el tema claro para el panel administrativo
    const isDarkMode = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");
    
    // Ocultar el botón flotante de WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
      button.style.display = 'none';
    });
    
    return () => {
      // Limpiar intervalos y event listeners
      clearInterval(authInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);

      // Restaurar tema y botón de WhatsApp
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      }
      whatsappButtons.forEach(button => {
        button.style.display = '';
      });
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <main className="container-custom py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export default DashboardLayout; 