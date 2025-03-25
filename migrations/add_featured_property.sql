-- Agregar campo 'is_featured' a la tabla properties para marcar propiedades destacadas
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Crear índice para consultas más rápidas de propiedades destacadas
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);
