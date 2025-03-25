import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Building2, 
  Home,
  Image,
  Video,
  Phone,
  LogOut,
  ChevronDown,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase, signOut } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

function DashboardHeader() {
  const [logo, setLogo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('system_images')
        .select('*')
        .eq('type', 'logo')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setLogo(data.image_url);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: <Home className="h-4 w-4" />, label: "Ir al sitio web" },
    { path: "/admin/dashboard", icon: <Building2 className="h-4 w-4" />, label: "Propiedades" },
    { path: "/admin/system-images", icon: <Image className="h-4 w-4" />, label: "Gestionar Imágenes" },
    { path: "/admin/system-videos", icon: <Video className="h-4 w-4" />, label: "Gestionar Videos" },
    { path: "/admin/contact-info", icon: <Phone className="h-4 w-4" />, label: "Información de Contacto" },
    { path: "/admin/contact-messages", icon: <MessageSquare className="h-4 w-4" />, label: "Mensajes de Contacto" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              {logo ? (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-8 w-auto max-w-[180px]" 
                />
              ) : (
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <Building2 className="h-6 w-6" />
                  Acrocx
                </div>
              )}
            </Link>
            
            <div className="hidden items-center gap-1 md:flex">
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden text-muted-foreground hover:text-foreground md:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
            
            <Button
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-card md:hidden"
          >
            <div className="container-custom py-4">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive(item.path) 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="mt-2 justify-start text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default DashboardHeader; 