
import React from "react";
import { motion } from "framer-motion";
import { Bed, Bath, Square } from "lucide-react";

function Rentals() {
  const properties = [
    {
      id: 1,
      title: "Apartamento Amueblado",
      location: "Contry",
      price: "25,000",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      beds: 2,
      baths: 2,
      area: 120,
    },
    {
      id: 2,
      title: "Casa en Cumbres",
      location: "Cumbres Elite",
      price: "35,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      beds: 3,
      baths: 2.5,
      area: 180,
    },
    // Add more properties...
  ];

  return (
    <div className="container-custom py-24">
      <h1 className="section-title">Propiedades en Renta</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            className="property-card"
            whileHover={{ y: -10 }}
          >
            <div className="property-card-image">
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover"
              />
              <div className="property-tag">Renta</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{property.title}</h3>
              <p className="mt-2 text-muted-foreground">{property.location}</p>
              <p className="mt-4 text-2xl font-bold text-primary">
                ${property.price} MXN/mes
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {property.beds} Recámaras
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.baths} Baños
                </span>
                <span className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  {property.area}m²
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Rentals;
