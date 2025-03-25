import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente LazySection para cargar contenido de manera diferida
 * - Solo carga el contenido cuando la sección está cerca del viewport
 * - Muestra un placeholder mientras se carga
 * - Reduce el tiempo de carga inicial de la página
 */
const LazySection = ({ 
  children, 
  className = '',
  placeholder = null,
  threshold = 0.1,
  rootMargin = '200px',
  height = 'auto',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando la sección entra en el viewport, la marcamos como visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez visible, dejamos de observar
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: rootMargin,
        threshold: threshold,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold]);

  // Fallback para navegadores que no soportan IntersectionObserver
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
    }
  }, []);

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight: !isVisible ? height : 'auto' }}
    >
      {isVisible ? (
        children
      ) : (
        placeholder || (
          <div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-200 rounded-md" style={{ minHeight: height }}>
            <span className="sr-only">Cargando contenido...</span>
          </div>
        )
      )}
    </div>
  );
};

export default LazySection; 