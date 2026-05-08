// Script para verificar y crear el bucket de Supabase Storage
// Ejecutar con: node check-storage.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yzfcxensjsxmivtnmluq.supabase.co";
const supabaseKey = "sb_publishable_fJtbPxOxjQT9Ty1lNpURXw_Bf-3hcWH";

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  try {
    console.log('🔍 Verificando configuración de Supabase Storage...');

    // Verificar si el bucket existe
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('❌ Error accediendo a Storage:', error.message);
      console.log('💡 Asegúrate de que tu clave API tenga permisos para Storage');
      return;
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'imagenes-eventos');

    if (bucketExists) {
      console.log('✅ Bucket "imagenes-eventos" encontrado');

      // Verificar acceso público intentando crear una URL pública
      try {
        const { data, error: urlError } = supabase.storage
          .from('imagenes-eventos')
          .getPublicUrl('test.jpg');

        if (urlError) {
          console.log('⚠️  Posible problema con el acceso público');
          console.log('Asegúrate de que el bucket esté configurado como público en el dashboard de Supabase');
        } else {
          console.log('✅ Acceso público configurado correctamente');
        }
      } catch (e) {
        console.log('⚠️  No se pudo verificar el acceso público');
      }

    } else {
      console.log('📦 Intentando crear bucket "imagenes-eventos"...');

      try {
        const { data, error: createError } = await supabase.storage.createBucket('imagenes-eventos', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880, // 5MB
        });

        if (createError) {
          console.log('❌ No se pudo crear el bucket automáticamente');
          console.log('Error:', createError.message);
        } else {
          console.log('✅ Bucket creado exitosamente');
        }
      } catch (createError) {
        console.log('❌ Error creando bucket:', createError.message);
      }

      console.log('\n📝 Si la creación automática falló, crea el bucket manualmente:');
      console.log('1. Ve a Supabase Dashboard → Storage');
      console.log('2. Crea un nuevo bucket llamado "imagenes-eventos"');
      console.log('3. Configúralo como público');
      console.log('4. Agrega estos MIME types: image/jpeg, image/png, image/gif, image/webp');
      console.log('5. Límite de tamaño: 5MB');
    }

    console.log('\n🎉 Configuración completada. La aplicación debería funcionar con imágenes.');

  } catch (error) {
    console.error('❌ Error verificando storage:', error);
  }
}

setupStorage();