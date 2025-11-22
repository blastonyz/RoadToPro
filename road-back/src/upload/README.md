# Upload Module - Documentación

## 🚀 Integración con Arka CDN

Este módulo utiliza **Arka CDN** (https://arkacdn.cloudycoding.com/) para gestionar la subida, almacenamiento y recuperación de archivos en **Arkiv Network**.

## Configuración

### Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# Arka CDN - Autenticación
# Opción 1: Email y contraseña
ARKA_CDN_EMAIL="your-email@example.com"
ARKA_CDN_PASSWORD="your-password"

# Opción 2: Wallet address (alternativa)
# ARKA_CDN_WALLET="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

**Importante**:

- Elige **uno** de los dos métodos de autenticación
- El sistema se autenticará automáticamente al iniciar
- **NUNCA** compartas tus credenciales

## Características

### ✅ Compresión Automática

Arka CDN comprime automáticamente los archivos:

- **Imágenes**: Redimensiona a 1080p, optimización JPEG
- **Videos**: Convierte a 1080p, codec H.264
- Reducción típica del 50-80% del tamaño original

### ✅ Almacenamiento Distribuido

- Almacenamiento en **Arkiv Network**
- División automática en chunks de 1MB
- Expiración configurable (mínimo 60 segundos)

### ✅ Acceso Público

- URLs públicas para todos los archivos
- No requiere autenticación para descargar
- Compatible con `<img>`, `<video>`, etc.

## Endpoints

### 1. Subir Archivo

**POST** `/upload/file`

Sube un archivo (imagen, video, documento, etc.) a Arka CDN.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

- `file`: Archivo a subir - **Requerido**
- `description`: Descripción del archivo - Opcional
- `compress`: Comprimir archivo (default: true) - Opcional
- `enableDashStreaming`: Habilitar DASH streaming (solo videos, temporalmente deshabilitado) - Opcional
- `ttl`: Tiempo de vida en milisegundos (mínimo 60000ms) - Opcional

**Límites:**

- Tamaño máximo: 100MB
- Tipos soportados: imágenes, videos, documentos, texto, JSON

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "arkivAddresses": ["0xabc123...", "0xdef456..."],
    "totalSize": 1024000,
    "originalSize": 2048000,
    "compressed": true,
    "chunks": 2,
    "status": "completed",
    "publicUrl": "https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 2. Subir Datos Planos (JSON/Texto)

**POST** `/upload/plain`

Sube datos en texto plano o JSON sin usar form-data.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "data": {
    "key": "value",
    "config": { "theme": "dark" }
  },
  "filename": "config.json",
  "description": "Application configuration"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Plain data uploaded successfully",
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "config.json",
    "size": 1024,
    "mimeType": "application/json",
    "status": "completed",
    "message": "Upload completed successfully",
    "publicUrl": "https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 3. Listar Archivos

**GET** `/upload`

Lista todos los archivos del usuario autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "originalName": "image.jpg",
      "mimeType": "image/jpeg",
      "size": 1024000,
      "isDashVideo": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": null,
      "publicUrl": "https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

### 4. Obtener Información de Archivo

**GET** `/upload/:id`

Obtiene información detallada de un archivo específico.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 1024000,
    "userId": "user-uuid",
    "isDashVideo": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": null,
    "chunks": [
      {
        "id": "chunk-uuid-1",
        "chunkIndex": 0,
        "arkivAddress": "0xabc123...",
        "size": 512000,
        "txHash": "0xtxhash1..."
      }
    ],
    "publicUrl": "https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 5. Obtener Contenido de Texto

**GET** `/upload/:id/text`

Obtiene el contenido de un archivo de texto.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "notes.txt",
    "mimeType": "text/plain",
    "size": 1024,
    "content": "Hello World\nThis is plain text",
    "encoding": "utf-8"
  }
}
```

### 6. Obtener Contenido JSON

**GET** `/upload/:id/json`

Obtiene y parsea automáticamente un archivo JSON.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "config.json",
    "data": {
      "key": "value",
      "config": { "theme": "dark" }
    }
  }
}
```

### 7. Obtener Estado de Subida

