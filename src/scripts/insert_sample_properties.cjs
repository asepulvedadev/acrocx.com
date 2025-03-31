require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { sampleProperties } = require('../data/sample_properties.cjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSampleProperties() {
  try {
    for (const property of sampleProperties) {
      // Insertar la propiedad
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            type: property.type,
            status: property.status,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            is_featured: property.is_featured,
            google_maps_url: property.google_maps_url
          }
        ])
        .select()
        .single();

      if (propertyError) {
        console.error('Error al insertar propiedad:', propertyError);
        continue;
      }

      // Insertar las imágenes
      const imageInserts = property.images.map(image => ({
        property_id: propertyData.id,
        image_url: image.image_url,
        alt_text: image.alt_text
      }));

      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('Error al insertar imágenes:', imagesError);
      } else {
        console.log(`Propiedad "${property.title}" insertada correctamente`);
      }
    }

    console.log('Proceso completado');
  } catch (error) {
    console.error('Error general:', error);
  }
}

insertSampleProperties(); 