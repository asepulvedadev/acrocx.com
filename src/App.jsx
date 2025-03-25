import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { 
  Building2,
  Key,
  Users,
  Bed,
  Bath,
  Square,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import ImageSlider from "@/components/ImageSlider";
import VideoSlider from "@/components/VideoSlider";
import SearchBox from "@/components/SearchBox";
import { supabase } from "@/lib/supabase";

function App() {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    phone: { value: '', url: '' },
    email: { value: '', url: '' },
    address: { value: '', url: '' },
    facebook: { value: '', url: '' },
    instagram: { value: '', url: '' },
    linkedin: { value: '', url: '' }
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadContactInfo();
    loadFeaturedProperties();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*');

      if (error) throw error;

      const infoObject = {
        phone: { value: '', url: '' },
        email: { value: '', url: '' },
        address: { value: '', url: '' },
        facebook: { value: '', url: '' },
        instagram: { value: '', url: '' },
        linkedin: { value: '', url: '' }
      };

      data.forEach(item => {
        if (infoObject.hasOwnProperty(item.type)) {
          infoObject[item.type] = {
            value: item.value || '',
            url: item.url || ''
          };
        }
      });

      setContactInfo(infoObject);
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const loadFeaturedProperties = async () => {
    setLoadingFeatured(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error loading featured properties:', error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `);

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);

      if (data.length === 0) {
        toast({
          title: "Sin resultados",
          description: "No se encontraron propiedades con los criterios especificados",
        });
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las propiedades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingMessage(true);

    try {
      // Guardar el mensaje en la base de datos
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          status: 'pendiente',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Resetear formulario
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price, status) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + (status === 'renta' ? '/mes' : '');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section con Video */}
      <section className="relative hero-slider">
        <VideoSlider className="h-full" />
      </section>

      {/* Buscador superpuesto */}
      <SearchBox onSearch={handleSearch} />

      {/* Propiedades */}
      <section className="mt-32 py-24">
        <div className="container-custom">
          <h2 className="section-title">
            {properties.length > 0 ? "Resultados de la búsqueda" : "Propiedades Destacadas"}
          </h2>
          
          {properties.length > 0 ? (
            loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <motion.div 
                    key={property.id}
                    className="property-card group"
                    whileHover={{ y: -10 }}
                  >
                    <div className="property-card-image">
                      <img  
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        alt={property.title}
                        src={property.property_images[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'} 
                      />
                    </div>
                    <div className="property-card-content">
                      <h3 className="text-xl font-semibold">
                        {property.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {property.location}
                      </p>
                      <p className="mt-4 text-2xl font-bold text-primary">
                        {formatPrice(property.price, property.status)}
                      </p>
                      <div className="property-features">
                        <span className="feature-item">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms} Recámaras
                        </span>
                        <span className="feature-item">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms} Baños
                        </span>
                        <span className="feature-item">
                          <Square className="h-4 w-4" />
                          {property.area}m²
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            loadingFeatured ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProperties.map((property) => (
                  <motion.div 
                    key={property.id}
                    className="property-card group relative"
                    whileHover={{ y: -10 }}
                  >
                    {/* Indicador de propiedad destacada */}
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-1 text-xs font-medium text-yellow-900 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Destacada
                    </div>
                    
                    <div className="property-card-image">
                      <img  
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        alt={property.title}
                        src={property.property_images[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'} 
                      />
                    </div>
                    <div className="property-card-content">
                      <h3 className="text-xl font-semibold">
                        {property.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {property.location}
                      </p>
                      <p className="mt-4 text-2xl font-bold text-primary">
                        {formatPrice(property.price, property.status)}
                      </p>
                      <div className="property-features">
                        <span className="feature-item">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms} Recámaras
                        </span>
                        <span className="feature-item">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms} Baños
                        </span>
                        <span className="feature-item">
                          <Square className="h-4 w-4" />
                          {property.area}m²
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-white p-8 text-center shadow">
                <p className="text-lg text-muted-foreground">
                  No hay propiedades destacadas en este momento.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-[#6a808b] py-24">
        <div className="container-custom">
          <h2 className="section-title text-white">
            Nuestros Servicios
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div 
              className="service-card group"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Venta de Propiedades</h3>
              <p className="text-muted-foreground">
                Vendemos tu propiedad al mejor precio del mercado con un servicio profesional y personalizado.
              </p>
            </motion.div>

            <motion.div 
              className="service-card group"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <Key className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Renta de Inmuebles</h3>
              <p className="text-muted-foreground">
                Encuentra el hogar perfecto para rentar o permite que nosotros rentemos tu propiedad.
              </p>
            </motion.div>

            <motion.div 
              className="service-card group"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Asesoría Inmobiliaria</h3>
              <p className="text-muted-foreground">
                Te guiamos en todo el proceso de compra, venta o renta con asesoría profesional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold dark:text-white">
                Contáctanos
              </h2>
              <p className="mb-8 text-lg text-muted-foreground dark:text-white/70">
                Estamos aquí para ayudarte con todas tus necesidades inmobiliarias.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Teléfono</p>
                    <a href={contactInfo.phone.url} className="text-muted-foreground dark:text-white/70 hover:text-primary">
                      {contactInfo.phone.value || "No disponible"}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Email</p>
                    <a href={contactInfo.email.url} className="text-muted-foreground dark:text-white/70 hover:text-primary">
                      {contactInfo.email.value || "No disponible"}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Dirección</p>
                    <p className="text-muted-foreground dark:text-white/70">
                      {contactInfo.address.value || "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium dark:text-white">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    className="contact-input dark:bg-background/10 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    className="contact-input dark:bg-background/10 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium dark:text-white">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactInputChange}
                    className="contact-input dark:bg-background/10 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium dark:text-white">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    className="contact-input dark:bg-background/10 dark:text-white"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full" disabled={sendingMessage}>
                  {sendingMessage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  );
}

export default App;
