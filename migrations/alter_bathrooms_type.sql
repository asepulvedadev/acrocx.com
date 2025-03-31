-- Modificar el tipo de dato de bathrooms a decimal
ALTER TABLE properties 
ALTER COLUMN bathrooms TYPE DECIMAL(3,1);

-- Actualizar los registros existentes para asegurar que sean números válidos
UPDATE properties 
SET bathrooms = ROUND(bathrooms::numeric, 1)
WHERE bathrooms IS NOT NULL;

-- Añadir un comentario a la columna
COMMENT ON COLUMN properties.bathrooms IS 'Número de baños (permite decimales para medias baños)'; 