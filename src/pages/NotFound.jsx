import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Ilustración */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl"></div>
              <div className="relative rounded-full bg-primary/20 p-8">
                <div className="text-9xl font-bold text-primary">404</div>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <h1 className="mb-4 text-4xl font-bold">Página no encontrada</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>

          {/* Botones */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-lg bg-muted px-6 py-3 text-foreground transition-colors hover:bg-muted/80"
            >
              <Home className="h-5 w-5" />
              Ir al inicio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound; 