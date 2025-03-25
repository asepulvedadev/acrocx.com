import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function ContactInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: { value: '', url: '' },
    email: { value: '', url: '' },
    address: { value: '', url: '' },
    facebook: { value: '', url: '' },
    instagram: { value: '', url: '' },
    linkedin: { value: '', url: '' }
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadContactInfo();
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
      toast({
        title: "Información cargada",
        description: "Los datos de contacto se han cargado correctamente",
      });
    } catch (error) {
      console.error('Error loading contact info:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de contacto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Primero eliminamos todos los registros existentes
      const { error: deleteError } = await supabase
        .from('contact_info')
        .delete()
        .neq('id', 0); // Esto eliminará todos los registros

      if (deleteError) throw deleteError;

      // Luego insertamos los nuevos registros
      const updates = Object.entries(contactInfo).map(([type, data]) => ({
        type,
        value: data.value || '',
        url: data.url || ''
      }));

      const { error: insertError } = await supabase
        .from('contact_info')
        .insert(updates);

      if (insertError) throw insertError;

      toast({
        title: "Éxito",
        description: "Información de contacto actualizada correctamente",
      });

      // Recargar la información
      await loadContactInfo();
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la información: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (type, field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const getIcon = (type) => {
    const icons = {
      phone: Phone,
      email: Mail,
      address: MapPin,
      facebook: Facebook,
      instagram: Instagram,
      linkedin: Linkedin
    };
    const Icon = icons[type];
    return <Icon className="h-5 w-5" />;
  };

  const getLabel = (type) => {
    const labels = {
      phone: 'Teléfono',
      email: 'Correo electrónico',
      address: 'Dirección',
      facebook: 'Facebook',
      instagram: 'Instagram',
      linkedin: 'LinkedIn'
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl space-y-8 py-8"
      >
        {/* Información de Contacto */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Datos de Contacto</h2>
          <div className="space-y-4">
            {['phone', 'email', 'address'].map((type) => (
              <div key={type} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  {getIcon(type)}
                  {getLabel(type)}
                </label>
                <input
                  type="text"
                  value={contactInfo[type].value}
                  onChange={(e) => handleChange(type, 'value', e.target.value)}
                  className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={`Ingrese ${getLabel(type).toLowerCase()}`}
                />
                {type !== 'address' && (
                  <input
                    type="text"
                    value={contactInfo[type].url}
                    onChange={(e) => handleChange(type, 'url', e.target.value)}
                    placeholder={`URL (${type === 'phone' ? 'tel:' : 'mailto:'} o link completo)`}
                    className="w-full rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Redes Sociales */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Redes Sociales</h2>
          <div className="space-y-4">
            {['facebook', 'instagram', 'linkedin'].map((type) => (
              <div key={type} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  {getIcon(type)}
                  {getLabel(type)}
                </label>
                <input
                  type="text"
                  value={contactInfo[type].value}
                  onChange={(e) => handleChange(type, 'value', e.target.value)}
                  placeholder="Nombre de usuario o título"
                  className="w-full rounded-md border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="url"
                  value={contactInfo[type].url}
                  onChange={(e) => handleChange(type, 'url', e.target.value)}
                  placeholder="URL completa del perfil"
                  className="w-full rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export default ContactInfo;
