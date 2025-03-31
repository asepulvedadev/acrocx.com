import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, User, Home, AlertTriangle, FileText, Mail, Phone, CheckCircle, XCircle, Key, Edit, AlertCircle } from 'lucide-react';

function Terms() {
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
                <Scale className="h-8 w-8 text-primary dark:text-white" />
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-white/90">
              Términos y Condiciones
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
                Al acceder y utilizar el sitio web de Acrocx Inmobiliaria, aceptas estar 
                sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna 
                parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            {/* Uso del servicio */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">2. Uso del Servicio</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-primary dark:text-primary/90">
                    <CheckCircle className="h-5 w-5 text-primary dark:text-white" />
                    Permitido
                  </h3>
                  <div className="space-y-3">
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <Home className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Búsqueda de Propiedades</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Explorar y buscar propiedades disponibles
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <User className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Contacto con Agentes</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Comunicarte con nuestros agentes inmobiliarios
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <FileText className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Documentación</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Acceder a documentación legal y contratos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-primary dark:text-primary/90">
                    <XCircle className="h-5 w-5 text-primary dark:text-white" />
                    No Permitido
                  </h3>
                  <div className="space-y-3">
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <AlertTriangle className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Spam y Publicidad</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Enviar spam o publicidad no autorizada
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <Shield className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Acceso No Autorizado</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Intentar acceder a áreas restringidas
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                      <AlertCircle className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">Información Falsa</h4>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                          Proporcionar información falsa o engañosa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cuentas de usuario */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">3. Cuentas de Usuario</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Key className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Responsabilidad</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Eres responsable de mantener la confidencialidad de tu cuenta
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Edit className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-white" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Información Precisa</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Debes proporcionar información precisa y actualizada
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Propiedades y listados */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">4. Propiedades y Listados</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Home className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Nos reservamos el derecho de modificar o eliminar listados de propiedades 
                    en cualquier momento. Nos esforzamos por mantener la información precisa, 
                    pero no garantizamos la exactitud de la información proporcionada por terceros.
                  </p>
                </div>
              </div>
            </section>

            {/* Responsabilidad */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">5. Responsabilidad</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <AlertCircle className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    No nos hacemos responsables de la exactitud de la información proporcionada 
                    por terceros ni de daños indirectos que puedan surgir del uso de nuestro servicio.
                  </p>
                </div>
              </div>
            </section>

            {/* Modificaciones */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">6. Modificaciones</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <FileText className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">7. Contacto</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Mail className="mt-1 h-5 w-5 text-primary dark:text-white" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Si tienes alguna pregunta sobre estos términos y condiciones, contáctanos en:
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

export default Terms; 