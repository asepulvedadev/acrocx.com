import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';

// Hook optimizado para cargar datos con caché, reintentos y detección de conexión lenta
export function useDataCache(tableName, query = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Referencias para controlar timeout y cancelaciones
  const abortController = useRef(null);
  const timeoutRef = useRef(null);
  
  // Opciones con valores por defecto
  const {
    cacheKey = `cache_${tableName}`,
    cacheDuration = 10 * 60 * 1000, // 10 minutos por defecto
    autoRefresh = false,
    refreshInterval = 60 * 1000, // 1 minuto por defecto
    timeoutDuration = 15000, // 15 segundos timeout
    retryCount = 2,
    dependencies = [],
    onSuccess = null,
    skipCache = false
  } = options;
  
  // Función memoizada para cargar datos
  const fetchData = useCallback(async (retryAttempt = 0) => {
    // Limpiar controlador anterior si existe
    if (abortController.current) {
      abortController.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Crear nuevo controlador y timeout
    abortController.current = new AbortController();
    
    try {
      setLoading(true);
      
      // Intentar obtener datos de caché primero (si no se pide saltar caché)
      if (!skipCache) {
        try {
          const cachedItem = localStorage.getItem(cacheKey);
          if (cachedItem) {
            const { data: cachedData, timestamp } = JSON.parse(cachedItem);
            const now = Date.now();
            
            // Si caché es válido, usar datos en caché
            if (now - timestamp < cacheDuration) {
              setData(cachedData);
              setLoading(false);
              
              // Si hay callback de éxito, llamarlo con datos en caché
              if (onSuccess) onSuccess(cachedData);
              
              // Si no hay autoRefresh, terminar aquí
              if (!autoRefresh) return;
            }
          }
        } catch (cacheError) {
          // Error leyendo caché, ignorarlo y continuar con fetch
          console.warn('Error leyendo caché:', cacheError);
        }
      }
      
      // Configiurar timeout
      timeoutRef.current = setTimeout(() => {
        abortController.current?.abort();
      }, timeoutDuration);
      
      // Detectar si tenemos una conexión lenta
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlow = connection && 
        (connection.effectiveType === '2g' || 
         connection.effectiveType === 'slow-2g' || 
         connection.saveData || 
         document.documentElement.classList.contains('slow-connection'));
         
      // Para conexiones lentas, usar límites menores en consultas
      const modifiedQuery = { ...query };
      if (isSlow && modifiedQuery.limit && modifiedQuery.limit > 20) {
        modifiedQuery.limit = 20;
      }
      
      // Realizar consulta a Supabase
      let supabaseQuery = supabase.from(tableName);
      
      // Aplicar filtros, ordenamientos, etc.
      if (modifiedQuery.select) supabaseQuery = supabaseQuery.select(modifiedQuery.select);
      if (modifiedQuery.filter) {
        const { column, value, operator = 'eq' } = modifiedQuery.filter;
        supabaseQuery = supabaseQuery[operator](column, value);
      }
      if (modifiedQuery.filters) {
        modifiedQuery.filters.forEach(filter => {
          const { column, value, operator = 'eq' } = filter;
          supabaseQuery = supabaseQuery[operator](column, value);
        });
      }
      if (modifiedQuery.order) {
        const { column, ascending = false } = modifiedQuery.order;
        supabaseQuery = supabaseQuery.order(column, { ascending });
      }
      if (modifiedQuery.limit) supabaseQuery = supabaseQuery.limit(modifiedQuery.limit);
      
      // Añadir señal de cancelación
      supabaseQuery = supabaseQuery.abortSignal(abortController.current.signal);
      
      // Ejecutar consulta
      const { data: freshData, error: supabaseError } = await supabaseQuery;
      
      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (supabaseError) throw supabaseError;
      
      // Guardar datos en caché y estado
      setData(freshData);
      
      // Guardar en localStorage si no se está saltando caché
      if (!skipCache) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          }));
        } catch (saveError) {
          console.warn('Error guardando en caché:', saveError);
        }
      }
      
      // Llamar callback de éxito
      if (onSuccess) onSuccess(freshData);
      
      setError(null);
    } catch (err) {
      // No establecer error para operaciones abortadas
      if (err.name === 'AbortError') {
        console.info('Operación cancelada:', tableName);
        return;
      }
      
      // Para timeout, mostrar mensaje amigable
      if (err.message?.includes('timeout') || err.name === 'TimeoutError') {
        setError(new Error('La conexión es lenta. Intentando de nuevo...'));
      } else {
        setError(err);
      }
      
      // Reintentar si hay intentos disponibles
      if (retryAttempt < retryCount) {
        console.info(`Reintentando consulta (${retryAttempt + 1}/${retryCount})...`);
        setTimeout(() => {
          fetchData(retryAttempt + 1);
        }, 2000 * (retryAttempt + 1)); // Incrementar tiempo entre reintentos
      }
    } finally {
      setLoading(false);
    }
  }, [tableName, JSON.stringify(query), cacheKey, cacheDuration, skipCache, retryCount, timeoutDuration, refreshCounter, ...dependencies]);
  
  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData();
    
    // Configurar actualización automática
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }
    
    // Limpieza al desmontar
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (abortController.current) abortController.current.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchData, autoRefresh, refreshInterval]);
  
  // Función para forzar recarga
  const refresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  // Función para actualizar caché directamente (útil después de mutaciones)
  const updateCache = useCallback((newData) => {
    setData(newData);
    
    if (!skipCache) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }));
      } catch (saveError) {
        console.warn('Error guardando en caché:', saveError);
      }
    }
  }, [cacheKey, skipCache]);
  
  // Función para limpiar caché
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
    } catch (e) {
      console.warn('Error al limpiar caché:', e);
    }
  }, [cacheKey]);
  
  return { 
    data, 
    loading, 
    error, 
    refresh, 
    updateCache,
    clearCache
  };
}

export default useDataCache; 