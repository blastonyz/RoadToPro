# Sistema de Cupones - OpenLeague Backend

## Descripción General

Sistema de cupones temporales que permite a los super administradores crear y gestionar cupones para diferentes propósitos (gas sponsorship, subida de archivos, features premium). Los cupones se crean mediante la API de Arka CDN desde la cuenta del super usuario.

## Características Principales

### Tipos de Cupones

- **GAS_SPONSORSHIP**: Cupones para sponsorear gas de transacciones (similar al sistema de inversores)
- **FILE_UPLOAD**: Cupones para subida de archivos
- **PREMIUM_FEATURE**: Cupones para desbloquear features premium

### Estados de Cupones

- **ACTIVE**: Cupón activo y disponible para usar
- **USED**: Cupón completamente usado (alcanzó el máximo de usos)
- **EXPIRED**: Cupón expirado
- **REVOKED**: Cupón revocado manualmente por un super admin

## Modelos de Base de Datos

### Coupon

- `id`: UUID único del cupón
- `code`: Código único del cupón (ej: "GAS-2025-ABC123")
- `type`: Tipo de cupón (CouponType enum)
- `description`: Descripción opcional del cupón
- `arkaPolicyId`: ID del policy creado en Arka CDN (para gas sponsorship)
- `arkaWalletAddress`: Dirección de la wallet asociada al policy en Arka
- `maxUses`: Número máximo de usos permitidos
- `currentUses`: Número de usos actuales
- `maxAmountPerUse`: Monto máximo por uso (para gas sponsorship)
- `expiresAt`: Fecha de expiración (null = no expira)
- `status`: Estado del cupón
- `createdById`: ID del super admin que creó el cupón
- `createdAt/updatedAt`: Timestamps

### CouponUsage

- `id`: UUID único del registro de uso
- `usedAt`: Fecha y hora del uso
- `amount`: Monto usado (para gas sponsorship)
- `txHash`: Hash de transacción (si aplica)
- `metadata`: Datos adicionales del uso (JSON)
- `ipAddress`: IP desde donde se usó
- `couponId`: Relación con el cupón
- `userId`: Usuario que usó el cupón

## API Endpoints

### 1. Crear Cupón (Solo Super Admin)

```
POST /coupons
Authorization: Bearer <token>

Body:
{
  "type": "GAS_SPONSORSHIP" | "FILE_UPLOAD" | "PREMIUM_FEATURE",
  "description": "Descripción opcional",
  "maxUses": 10,
  "maxAmountPerUse": 100.50,
  "expiresAt": "2025-12-31T23:59:59Z",
  "customCode": "CUSTOM-CODE-123" // Opcional
}

Response:
{
  "id": "uuid",
  "code": "GAS-2025-ABC123",
  "type": "GAS_SPONSORSHIP",
  "arkaPolicyId": "policy-id-from-arka",
  "arkaWalletAddress": "0x...",
  "maxUses": 10,
  "currentUses": 0,
  "status": "ACTIVE",
  ...
}
```

### 2. Validar Cupón (Público)

```
POST /coupons/validate

Body:
{
  "code": "GAS-2025-ABC123"
}

Response:
{
  "valid": true,
  "coupon": {
    "id": "uuid",
    "code": "GAS-2025-ABC123",
    "type": "GAS_SPONSORSHIP",
    "status": "ACTIVE",
    "remainingUses": 8,
    ...
  }
}
```

### 3. Usar Cupón

```
POST /coupons/use
Authorization: Bearer <token>

Body:
{
  "code": "GAS-2025-ABC123",
  "amount": 50.00, // Opcional
  "txHash": "0x...", // Opcional
  "metadata": { "key": "value" }, // Opcional
  "ipAddress": "192.168.1.1" // Opcional
}

Response:
{
  "success": true,
  "usage": {
    "id": "uuid",
    "usedAt": "2025-11-16T10:37:00Z",
    "amount": 50.00,
    ...
  },
  "coupon": {
    "remainingUses": 7,
    ...
  }
}
```

### 4. Listar Todos los Cupones (Solo Super Admin)

```
GET /coupons
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "code": "GAS-2025-ABC123",
    "type": "GAS_SPONSORSHIP",
    "status": "ACTIVE",
    "currentUses": 2,
    "maxUses": 10,
    "createdBy": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Super Admin"
    },
    "usages": [...]
  },
  ...
]
```

### 5. Obtener Cupón por Código (Solo Super Admin)

```
GET /coupons/:code
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "code": "GAS-2025-ABC123",
  "type": "GAS_SPONSORSHIP",
  "remainingUses": 8,
  "usages": [
    {
      "id": "uuid",
      "usedAt": "2025-11-16T10:37:00Z",
      "amount": 50.00,
      "user": {
        "id": "uuid",
        "email": "user@example.com"
      }
    }
  ],
  ...
}
```

