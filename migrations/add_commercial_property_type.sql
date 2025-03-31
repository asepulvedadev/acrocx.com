-- Agregar el tipo de propiedad 'local_comercial' a la tabla properties
ALTER TABLE properties 
ADD CONSTRAINT valid_property_type 
CHECK (type IN ('casa', 'departamento', 'terreno', 'oficina', 'local_comercial')); 