import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { Toaster } from "@/components/ui/toaster";

function DashboardLayout() {
  // Forzar el tema claro para el panel administrativo
  useEffect(() => {
    // Guardar el estado actual del tema
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    // Forzar tema claro mientras está en el panel administrativo
    document.documentElement.classList.remove("dark");
    
    // Ocultar el botón flotante de WhatsApp en el panel de administración
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
      button.style.display = 'none';
    });
    
    // Restaurar el tema original al desmontar el componente
    return () => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      }
      
      // Restaurar la visibilidad del botón de WhatsApp
      whatsappButtons.forEach(button => {
        button.style.display = '';
      });
    };
  }, []);

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