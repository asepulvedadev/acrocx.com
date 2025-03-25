
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Building2, Key, Users, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";

function Owners() {
  const benefits = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Máxima Exposición",
      description: "Tu propiedad será vista por miles de compradores potenciales.",
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: "Gestión Profesional",
      description: "Nos encargamos de todo el proceso de venta o renta.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Clientes Calificados",
      description: "Trabajamos solo con compradores pre-aprobados.",
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: "Mejor Precio",
      description: "Análisis de mercado para obtener el mejor valor.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
          alt="Luxury property"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="container-custom flex h-full items-center justify-center text-center text-white">
            <div>
              <h1 className="mb-6 text-5xl font-bold">Vende con Nosotros</h1>
              <p className="mx-auto max-w-2xl text-lg">
                Maximiza el valor de tu propiedad con nuestro equipo de expertos
                inmobiliarios.
              </p>
              <Button size="lg" className="mt-8">
                Comienza Ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container-custom">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="service-card group"
                whileHover={{ y: -10 }}
              >
                <div className="service-icon">{benefit.icon}</div>
                <h3 className="mb-4 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted py-24">
        <div className="container-custom">
          <h2 className="section-title">Proceso Simple</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-white">
                1
              </div>
              <h3 className="mb-4 text-xl font-semibold">Contáctanos</h3>
              <p className="text-muted-foreground">
                Agenda una cita con nuestros asesores.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-white">
                2
              </div>
              <h3 className="mb-4 text-xl font-semibold">Evaluación</h3>
              <p className="text-muted-foreground">
                Valoramos tu propiedad sin costo.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-white">
                3
              </div>
              <h3 className="mb-4 text-xl font-semibold">¡Vendida!</h3>
              <p className="text-muted-foreground">
                Nos encargamos de todo el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom text-center">
          <h2 className="mb-8 text-4xl font-bold">
            ¿Listo para vender tu propiedad?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Nuestro equipo está listo para ayudarte a conseguir el mejor valor por
            tu propiedad.
          </p>
          <Button size="lg">Contactar Ahora</Button>
        </div>
      </section>
    </div>
  );
}

export default Owners;
