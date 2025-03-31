import React from 'react';
import { motion } from 'framer-motion';
import { Copyright as CopyrightIcon, FileText, Image, Code, Book, Shield, Mail, Phone } from 'lucide-react';

function CopyrightPage() {
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
                <CopyrightIcon className="h-8 w-8 text-primary dark:text-white" />
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-white/90">
              Derechos de Autor
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
                En Acrocx Inmobiliaria, respetamos y protegemos los derechos de autor de todo 
                el contenido publicado en nuestro sitio web. Esta política establece cómo 
                manejamos los derechos de autor y cómo puedes utilizar nuestro contenido.
              </p>
            </section>

            {/* Propiedad del Contenido */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">2. Propiedad del Contenido</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <FileText className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-primary/90" />
                  <div>
                    <h3 className="font-medium dark:text-white">Contenido Textual</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Todos los textos, descripciones y contenido escrito son propiedad de Acrocx
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Image className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-primary/90" />
                  <div>
                    <h3 className="font-medium dark:text-white">Imágenes y Fotografías</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Las imágenes de propiedades y contenido visual están protegidas por derechos de autor
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Code className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-primary/90" />
                  <div>
                    <h3 className="font-medium dark:text-white">Código y Diseño</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      El código fuente y diseño del sitio son propiedad exclusiva
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-all hover:bg-primary/5 dark:bg-gray-700/50 dark:hover:bg-primary/10">
                  <Book className="mt-1 h-5 w-5 text-primary group-hover:scale-110 transition-transform dark:text-primary/90" />
                  <div>
                    <h3 className="font-medium dark:text-white">Documentación</h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                      Manuales, guías y documentación técnica están protegidos
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Uso Permitido */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">3. Uso Permitido</h2>
              <div className="rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <p className="text-muted-foreground dark:text-gray-300">
                  Se permite el uso del contenido para:
                </p>
                <ul className="mt-2 space-y-2 text-muted-foreground dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-primary/90"></span>
                    Consultar información sobre propiedades
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-primary/90"></span>
                    Compartir enlaces a nuestro sitio web
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-primary/90"></span>
                    Imprimir copias para uso personal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-primary/90"></span>
                    Usar en redes sociales con atribución
                  </li>
                </ul>
              </div>
            </section>

            {/* Restricciones */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">4. Restricciones</h2>
              <div className="rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <p className="text-muted-foreground dark:text-gray-300">
                  No se permite:
                </p>
                <ul className="mt-2 space-y-2 text-muted-foreground dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive dark:bg-destructive/90"></span>
                    Copiar o reproducir contenido sin autorización
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive dark:bg-destructive/90"></span>
                    Modificar o alterar el contenido
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive dark:bg-destructive/90"></span>
                    Usar el contenido con fines comerciales
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive dark:bg-destructive/90"></span>
                    Eliminar marcas de agua o atribuciones
                  </li>
                </ul>
              </div>
            </section>

            {/* Infracción de Derechos */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">5. Infracción de Derechos</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Shield className="mt-1 h-5 w-5 text-primary dark:text-primary/90" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Si detectas una infracción de derechos de autor en nuestro sitio o 
                    crees que tu contenido ha sido utilizado sin autorización, contáctanos 
                    inmediatamente para resolver la situación.
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/80">
              <h2 className="mb-4 text-2xl font-semibold text-primary dark:text-white">6. Contacto</h2>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 dark:bg-gray-700/50">
                <Phone className="mt-1 h-5 w-5 text-primary dark:text-primary/90" />
                <div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Si tienes alguna pregunta sobre nuestros derechos de autor o el uso 
                    del contenido, contáctanos en:
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

export default CopyrightPage; 