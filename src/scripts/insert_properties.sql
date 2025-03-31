-- Agregar la columna google_maps_url a la tabla properties
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Agregar la columna alt_text a la tabla property_images
ALTER TABLE property_images
ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- Insertar las propiedades
INSERT INTO properties (
  title,
  description,
  price,
  location,
  type,
  status,
  bedrooms,
  bathrooms,
  area,
  is_featured,
  google_maps_url
) VALUES 
(
  'Casa Moderna en Lomas de Chapultepec',
  'Hermosa casa de diseño contemporáneo con acabados de lujo, ubicada en una de las zonas más exclusivas de la Ciudad de México. Cuenta con amplios espacios, jardín, alberca y área de entretenimiento.',
  25000000,
  'Lomas de Chapultepec, Miguel Hidalgo, CDMX',
  'casa',
  'venta',
  4,
  3.5,
  450,
  true,
  'https://maps.google.com/?q=19.4194,-99.2047'
),
(
  'Departamento de Lujo en Polanco',
  'Espectacular departamento con vista panorámica, acabados premium y amenidades de primer nivel. Ubicado en un edificio de prestigio con seguridad 24/7 y múltiples amenidades.',
  15000000,
  'Polanco, Miguel Hidalgo, CDMX',
  'departamento',
  'venta',
  3,
  2,
  280,
  true,
  'https://maps.google.com/?q=19.4326,-99.1332'
),
(
  'Local Comercial en Plaza Galerías',
  'Excelente local comercial en una de las plazas más importantes de la ciudad. Ubicado en planta baja con alto tráfico peatonal, ideal para negocio de retail o restaurante.',
  18000000,
  'Plaza Galerías, Azcapotzalco, CDMX',
  'local_comercial',
  'venta',
  0,
  0,
  350,
  false,
  'https://maps.google.com/?q=19.4872,-99.1894'
);

-- Obtener los IDs de las propiedades insertadas
WITH property_ids AS (
  SELECT id, title FROM properties 
  WHERE title IN (
    'Casa Moderna en Lomas de Chapultepec',
    'Departamento de Lujo en Polanco',
    'Local Comercial en Plaza Galerías'
  )
)

-- Insertar las imágenes
INSERT INTO property_images (property_id, image_url, alt_text)
SELECT 
  p.id,
  unnest(ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c153a9e',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'
  ]) as image_url,
  unnest(ARRAY[
    'Fachada principal de la casa',
    'Sala de estar',
    'Cocina integrada',
    'Alberca y jardín',
    'Recámara principal'
  ]) as alt_text
FROM property_ids p
WHERE p.title = 'Casa Moderna en Lomas de Chapultepec'

UNION ALL

SELECT 
  p.id,
  unnest(ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1502005097973-6a7082348e28'
  ]) as image_url,
  unnest(ARRAY[
    'Vista exterior del edificio',
    'Sala con vista panorámica',
    'Cocina de diseño',
    'Terraza con vista',
    'Recámara principal'
  ]) as alt_text
FROM property_ids p
WHERE p.title = 'Departamento de Lujo en Polanco'

UNION ALL

SELECT 
  p.id,
  unnest(ARRAY[
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
  ]) as image_url,
  unnest(ARRAY[
    'Fachada del local',
    'Interior del local',
    'Área de almacenamiento',
    'Vista desde la calle',
    'Área de servicio'
  ]) as alt_text
FROM property_ids p
WHERE p.title = 'Local Comercial en Plaza Galerías'; 