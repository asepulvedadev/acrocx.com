/**
 * Script para optimizar automáticamente las imágenes en el proyecto.
 * 
 * Este script:
 * 1. Busca todas las imágenes en el directorio público
 * 2. Las optimiza reduciendo su tamaño pero manteniendo la calidad
 * 3. Genera versiones WebP para navegadores modernos
 * 
 * Para usar: npm run optimize-images
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

console.log('🖼️ Comenzando optimización de imágenes...');

// Instalar dependencias si no están instaladas
try {
  console.log('Verificando dependencias...');
  execSync('npm list sharp --depth=0', { stdio: 'ignore' });
} catch (error) {
  console.log('Instalando sharp para procesamiento de imágenes...');
  execSync('npm install --save-dev sharp', { stdio: 'inherit' });
}

// Importar sharp dinámicamente después de asegurarnos de que está instalado
const sharp = (await import('sharp')).default;

// Función para procesar una imagen
async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const allowedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
  
  if (!allowedFormats.includes(ext)) {
    return;
  }
  
  try {
    const stats = await fs.stat(filePath);
    const sizeKB = stats.size / 1024;
    
    console.log(`Procesando: ${path.basename(filePath)} (${sizeKB.toFixed(2)} KB)`);
    
    // Optimizar la imagen original
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Aplicar optimizaciones según el tipo de imagen
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: 85, progressive: true })
        .toFile(filePath + '.optimized');
    } else if (ext === '.png') {
      await image
        .png({ compressionLevel: 9, progressive: true })
        .toFile(filePath + '.optimized');
    } else if (ext === '.webp') {
      await image
        .webp({ quality: 85 })
        .toFile(filePath + '.optimized');
    }
    
    // Generar versión WebP si no es ya WebP
    if (ext !== '.webp') {
      const webpPath = filePath.replace(ext, '.webp');
      await image
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      console.log(`  Creada versión WebP: ${path.basename(webpPath)}`);
    }
    
    // Reemplazar original con versión optimizada
    await fs.rename(filePath + '.optimized', filePath);
    
    // Obtener tamaño nuevo para mostrar la reducción
    const newStats = await fs.stat(filePath);
    const newSizeKB = newStats.size / 1024;
    const reduction = 100 - (newSizeKB / sizeKB * 100);
    
    console.log(`  ✅ Optimización completada: ${newSizeKB.toFixed(2)} KB (${reduction.toFixed(2)}% reducción)`);
  } catch (error) {
    console.error(`  ❌ Error procesando ${filePath}:`, error.message);
  }
}

// Función para recorrer recursivamente directorios
async function processDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await processImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error procesando directorio ${directory}:`, error.message);
  }
}

// Iniciar el procesamiento desde el directorio público
await processDirectory(publicDir);

console.log('🎉 Optimización de imágenes completada!'); 