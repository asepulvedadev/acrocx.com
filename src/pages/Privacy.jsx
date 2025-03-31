import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Phone, Building2 } from 'lucide-react';

function Privacy() {
  return (
    <div className="min-h-screen bg-background py-24">
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
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">Políticas de Privacidad</h1>
            <p className="text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-MX')}
            </p>
          </div>

          {/* Contenido */}
          <div className="space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            {/* Introducción */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">1. Introducción</h2>
              <p className="text-muted-foreground">
                En Acrocx Inmobiliaria, nos tomamos muy en serio la privacidad de nuestros usuarios. 
                Esta política de privacidad describe cómo recopilamos, usamos y protegemos la 
                información personal que usted nos proporciona.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">2. Información que Recopilamos</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <FileText className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Información Personal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Nombre, correo electrónico, teléfono y dirección
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Building2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Información de Propiedades</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Detalles de propiedades, ubicaciones y características
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Uso de la información */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">3. Uso de la Información</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Mail className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Comunicación</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Para contactarlo sobre propiedades y servicios
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Eye className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Mejora de Servicios</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Para mejorar nuestros servicios y experiencia de usuario
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Protección de datos */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">4. Protección de Datos</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <Lock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger 
                    su información personal contra acceso no autorizado, alteración, divulgación 
                    o destrucción.
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">5. Contacto</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">
                    Si tiene alguna pregunta sobre nuestra política de privacidad, 
                    contáctenos en:
                  </p>
                  <div className="mt-2 space-y-1">
                    <p>Email: privacidad@acrocx.com</p>
                    <p>Teléfono: +52 (55) 1234-5678</p>
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