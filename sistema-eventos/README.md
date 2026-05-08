# Sistema de Eventos

Una aplicación React para gestionar eventos con almacenamiento de imágenes en Supabase.

## Características

- ✅ Gestión completa de eventos (crear, editar, eliminar)
- ✅ Clasificación automática por eventos futuros/pasados
- ✅ Contador dinámico de eventos próximos
- ✅ Almacenamiento de imágenes en Supabase Storage
- ✅ Interfaz responsive y moderna
- ✅ Integración completa con Supabase

## Configuración de Supabase

### 1. Base de datos

Asegúrate de tener creada la tabla `Eventos` con la siguiente estructura:

```sql
CREATE TABLE Eventos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  fecha DATE NOT NULL,
  lugar TEXT,
  precio DECIMAL(10,2),
  tipo TEXT NOT NULL,
  imagen TEXT,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Storage (Imágenes)

1. Ve al dashboard de Supabase → Storage
2. Crea un nuevo bucket llamado `imagenes-eventos`
3. Configura el bucket como **público**
4. En "Allowed MIME types" agrega: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
5. Establece el límite de tamaño de archivo en 5MB

### 3. Políticas de acceso

En el bucket `imagenes-eventos`, crea las siguientes políticas:

**Política para INSERT (subir imágenes):**
```sql
-- Allow authenticated users to upload images
bucket_id = 'imagenes-eventos'
AND auth.role() = 'authenticated'
```

**Política para SELECT (ver imágenes):**
```sql
-- Allow public access to view images
bucket_id = 'imagenes-eventos'
```

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Tecnologías utilizadas

- **React 19** - Framework frontend
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Supabase** - Backend y almacenamiento
- **CSS-in-JS** - Estilos inline

## Estructura del proyecto

```
src/
├── components/
│   ├── EventForm.tsx    # Formulario para crear/editar eventos
│   └── EventList.tsx    # Lista y tarjetas de eventos
├── App.tsx             # Componente principal
├── supabaseClient.ts   # Configuración de Supabase
└── main.tsx           # Punto de entrada
```
