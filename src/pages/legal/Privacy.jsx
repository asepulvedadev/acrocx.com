import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Phone, Building2, Database, Server, UserCheck } from 'lucide-react';

function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4 ring-4 ring-primary/5 dark:bg-primary/20">
                <Shield className="h-8 w-8 text-primary dark:text-white" />
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-white/90">
              Políticas de Privacidad
            </h1>
            <p className="text-muted-foreground dark:text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-MX')}
            </p>
          </div>

          {/* Contenido */}
          <div className="space-y-8 rounded-2xl bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
            {/* Introducción */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">1. Introducción</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                En Acrocx Inmobiliaria, nos comprometemos a proteger y respetar tu privacidad. 
                Esta política de privacidad establece cómo utilizamos la información que recopilamos 
                sobre ti y cómo nos aseguramos de que tus datos personales estén seguros.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">2. Información que Recopilamos</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <FileText className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Información Personal</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Nombre, correo electrónico, teléfono, dirección y documentos de identidad
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Building2 className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Información de Propiedades</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Detalles de propiedades, ubicaciones, características y documentación
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Database className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Datos de Uso</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Historial de búsquedas, preferencias y comportamiento en el sitio
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <UserCheck className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Información de Verificación</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Documentos de verificación de identidad y solvencia
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Uso de la información */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">3. Uso de la Información</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Mail className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Comunicación</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Para contactarte sobre propiedades y servicios inmobiliarios
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Eye className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Mejora de Servicios</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Para mejorar nuestros servicios y experiencia de usuario
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Server className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Análisis y Seguridad</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Para prevenir fraudes y mejorar la seguridad
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Protección de datos */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">4. Protección de Datos</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Lock className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger 
                    tu información personal contra acceso no autorizado, alteración, divulgación 
                    o destrucción. Utilizamos encriptación SSL/TLS para la transmisión de datos 
                    y almacenamiento seguro en servidores protegidos.
                  </p>
                </div>
              </div>
            </section>

            {/* Derechos del usuario */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">5. Tus Derechos</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <h3 className="font-medium dark:text-gray-100">Acceso y Rectificación</h3>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                    Tienes derecho a acceder, rectificar o eliminar tus datos personales
                  </p>
                </div>
                <div className="group rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <h3 className="font-medium dark:text-gray-100">Portabilidad</h3>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                    Puedes solicitar una copia de tus datos en formato electrónico
                  </p>
                </div>
                <div className="group rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <h3 className="font-medium dark:text-gray-100">Limitación</h3>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                    Puedes solicitar la limitación del procesamiento de tus datos
                  </p>
                </div>
                <div className="group rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <h3 className="font-medium dark:text-gray-100">Oposición</h3>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                    Tienes derecho a oponerte al procesamiento de tus datos
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">6. Contacto</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Phone className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Si tienes alguna pregunta sobre nuestra política de privacidad, contáctanos en:
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-muted-foreground dark:text-gray-400">Email: legal@acrocx.com</p>
                    <p className="text-muted-foreground dark:text-gray-400">Teléfono: +52 (55) 1234-5678</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Privacy; 