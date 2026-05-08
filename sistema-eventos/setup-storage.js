// Script para configurar el bucket de almacenamiento en Supabase
// Ejecutar una vez para crear el bucket 'imagenes-eventos'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yzfcxensjsxmivtnmluq.supabase.co";
const supabaseServiceKey = "sb_publishable_fJtbPxOxjQT9Ty1lNpURXw_Bf-3hcWH"; // Esta debería ser la service key, no la anon key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    // Crear el bucket si no existe
    const { data, error } = await supabase.storage.createBucket('imagenes-eventos', {
      public: true, // Hacer las imágenes públicas
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880, // 5MB límite
    });

    if (error && !error.message.includes('already exists')) {
      console.error('Error creando bucket:', error);
      return;
    }

    console.log('Bucket configurado correctamente');

    // Configurar política de acceso público
    const { error: policyError } = await supabase.storage.from('imagenes-eventos').createSignedUrl('test', 60);

    if (policyError) {
      console.log('Configurando política de acceso...');
      // Nota: Las políticas se configuran desde el dashboard de Supabase
      console.log('Por favor, configura la política de acceso público desde el dashboard de Supabase');
    }

  } catch (error) {
    console.error('Error configurando storage:', error);
  }
}

setupStorage();