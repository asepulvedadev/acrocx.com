
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhzwwuztewzvqmzicziy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoend3dXp0ZXd6dnFtemljeml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDgxOTUsImV4cCI6MjA1Nzk4NDE5NX0._V91V4x56TtLSCqWIE0QTUhgvWs5vyZvBW1MZsFmjZM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  storage: {
    // Configuración específica para storage
    maxRetryAttempts: 3,
    timeoutSeconds: 30,
  },
});

// Función de prueba de conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('properties').select('count').single();
    if (error) throw error;
    console.log('Conexión exitosa a Supabase');
    return true;
  } catch (error) {
    console.error('Error de conexión:', error.message);
    return false;
  }
};

// Funciones de autenticación mejoradas
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;

    // Guardar el token de sesión
    if (data?.session) {
      localStorage.setItem('adminToken', data.session.access_token);
    }

    return data;
  } catch (error) {
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
