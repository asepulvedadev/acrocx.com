import React, { useState, useEffect } from 'react';

/**
 * Componente OptimizedImage para carga optimizada de imágenes
 * - Lazy loading: solo carga cuando la imagen está cerca del viewport
 * - Carga progresiva: muestra una versión borrosa mientras carga
 * - Fallback: muestra una imagen por defecto si hay error
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  fallbackSrc = '/placeholder.jpg',
  objectFit = 'cover',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(priority ? src : null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Configuración de IntersectionObserver para lazy loading
  useEffect(() => {
    if (priority || imgSrc) return;

    let observer;
    let imgElement = document.createElement('img');

    const onLoad = () => {
      setImgSrc(src);
      imgElement = null;
    };

    const onError = () => {
      setError(true);
      setImgSrc(fallbackSrc);
      imgElement = null;
    };

    imgElement.onload = onLoad;
    imgElement.onerror = onError;
    imgElement.src = src;

    if ('IntersectionObserver' in window && !priority) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !imgSrc && !error) {
              imgElement.src = src;
            }
          });
        },
        { rootMargin: '200px' }
      );

      const element = document.getElementById(`image-${src.replace(/\W/g, '')}`);
      if (element) observer.observe(element);

      return () => {
        if (observer && element) {
          observer.unobserve(element);
        }
        if (imgElement) {
          imgElement.onload = null;
          imgElement.onerror = null;
        }
      };
    } else {
      imgElement.src = src;
      return () => {
        if (imgElement) {
          imgElement.onload = null;
          imgElement.onerror = null;
        }
      };
    }
  }, [src, priority, imgSrc, error, fallbackSrc]);

  return (
    <div
      id={`image-${src.replace(/\W/g, '')}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {placeholder === 'blur' && !isLoaded && !error && (
        <div
          className="absolute inset-0 bg-slate-200 animate-pulse"
          style={{ backdropFilter: 'blur(10px)' }}
        />
      )}

      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setImgSrc(fallbackSrc);
          }}
          style={{
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage; 