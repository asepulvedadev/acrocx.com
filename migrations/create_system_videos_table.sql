-- Crear tabla para videos del sistema
CREATE TABLE IF NOT EXISTS public.system_videos (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Añadir comentarios a la tabla
COMMENT ON TABLE public.system_videos IS 'Tabla para almacenar videos del sistema como el video del hero';

-- Crear un trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a la tabla system_videos
DROP TRIGGER IF EXISTS set_updated_at ON public.system_videos;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.system_videos
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insertar video por defecto
INSERT INTO public.system_videos (type, video_url, title, description)
VALUES ('hero_video', 'https://player.vimeo.com/progressive_redirect/playback/805226289/rendition/720p/file.mp4?loc=external', 'Video del Hero', 'Video principal para la sección hero')
ON CONFLICT (id) DO NOTHING;

-- Añadir políticas RLS (Row Level Security)
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios
CREATE POLICY "Permitir lectura a todos los usuarios" 
ON public.system_videos FOR SELECT 
USING (true);

-- Permitir escritura solo a usuarios autenticados
-- Nota: Para restricciones más específicas como roles de admin, 
-- deberás configurar esto en la UI de Supabase después
CREATE POLICY "Permitir escritura solo a usuarios autenticados" 
ON public.system_videos FOR ALL 
USING (auth.uid() IS NOT NULL); 