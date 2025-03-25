import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Maximize2,
  X,
  Filter,
  ArrowUpDown,
  Bed,
  Bath,
  Square,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    location: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc"
  });

  const navigate = useNavigate();
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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Propiedad eliminada correctamente",
      });

      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la propiedad",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id, currentValue) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_featured: !currentValue })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: !currentValue 
          ? "Propiedad marcada como destacada" 
          : "Propiedad desmarcada como destacada",
      });

      await loadProperties();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado destacado",
        variant: "destructive",
      });
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

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));

    const sortedProperties = [...properties].sort((a, b) => {
      if (key === "price") {
        return sortConfig.direction === "asc" 
          ? b.price - a.price 
          : a.price - b.price;
      }
      return sortConfig.direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setProperties(sortedProperties);
  };

  const handleFilter = () => {
    loadProperties().then(() => {
      let filteredData = [...properties];

      if (filters.status) {
        filteredData = filteredData.filter(p => p.status === filters.status);
      }
      if (filters.type) {
        filteredData = filteredData.filter(p => p.type === filters.type);
      }
      if (filters.location) {
        filteredData = filteredData.filter(p => 
          p.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      setProperties(filteredData);
    });
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Propiedades</h1>
        <Button onClick={() => navigate("/admin/properties/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <select
          className="rounded-md border bg-white px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Estado</option>
          <option value="venta">Venta</option>
          <option value="renta">Renta</option>
        </select>
        <select
          className="rounded-md border bg-white px-3 py-2"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Tipo</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
        </select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ubicación"
            className="w-full rounded-md border bg-white py-2 pl-9 pr-3"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
        <Button onClick={handleFilter}>
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {/* Lista de propiedades */}
      {loading ? (
        <div className="text-center text-gray-600">
          Cargando propiedades...
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center text-gray-600">
          No se encontraron propiedades
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 text-left font-medium">Imagen</th>
                  <th className="p-4 text-left font-medium">
                    <button 
                      className="flex items-center gap-2"
                      onClick={() => handleSort('title')}
                    >
                      Título
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 text-left font-medium">
                    <button 
                      className="flex items-center gap-2"
                      onClick={() => handleSort('location')}
                    >
                      Ubicación
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 text-left font-medium">
                    <button 
                      className="flex items-center gap-2"
                      onClick={() => handleSort('price')}
                    >
                      Precio
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="p-4 text-left font-medium">Detalles</th>
                  <th className="p-4 text-left font-medium">Estado</th>
                  <th className="p-4 text-center font-medium">Destacada</th>
                  <th className="p-4 text-center font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {property.property_images && property.property_images.length > 0 ? (
                        <img
                          src={property.property_images[0].image_url}
                          alt={property.title}
                          className="h-16 w-24 rounded-md object-cover"
                          onClick={() => setSelectedProperty(property)}
                        />
                      ) : (
                        <div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="p-4">{property.title}</td>
                    <td className="p-4">{property.location}</td>
                    <td className="p-4">{formatPrice(property.price)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" /> {property.bedrooms} Rec.
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" /> {property.bathrooms} Baños
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="h-4 w-4" /> {property.area} m²
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        property.status === 'venta' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {property.status === 'venta' ? 'Venta' : 'Renta'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(property.id, property.is_featured)}
                        className={property.is_featured ? "text-yellow-500" : "text-gray-400"}
                        title={property.is_featured ? "Quitar de destacados" : "Marcar como destacada"}
                      >
                        <Star className="h-5 w-5" fill={property.is_featured ? "currentColor" : "none"} />
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de imagen */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-white hover:bg-white/20"
                onClick={() => setSelectedProperty(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedProperty.property_images[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                alt={selectedProperty.title}
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;
