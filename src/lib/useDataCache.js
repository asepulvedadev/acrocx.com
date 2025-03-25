import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

// Caché en memoria para almacenar resultados de consultas
const dataCache = new Map();

/**
 * Hook personalizado para gestionar datos con caché
 * - Evita solicitudes repetidas al servidor
 * - Almacena los resultados en caché para acceso rápido
 * - Actualiza datos cuando es necesario
 */
export const useDataCache = (
  tableName, 
  query = {}, 
  options = { 
    enabled: true, 
    cacheDuration: 5 * 60 * 1000,  // 5 minutos por defecto
    initialData: null,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    staleWhileRevalidate: true,
  }
) => {
  const [data, setData] = useState(options.initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(0);

  // Crear una clave única para esta consulta
  const cacheKey = `${tableName}:${JSON.stringify(query)}`;

  // Función para obtener datos del servidor
  const fetchData = useCallback(async (skipCache = false) => {
    // Si está deshabilitada, no hacemos nada
    if (!options.enabled) return;

    // Comprobar si tenemos datos en caché y son válidos
    const now = Date.now();
    const cachedItem = dataCache.get(cacheKey);
    const isCacheValid = 
      cachedItem && 
      (now - cachedItem.timestamp < options.cacheDuration);

    // Si tenemos caché válida y no estamos forzando una actualización
    if (isCacheValid && !skipCache) {
      setData(cachedItem.data);
      setLastFetched(cachedItem.timestamp);
      // Si staleWhileRevalidate está activado, refrescaremos en segundo plano
      if (options.staleWhileRevalidate && (now - lastFetched > options.cacheDuration / 2)) {
        fetchData(true); // Revalidar en segundo plano
      }
      return;
    }

    // Si llegamos aquí, necesitamos obtener datos frescos
    setIsLoading(true);
    
    try {
      let dataQuery = supabase.from(tableName);

      // Aplicar filtros, ordenación, etc. desde el objeto de consulta
      if (query.select) dataQuery = dataQuery.select(query.select);
      if (query.eq) {
        for (const [key, value] of Object.entries(query.eq)) {
          dataQuery = dataQuery.eq(key, value);
        }
      }
      if (query.order) {
        for (const [column, direction] of Object.entries(query.order)) {
          dataQuery = dataQuery.order(column, { ascending: direction === 'asc' });
        }
      }
      if (query.limit) dataQuery = dataQuery.limit(query.limit);
      if (query.range) dataQuery = dataQuery.range(query.range[0], query.range[1]);

      const { data: result, error: fetchError } = await dataQuery;
      
      if (fetchError) throw fetchError;
      
      // Actualizar el estado y la caché
      setData(result);
      setLastFetched(now);
      
      // Guardar en caché
      dataCache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [tableName, cacheKey, options.enabled, options.cacheDuration, options.staleWhileRevalidate, lastFetched, query]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (options.revalidateOnMount) {
      fetchData();
    }
  }, [fetchData, options.revalidateOnMount]);

  // Efecto para revalidar al recuperar el foco
  useEffect(() => {
    if (!options.revalidateOnFocus) return;

    const handleFocus = () => {
      // Solo revalidamos si han pasado al menos 10 segundos desde la última carga
      if (Date.now() - lastFetched > 10000) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, lastFetched, options.revalidateOnFocus]);

  // Función para invalidar manualmente el caché
  const invalidateCache = () => {
    dataCache.delete(cacheKey);
    fetchData(true);
  };

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),  // Forzar recarga omitiendo caché
    invalidateCache,
    lastFetched
  };
};

export default useDataCache; 