**GET** `/upload/:id/status`

Obtiene el estado actual de subida de un archivo.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "progress": 100,
    "totalChunks": 2,
    "uploadedChunks": 2,
    "failedChunks": 0,
    "retryCount": 0,
    "lastError": null
  }
}
```

### 8. Eliminar Archivo

**DELETE** `/upload/:id`

Elimina un archivo específico.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 9. Acceso Público a Archivos

**GET** `/data/:uuid`

**⚠️ ENDPOINT PÚBLICO - No requiere autenticación**

Descarga un archivo directamente usando su UUID.

**Uso en HTML:**

```html
<!-- Imagen -->
<img
  src="https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
  alt="Image"
/>

<!-- Video -->
<video controls>
  <source
    src="https://arkacdn.cloudycoding.com/api/data/550e8400-e29b-41d4-a716-446655440000"
    type="video/mp4"
  />
</video>
```

**Uso en JavaScript:**

```javascript
// Descargar archivo
const response = await fetch('http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000');
const blob = await response.blob();

// Obtener como texto
const text = await response.text();

// Obtener como JSON
const json = await response.json();
```

## Ejemplos de Uso

### TypeScript/JavaScript

```typescript
// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
  }),
});
const { accessToken } = await loginResponse.json();

// Subir archivo
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'Mi archivo');
formData.append('compress', 'true');

const uploadResponse = await fetch('http://localhost:3000/api/upload/file', {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: formData,
});
const uploadResult = await uploadResponse.json();

// Usar URL pública
console.log('Archivo disponible en:', uploadResult.data.publicUrl);
```

## Manejo de Errores

Todos los endpoints retornan errores en el siguiente formato:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request"
}
```

### Códigos de Estado

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: Token inválido
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

## Arquitectura

```
upload/
├── arka-cdn.service.ts      # Cliente HTTP para Arka CDN API
├── upload.service.ts         # Lógica de negocio
├── upload.controller.ts      # Endpoints autenticados
├── data.controller.ts        # Endpoint público para archivos
├── upload.module.ts          # Módulo NestJS
└── dto/
    ├── upload-file.dto.ts    # DTO para subida de archivos
    └── upload-plain.dto.ts   # DTO para datos planos
```

## Ventajas de Arka CDN

✅ **Simplicidad**: API REST fácil de usar  
✅ **Compresión**: Optimización automática de archivos  
✅ **Almacenamiento**: Distribuido en Arkiv Network  
✅ **Acceso**: URLs públicas sin autenticación  
✅ **Escalabilidad**: Gestión automática de chunks  
✅ **Seguridad**: Autenticación JWT + gestión de usuarios

## Recursos Adicionales

- **Arka CDN API**: https://arkacdn.cloudycoding.com/api
- **Documentación completa**: Ver documentación de Arka CDN
- **Arkiv Network**: https://arkiv.network

      "arkivAddress": "0x...", // EntityKey de Arkiv (si el archivo es pequeño)
      "chunks": [
        // Solo si el archivo fue chunkeado
        {
          "index": 0,
          "address": "0x...", // EntityKey del chunk
          "size": 1048576
        }
      ],
      "totalSize": 1500000, // Tamaño después de compresión
      "originalSize": 5000000, // Tamaño original del archivo
      "compressed": true // Indica si el archivo fue comprimido

  }
  }

````

**Ejemplo con cURL:**

```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
````

**Ejemplo con JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
console.log('Archivo subido:', result.data);
console.log('Entity Key:', result.data.arkivAddress);
console.log(
  'Compresión:',
  Math.round((1 - result.data.totalSize / result.data.originalSize) * 100) + '%',
);
```

### 2. Listar Archivos del Usuario

**GET** `/upload`

Obtiene todos los archivos subidos por el usuario autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "originalName": "video.mp4",
      "mimeType": "video/mp4",
      "size": 5242880,
      "encoding": "buffer",
      "arkivAddress": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "chunks": [
        {
          "chunkIndex": 0,
          "arkivAddress": "0x...",
          "size": 1048576
        }
      ]
    }
  ]
}
```

### 3. Obtener Archivo Específico

**GET** `/upload/:id`

Obtiene la información de un archivo específico.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "originalName": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 524288,
    "encoding": "buffer",
    "arkivAddress": "0x...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "chunks": []
  }
}
```

