import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  Home,
  Building2,
  Key,
  Users,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  MessageSquare,
  Copyright,
  Scale,
  Heart,
  Twitter,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: { value: '', url: '' },
    email: { value: '', url: '' },
    address: { value: '', url: '' },
    facebook: { value: '', url: '' },
    instagram: { value: '', url: '' },
    linkedin: { value: '', url: '' }
  });

  useEffect(() => {
    // Aplicar modo oscuro por defecto
    document.documentElement.classList.add("dark");
    loadContactInfo();
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('system_images')
        .select('image_url')
        .eq('type', 'logo')
        .single();

      if (error) throw error;
      if (data) setLogo(data.image_url);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*');

      if (error) throw error;

      const infoObject = {};
      data.forEach(item => {
        infoObject[item.type] = {
          value: item.value,
          url: item.url
        };
      });

      setContactInfo(infoObject);
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Formatear URL de WhatsApp si no comienza con "https://"
  const getWhatsAppUrl = () => {
    let url = contactInfo.phone.url || "https://wa.me/528181234567";
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      // Si es un número de teléfono sin formato de URL, crear URL de WhatsApp
      const phoneNumber = url.replace(/\D/g, ''); // Eliminar caracteres no numéricos
      url = `https://wa.me/${phoneNumber}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navegación */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
              {logo ? (
                <img 
                  src={logo} 
                  alt="Acrocx" 
                  className="h-8 w-auto dark:brightness-0 dark:invert"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  Acrocx
                </span>
              )}
            </Link>

            {/* Menú Principal Centrado */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-8 md:flex">
              <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <Link to="/ventas" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                <Building2 className="h-4 w-4" />
                Ventas
              </Link>
              <Link to="/rentas" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                <Key className="h-4 w-4" />
                Rentas
              </Link>
              <Link to="/propietarios" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                <Users className="h-4 w-4" />
                Propietarios
              </Link>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center gap-2">
              {/* Botón de WhatsApp en el Header */}
              <a 
                href={getWhatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full bg-green-500 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-green-600 md:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hidden md:flex"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Menú Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-background md:hidden"
            >
              <div className="container-custom py-4">
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Home className="h-4 w-4" />
                    Inicio
                  </Link>
                  <Link 
                    to="/ventas" 
                    className="flex items-center gap-2 text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Building2 className="h-4 w-4" />
                    Ventas
                  </Link>
                  <Link 
                    to="/rentas" 
                    className="flex items-center gap-2 text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Key className="h-4 w-4" />
                    Rentas
                  </Link>
                  <Link 
                    to="/propietarios" 
                    className="flex items-center gap-2 text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Users className="h-4 w-4" />
                    Propietarios
                  </Link>
                  {/* Botón de WhatsApp en menú móvil */}
                  <a 
                    href={getWhatsAppUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="justify-start"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Modo Claro
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Modo Oscuro
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Botón flotante de WhatsApp */}
      <a 
        href={getWhatsAppUrl()} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container-custom py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Contacto */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {contactInfo.address?.value || 'Av. Insurgentes Sur 1602, Crédito Constructor, Benito Juárez, 03940 Ciudad de México, CDMX'}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {contactInfo.phone?.value || '+52 (55) 1234-5678'}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {contactInfo.email?.value || 'contacto@acrocx.com'}
                </p>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ventas" className="text-muted-foreground hover:text-primary transition-colors">
                    Propiedades en Venta
                  </Link>
                </li>
                <li>
                  <Link to="/rentas" className="text-muted-foreground hover:text-primary transition-colors">
                    Propiedades en Renta
                  </Link>
                </li>
                <li>
                  <Link to="/propietarios" className="text-muted-foreground hover:text-primary transition-colors">
                    Área de Propietarios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Redes Sociales</h3>
              <div className="flex gap-4">
                <a
                  href={contactInfo.facebook?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={contactInfo.instagram?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={contactInfo.linkedin?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacidad" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Lock className="h-4 w-4" />
                    Políticas de Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/derechos-autor" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Copyright className="h-4 w-4" />
                    Derechos de Autor
                  </Link>
                </li>
                <li>
                  <Link to="/terminos-condiciones" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Scale className="h-4 w-4" />
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Derechos de Autor */}
          <div className="mt-8 border-t pt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Acrocx Inmobiliaria</span>
              <span>•</span>
              <span>Hecho por <a href="#" className="text-muted-foreground hover:underline">CraftIA</a></span>
              <span>•</span>
              <a href="/admin" className="flex items-center gap-1 text-muted-foreground hover:underline">
                <Settings className="h-3 w-3" />
                Panel Administrativo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
