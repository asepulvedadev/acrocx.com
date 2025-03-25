
import React from "react";
import { motion } from "framer-motion";
import { Bed, Bath, Square } from "lucide-react";

function Sales() {
  const properties = [
    {
      id: 1,
      title: "Casa Moderna en Valle",
      location: "Valle Oriente",
      price: "8,900,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      beds: 4,
      baths: 3.5,
      area: 280,
    },
    {
      id: 2,
      title: "Penthouse de Lujo",
      location: "San Pedro",
      price: "12,500,000",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      beds: 3,
      baths: 3,
      area: 320,
    },
    // Add more properties...
  ];

  return (
    <div className="container-custom py-24">
      <h1 className="section-title">Propiedades en Venta</h1>
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
              <div className="property-tag">Venta</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{property.title}</h3>
              <p className="mt-2 text-muted-foreground">{property.location}</p>
              <p className="mt-4 text-2xl font-bold text-primary">
                ${property.price} MXN
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

export default Sales;
