import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  User,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function ContactMessages() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes de contacto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText("");
    
    // Si el mensaje no ha sido leído, marcarlo como leído
    if (message.status === 'pendiente') {
      updateMessageStatus(message.id, 'leido');
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: status })
        .eq('id', messageId);

      if (error) throw error;

      // Actualizar el estado localmente
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, status: status } : msg
        )
      );

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, status: status }));
      }

      toast({
        title: "Estado actualizado",
        description: `El mensaje ha sido marcado como ${status}`,
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive",
      });
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      // Guardar la respuesta en la base de datos
      const { error } = await supabase
        .from('contact_replies')
        .insert({
          message_id: selectedMessage.id,
          reply_text: replyText,
          sent_at: new Date().toISOString()
        });

      if (error) throw error;

      // Actualizar estado del mensaje a respondido
      await updateMessageStatus(selectedMessage.id, 'respondido');

      // Aquí también puedes implementar el envío de email
      // con la librería que decidas usar

      toast({
        title: "Respuesta enviada",
        description: "Se ha registrado la respuesta al mensaje",
      });

      // Limpiar el campo de respuesta
      setReplyText("");
      
      // Recargar mensajes
      await loadMessages();
    } catch (error) {
      console.error('Error enviando respuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleFilter = () => {
    loadMessages();
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pendiente': return 'Pendiente';
      case 'leido': return 'Leído';
      case 'respondido': return 'Respondido';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pendiente': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'leido': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'respondido': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto space-y-8 py-8"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold">Mensajes de Contacto</h2>
        <Button 
          variant="outline" 
          onClick={loadMessages}
          className="w-full md:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-3">
        <select
          className="rounded-md border bg-white px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="leido">Leídos</option>
          <option value="respondido">Respondidos</option>
        </select>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o contenido"
            className="w-full rounded-md border bg-white py-2 pl-9 pr-3"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <Button onClick={handleFilter} className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {/* Lista y Detalle de Mensajes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Lista de mensajes */}
        <div className="h-[600px] overflow-y-auto rounded-lg border bg-white shadow-sm">
          {messages.length > 0 ? (
            <div className="divide-y">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full p-1 ${
                        message.status === 'pendiente' 
                          ? 'bg-yellow-100' 
                          : message.status === 'leido' 
                            ? 'bg-blue-100' 
                            : 'bg-green-100'
                      }`}>
                        {getStatusIcon(message.status)}
                      </div>
                      <div>
                        <h3 className="font-medium">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm text-gray-600">
                    {message.message.substring(0, 80)}
                    {message.message.length > 80 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-gray-500">
              {loading ? (
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              ) : (
                <MessageSquare className="mb-4 h-12 w-12 text-gray-300" />
              )}
              <h3 className="text-lg font-medium">
                {loading ? "Cargando mensajes..." : "No hay mensajes"}
              </h3>
              <p className="mt-1 text-sm">
                {loading
                  ? "Espera un momento mientras cargamos tus mensajes."
                  : "Cuando recibas mensajes de contacto, aparecerán aquí."}
              </p>
            </div>
          )}
        </div>

        {/* Detalle del mensaje */}
        <div className="h-[600px] rounded-lg border bg-white shadow-sm">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Detalles del mensaje</h3>
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {getStatusIcon(selectedMessage.status)}
                    <span>{getStatusLabel(selectedMessage.status)}</span>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`mailto:${selectedMessage.email}`} 
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${selectedMessage.phone}`} 
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedMessage.phone || "No disponible"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="mb-2 font-medium">Mensaje:</h4>
                <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="border-t p-4">
                <h4 className="mb-2 font-medium">Responder:</h4>
                <textarea
                  className="mb-3 w-full rounded-md border bg-white p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows="3"
                  placeholder="Escribe tu respuesta aquí..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={sendReply}
                    disabled={!replyText.trim() || sendingReply}
                  >
                    {sendingReply ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Respuesta
                      </>
                    )}
                  </Button>
                  
                  {selectedMessage.status !== 'respondido' && (
                    <Button
                      variant="outline"
                      onClick={() => updateMessageStatus(selectedMessage.id, 'respondido')}
                      disabled={sendingReply}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar Respondido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-gray-500">
              <MessageSquare className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-medium">Ningún mensaje seleccionado</h3>
              <p className="mt-1 text-sm">
                Selecciona un mensaje de la lista para ver sus detalles.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ContactMessages; 