### 6. Revocar Cupón (Solo Super Admin)

```
DELETE /coupons/:code
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "code": "GAS-2025-ABC123",
  "status": "REVOKED",
  ...
}
```

### 7. Obtener Mi Historial de Uso

```
GET /coupons/my-usage
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "usedAt": "2025-11-16T10:37:00Z",
    "amount": 50.00,
    "coupon": {
      "code": "GAS-2025-ABC123",
      "type": "GAS_SPONSORSHIP"
    }
  },
  ...
]
```

## Variables de Entorno Requeridas

```env
# Arka CDN API Key (para crear policies de gas sponsorship)
ARKA_API_KEY=your-arka-api-key-here

# Super Admin (debe estar configurado para crear cupones)
SUPER_ADMIN_EMAIL=admin@openleague.com
SUPER_ADMIN_PASSWORD=secure-password
```

## Flujo de Uso

### Para Super Admin (Crear Cupón)

1. Autenticarse como super admin
2. Llamar a `POST /coupons` con los datos del cupón
3. Si el tipo es `GAS_SPONSORSHIP`, el sistema automáticamente:
   - Obtiene la wallet de Moonbeam del super admin
   - Crea un policy en Arka CDN usando la API
   - Almacena el `arkaPolicyId` y `arkaWalletAddress` en el cupón

### Para Usuario (Usar Cupón)

1. (Opcional) Validar cupón con `POST /coupons/validate`
2. Autenticarse en la aplicación
3. Usar cupón con `POST /coupons/use`
4. El sistema verifica:
   - Que el cupón exista y esté activo
   - Que no haya expirado
   - Que no haya alcanzado el máximo de usos
   - Que el monto no exceda el límite (si aplica)
5. Registra el uso y actualiza los contadores

## Integración con Arka CDN

Cuando se crea un cupón de tipo `GAS_SPONSORSHIP`, el servicio:

1. Obtiene la wallet de Moonbeam del super admin
2. Hace una llamada a la API de Arka CDN:

   ```
   POST https://arka.biconomy.io/v2/paymaster/policy
   Authorization: Bearer <ARKA_API_KEY>

   {
     "name": "Coupon-Policy-<timestamp>",
     "description": "Policy creado desde sistema de cupones OpenLeague",
     "sponsorWalletAddress": "0x...",
     "isActive": true,
     "maxAmountPerTransaction": "100.50",
     "whitelist": [],
     "chainId": 1287
   }
   ```

3. Almacena el `policyId` retornado en el campo `arkaPolicyId` del cupón

## Características de Seguridad

- ✅ Solo super admins pueden crear cupones
- ✅ Solo super admins pueden ver todos los cupones
- ✅ Solo super admins pueden revocar cupones
- ✅ Validación de expiración automática
- ✅ Control de máximo de usos
- ✅ Control de monto máximo por uso
- ✅ Registro completo de historial de uso
- ✅ Códigos únicos autogenerados o personalizados

## Ejemplos de Uso

### Crear cupón de gas sponsorship para un jugador

```typescript
// Como super admin
const coupon = await fetch('http://localhost:3000/coupons', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <super-admin-token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'GAS_SPONSORSHIP',
    description: 'Cupón de gas para jugador profesional - Mes de diciembre',
    maxUses: 50,
    maxAmountPerUse: 10.0,
    expiresAt: '2025-12-31T23:59:59Z',
  }),
});

// Retorna: { code: "GAS-2025-A1B2C3", arkaPolicyId: "policy-123", ... }
```

### Validar y usar un cupón

```typescript
// Validar primero (público)
const validation = await fetch('http://localhost:3000/coupons/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'GAS-2025-A1B2C3' }),
});

// Si válido, usar el cupón (autenticado)
const usage = await fetch('http://localhost:3000/coupons/use', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <user-token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: 'GAS-2025-A1B2C3',
    amount: 5.0,
    txHash: '0x123...',
    metadata: { action: 'mint_player_nft' },
  }),
});
```

## Notas Importantes

1. **ARKA_API_KEY**: Debe estar configurada en el archivo `.env` para poder crear cupones de gas sponsorship
2. **Super Admin**: Debe tener una wallet de Moonbeam configurada
3. **Chain ID**: Actualmente configurado para Moonbase Alpha (1287), ajustar según la red
4. **Límites**: Los cupones pueden tener límite de usos y/o límite de monto por uso
5. **Expiración**: Los cupones pueden tener fecha de expiración o ser permanentes (null)

## Próximas Mejoras

- [ ] Dashboard visual para super admins
- [ ] Notificaciones cuando un cupón está por expirar
- [ ] Estadísticas de uso de cupones
- [ ] Exportación de reportes
- [ ] Integración con sistema de campañas
- [ ] Cupones para eventos específicos
