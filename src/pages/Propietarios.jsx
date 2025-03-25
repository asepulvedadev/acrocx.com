import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Users,
  Building2,
  Presentation,
  Camera,
  FileCheck,
  MessageSquare,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Propietarios() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11"
          alt="Luxury real estate"
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <motion.h1 
              className="mb-6 text-5xl font-bold md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Vende tu Propiedad con Expertos
            </motion.h1>
            <motion.p 
              className="mb-8 text-xl opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Maximiza el valor de tu propiedad con nuestro servicio premium
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="mr-4">
                Agenda una Valoración
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                Conoce Más
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-24">
        <div className="container-custom">
          <h2 className="section-title dark:text-white">¿Por Qué Elegirnos?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div 
              className="service-card group bg-white/90 dark:bg-white/90 dark:border dark:border-gray-700"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon dark:bg-primary/20">
                <TrendingUp className="h-8 w-8 text-primary dark:text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Mejor Precio</h3>
              <p className="text-muted-foreground text-gray-700 dark:text-gray-300">
                Análisis de mercado detallado para obtener el mejor precio por tu propiedad.
              </p>
            </motion.div>
            <motion.div 
              className="service-card group bg-white/90 dark:bg-white/90 dark:border dark:border-gray-700"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon dark:bg-primary/20">
                <ShieldCheck className="h-8 w-8 text-primary dark:text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Seguridad Total</h3>
              <p className="text-muted-foreground text-gray-700 dark:text-gray-300">
                Proceso de venta seguro y transparente con asesoría legal incluida.
              </p>
            </motion.div>
            <motion.div 
              className="service-card group bg-white/90 dark:white/90 dark:border dark:border-gray-700"
              whileHover={{ y: -10 }}
            >
              <div className="service-icon dark:bg-primary/20">
                <Users className="h-8 w-8 text-primary dark:text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Amplia Red</h3>
              <p className="text-muted-foreground text-gray-700 dark:text-gray-300">
                Acceso a una extensa red de compradores potenciales calificados.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-muted py-24 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="section-title dark:text-white">Nuestro Proceso</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Valoración</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Evaluación profesional de tu propiedad
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Preparación</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Fotografía profesional y staging
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Presentation className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Marketing</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Estrategia de marketing personalizada
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Cierre</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Gestión completa del proceso de venta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24">
        <div className="container-custom">
          <h2 className="section-title dark:text-white">Lo Que Dicen Nuestros Clientes</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div 
              className="rounded-[var(--radius)] bg-muted p-6 dark:bg-gray-800/70 dark:border dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20">
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
                    alt="Cliente"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Carlos Ramírez</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">San Pedro</p>
                </div>
              </div>
              <p className="text-muted-foreground dark:text-gray-300">
                "El proceso de venta fue muy profesional y rápido. Obtuvimos un excelente precio por nuestra propiedad."
              </p>
            </motion.div>

            <motion.div 
              className="rounded-[var(--radius)] bg-muted p-6 dark:bg-gray-800/70 dark:border dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                    alt="Cliente"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Ana González</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Valle Oriente</p>
                </div>
              </div>
              <p className="text-muted-foreground dark:text-gray-300">
                "La atención personalizada y el conocimiento del mercado fueron clave para vender nuestra casa."
              </p>
            </motion.div>

            <motion.div 
              className="rounded-[var(--radius)] bg-muted p-6 dark:bg-gray-800/70 dark:border dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="Cliente"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">Roberto Martínez</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Cumbres</p>
                </div>
              </div>
              <p className="text-muted-foreground dark:text-gray-300">
                "Excelente servicio y asesoría durante todo el proceso de venta de nuestra propiedad."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-4xl font-bold">
            ¿Listo para Vender tu Propiedad?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Agenda una valoración gratuita con nuestros expertos
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contactar Ahora
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/20">
              <Phone className="mr-2 h-5 w-5" />
              Llamar
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container-custom">
          <h2 className="section-title dark:text-white">Preguntas Frecuentes</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-[var(--radius)] border bg-card p-6 dark:bg-gray-800/70 dark:border-gray-700">
              <h3 className="mb-2 text-lg font-semibold dark:text-white">
                ¿Cuánto tiempo toma vender una propiedad?
              </h3>
              <p className="text-muted-foreground dark:text-gray-300">
                El tiempo de venta varía según diversos factores, pero nuestro promedio es de 45-60 días para propiedades correctamente valuadas.
              </p>
            </div>
            <div className="rounded-[var(--radius)] border bg-card p-6 dark:bg-gray-800/70 dark:border-gray-700">
              <h3 className="mb-2 text-lg font-semibold dark:text-white">
                ¿Qué documentos necesito para vender?
              </h3>
              <p className="text-muted-foreground dark:text-gray-300">
                Principalmente necesitarás las escrituras, predial al corriente, y comprobantes de servicios. Nuestro equipo legal te guiará en el proceso.
              </p>
            </div>
            <div className="rounded-[var(--radius)] border bg-card p-6 dark:bg-gray-800/70 dark:border-gray-700">
              <h3 className="mb-2 text-lg font-semibold dark:text-white">
                ¿Cómo determinan el precio de mi propiedad?
              </h3>
              <p className="text-muted-foreground dark:text-gray-300">
                Realizamos un análisis completo del mercado, considerando ubicación, características, condiciones y ventas recientes en la zona.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Propietarios;
