-- Crear bucket de storage para videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-videos', 'property-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas RLS para el bucket
-- Permitir lectura pública
CREATE POLICY "Permitir acceso de lectura público" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-videos');

-- Permitir eliminar a usuarios autenticados
CREATE POLICY "Permitir eliminación a usuarios autenticados" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'property-videos' AND auth.uid() IS NOT NULL);

-- Permitir insert a usuarios autenticados
CREATE POLICY "Permitir subida a usuarios autenticados" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'property-videos' AND auth.uid() IS NOT NULL);

-- Permitir update a usuarios autenticados
CREATE POLICY "Permitir actualización a usuarios autenticados" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'property-videos' AND auth.uid() IS NOT NULL); 