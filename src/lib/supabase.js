import { createClient } from '@supabase/supabase-js';

// Configuración central de Supabase
const supabaseUrl = 'https://uhzwwuztewzvqmzicziy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoend3dXp0ZXd6dnFtemljeml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDgxOTUsImV4cCI6MjA1Nzk4NDE5NX0._V91V4x56TtLSCqWIE0QTUhgvWs5vyZvBW1MZsFmjZM';

// Función para crear una instancia optimizada del cliente
const createSupabaseClient = () => {
  // Cache para evitar múltiples instancias
  if (window._supabaseClient) {
    return window._supabaseClient;
  }
  
  // Detectar si estamos en una conexión lenta
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlow = connection && 
    (connection.effectiveType === '2g' || 
     connection.effectiveType === 'slow-2g' || 
     connection.saveData || 
     document.documentElement.classList.contains('slow-connection'));
  
  // Configuraciones optimizadas según tipo de conexión
  const config = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Reducir frecuencia de refreshes en conexiones lentas
      flowType: isSlow ? 'implicit' : 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'acrocx-web',
      },
    },
    // Optimizaciones para conexiones lentas
    realtime: {
      // Solo activar en conexiones rápidas
      eventsPerSecond: isSlow ? 1 : 10,
    },
    storage: {
      // Optimización de reintentos según conexión
      maxRetryAttempts: isSlow ? 1 : 3,
      timeoutSeconds: isSlow ? 60 : 30,
    },
    db: {
      schema: 'public',
    },
  };
  
  // Crear cliente con configuración optimizada
  const client = createClient(supabaseUrl, supabaseAnonKey, config);
  
  // Guardar en cache global
  window._supabaseClient = client;
  
  return client;
};

// Exportar cliente singleton optimizado
export const supabase = createSupabaseClient();

// Función de prueba de conexión con timeout
export const testConnection = async () => {
  try {
    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const { data, error } = await supabase
      .from('properties')
      .select('count')
      .single()
      .abortSignal(controller.signal);
    
    clearTimeout(timeoutId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    // Detectar si es un error de timeout
    if (error.name === 'AbortError') {
      console.warn('Conexión lenta a Supabase, timeout alcanzado');
      return false;
    }
    
    console.error('Error de conexión:', error.message);
    return false;
  }
};

// Funciones de autenticación mejoradas
export const signIn = async (email, password) => {
  try {
    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }, { abortSignal: controller.signal });
    
    clearTimeout(timeoutId);
    
    if (error) throw error;

    // Guardar el token de sesión
    if (data?.session) {
      localStorage.setItem('adminToken', data.session.access_token);
    }

    return data;
  } catch (error) {
    // Manejar error de timeout
    if (error.name === 'AbortError') {
      throw new Error('La conexión es demasiado lenta. Inténtalo de nuevo más tarde.');
    }
    
    console.error('Error de autenticación:', error.message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Limpiar el token almacenado
    localStorage.removeItem('adminToken');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    throw error;
  }
};

// Verificar estado de autenticación
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error al verificar autenticación:', error.message);
    return null;
  }
};

// Función auxiliar para manejar errores de storage
export const handleStorageError = (error) => {
  if (error.message.includes('storage/object-not-found')) {
    return 'El archivo no existe';
  }
  if (error.message.includes('storage/unauthorized')) {
    return 'No tienes permisos para realizar esta acción';
  }
  if (error.message.includes('storage/quota-exceeded')) {
    return 'Se ha excedido la cuota de almacenamiento';
  }
  return error.message;
};