### 4. Eliminar Archivo

**DELETE** `/upload/:id`

Elimina un archivo y todos sus chunks asociados de la base de datos.

**Nota**: Los datos en Arkiv Network expiran automáticamente después de 12 horas.

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Cómo Funciona

### Proceso de Upload

1. **Recepción del archivo**: El servidor recibe el archivo via `multipart/form-data`
2. **Validación**: Verifica tipo y tamaño del archivo
3. **Compresión automática**:
   - **Imágenes**: Redimensiona a máximo 1080p y comprime a JPEG con calidad 80%
   - **Videos**: Redimensiona a máximo 1080p, recodifica con H.264 y optimiza audio
4. **Chunking** (si es necesario):
   - Si el archivo es > 1MB, se divide en chunks de 1MB
   - Cada chunk se sube por separado
5. **Storage en Arkiv**:
   - Usa `createWalletClient` y `createEntity` del SDK de Arkiv
   - Crea entities con attributes para metadata
   - Cada entity tiene una expiración de 12 horas
6. **Guardado en BD**: Guarda referencias en PostgreSQL con:
   - Información del archivo (nombre, tipo, tamaño comprimido)
   - EntityKey de Arkiv (si es archivo pequeño)
   - Lista de chunks con sus EntityKeys (si es archivo grande)
   - ID del usuario que lo subió

### Modelos de Base de Datos

**File:**

- `id`: UUID del archivo
- `originalName`: Nombre original del archivo
- `mimeType`: Tipo MIME (image/jpeg, video/mp4, etc.)
- `size`: Tamaño en bytes (después de compresión)
- `encoding`: Tipo de encoding ('buffer')
- `arkivAddress`: EntityKey en Arkiv (para archivos pequeños)
- `userId`: ID del usuario propietario
- `chunks`: Relación con FileChunk[]

**FileChunk:**

- `id`: UUID del chunk
- `chunkIndex`: Índice del chunk (0, 1, 2, ...)
- `arkivAddress`: EntityKey en Arkiv de este chunk
- `size`: Tamaño del chunk en bytes
- `fileId`: ID del archivo padre

## Seguridad

- Todos los endpoints requieren autenticación JWT
- Los usuarios solo pueden acceder a sus propios archivos
- Validación de tipo y tamaño de archivo
- Límite de 100MB por archivo (antes de compresión)
- Private key almacenada de forma segura en variables de entorno
- Los datos en Arkiv expiran automáticamente después de 12 horas

## Notas Importantes

### Performance

- Los chunks se procesan secuencialmente para evitar sobrecarga
- El tamaño de chunk (1MB) puede ajustarse en `CHUNK_SIZE` del servicio
- La compresión de videos puede tardar varios segundos dependiendo del tamaño original
- La compresión de imágenes es muy rápida (milisegundos)

### Configuración

- **Imágenes**: Ajusta `MAX_IMAGE_WIDTH`, `MAX_IMAGE_HEIGHT` e `IMAGE_QUALITY` en el servicio
- **Videos**: Ajusta `VIDEO_RESOLUTION` y los parámetros de ffmpeg en `compressVideo()`
- **Expiración**: Ajusta `EXPIRES_IN` (en segundos) para cambiar el tiempo de expiración en Arkiv
- Asegúrate de tener FFmpeg instalado en el sistema para comprimir videos

### Arkiv Network

- Los archivos se almacenan en Arkiv Mendoza network
- Cada archivo/chunk es un entity con attributes
- Los entities expiran automáticamente después de 12 horas
- El EntityKey es una dirección hexadecimal única
- La metadata se almacena como attributes en cada entity

### Limitaciones

- Videos muy grandes (>100MB) pueden exceder el límite antes de compresión
- La compresión reduce el tamaño pero también puede afectar ligeramente la calidad
- FFmpeg debe estar instalado y accesible en el PATH del sistema
- Los datos en Arkiv expiran después de 12 horas (configurable)
