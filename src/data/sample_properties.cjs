const sampleProperties = [
  {
    title: "Casa Moderna en Lomas de Chapultepec",
    description: "Hermosa casa de diseño contemporáneo con acabados de lujo, ubicada en una de las zonas más exclusivas de la Ciudad de México. Cuenta con amplios espacios, jardín, alberca y área de entretenimiento.",
    price: 25000000,
    location: "Lomas de Chapultepec, Miguel Hidalgo, CDMX",
    type: "casa",
    status: "venta",
    bedrooms: 4,
    bathrooms: 3.5,
    area: 450,
    is_featured: true,
    google_maps_url: "https://maps.google.com/?q=19.4194,-99.2047",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c153a9e",
        alt_text: "Fachada principal de la casa"
      },
      {
        image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        alt_text: "Sala de estar"
      },
      {
        image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        alt_text: "Cocina integrada"
      },
      {
        image_url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
        alt_text: "Alberca y jardín"
      },
      {
        image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        alt_text: "Recámara principal"
      }
    ]
  },
  {
    title: "Departamento de Lujo en Polanco",
    description: "Espectacular departamento con vista panorámica, acabados premium y amenidades de primer nivel. Ubicado en un edificio de prestigio con seguridad 24/7 y múltiples amenidades.",
    price: 15000000,
    location: "Polanco, Miguel Hidalgo, CDMX",
    type: "departamento",
    status: "venta",
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    is_featured: true,
    google_maps_url: "https://maps.google.com/?q=19.4326,-99.1332",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        alt_text: "Vista exterior del edificio"
      },
      {
        image_url: "https://images.unsplash.com/photo-1502005097973-6a7082348e28",
        alt_text: "Sala con vista panorámica"
      },
      {
        image_url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
        alt_text: "Cocina de diseño"
      },
      {
        image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        alt_text: "Terraza con vista"
      },
      {
        image_url: "https://images.unsplash.com/photo-1502005097973-6a7082348e28",
        alt_text: "Recámara principal"
      }
    ]
  },
  {
    title: "Local Comercial en Plaza Galerías",
    description: "Excelente local comercial en una de las plazas más importantes de la ciudad. Ubicado en planta baja con alto tráfico peatonal, ideal para negocio de retail o restaurante.",
    price: 18000000,
    location: "Plaza Galerías, Azcapotzalco, CDMX",
    type: "local_comercial",
    status: "venta",
    bedrooms: 0,
    bathrooms: 0,
    area: 350,
    is_featured: false,
    google_maps_url: "https://maps.google.com/?q=19.4872,-99.1894",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        alt_text: "Fachada del local"
      },
      {
        image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
        alt_text: "Interior del local"
      },
      {
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        alt_text: "Área de almacenamiento"
      },
      {
        image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
        alt_text: "Vista desde la calle"
      },
      {
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        alt_text: "Área de servicio"
      }
    ]
  }
];

module.exports = { sampleProperties }; 