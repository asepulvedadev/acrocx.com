
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search,
  Building2,
  MapPin,
  Bed,
  Bath,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import ImageSlider from "@/components/ImageSlider";

function Ventas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    maxPrice: "",
    minBedrooms: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'venta')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las propiedades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'venta');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.minBedrooms) {
        query = query.gte('bedrooms', parseInt(filters.minBedrooms));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error searching properties:', error);
      toast({
        title: "Error",
        description: "Error al buscar propiedades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section con Slider */}
      <section className="relative h-[40vh] w-full overflow-hidden">
        <ImageSlider type="slider_sales" className="h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Encuentra tu Próxima Propiedad
            </h1>
            <p className="text-lg opacity-90">
              Las mejores opciones en venta en Monterrey
            </p>
          </div>
        </div>
      </section>

      {/* Buscador */}
      <section className="py-12">
        <div className="container-custom">
          <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ubicación"
                className="search-input pl-10"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            <select 
              className="search-input"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Tipo de Propiedad</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
            <select 
              className="search-input"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            >
              <option value="">Precio Máximo</option>
              <option value="3000000">Hasta $3,000,000</option>
              <option value="5000000">Hasta $5,000,000</option>
              <option value="10000000">Hasta $10,000,000</option>
              <option value="15000000">Hasta $15,000,000</option>
            </select>
            <select 
              className="search-input"
              value={filters.minBedrooms}
              onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value })}
            >
              <option value="">Recámaras</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <Button type="submit" className="h-full">
              <Search className="mr-2 h-5 w-5" />
              Buscar
            </Button>
          </form>
        </div>
      </section>

      {/* Listado de Propiedades */}
      <section className="pb-24">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-muted-foreground">Cargando propiedades...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No se encontraron propiedades que coincidan con tu búsqueda
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
                      {formatPrice(property.price)}
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
          )}
        </div>
      </section>
    </div>
  );
}

export default Ventas;
