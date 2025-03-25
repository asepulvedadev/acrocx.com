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

-- Nota: Las políticas RLS se pueden configurar después a través de la UI de Supabase
-- Para este ejemplo, dejamos la tabla accesible para todos
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON public.system_videos FOR ALL USING (true); 