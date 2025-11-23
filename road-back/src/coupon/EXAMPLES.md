# Ejemplos de Uso de la API de Cupones

## 📋 Colección de Ejemplos para Testing

### Variables de Entorno

```bash
BASE_URL=http://localhost:3000/api
SUPER_ADMIN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1️⃣ Crear Cupón de Gas Sponsorship (Super Admin)

### Request

```bash
POST {{BASE_URL}}/coupons
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "type": "GAS_SPONSORSHIP",
  "description": "Cupón de gas para jugador profesional - Temporada 2025",
  "maxUses": 50,
  "maxAmountPerUse": 10.0,
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### cURL

```bash
curl -X POST "http://localhost:3000/api/coupons" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "GAS_SPONSORSHIP",
    "description": "Cupón de gas para jugador profesional - Temporada 2025",
    "maxUses": 50,
    "maxAmountPerUse": 10.0,
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "GAS-2025-A1B2C3",
  "type": "GAS_SPONSORSHIP",
  "description": "Cupón de gas para jugador profesional - Temporada 2025",
  "arkaPolicyId": "policy-1234567890",
  "arkaWalletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "maxUses": 50,
  "currentUses": 0,
  "maxAmountPerUse": 10.0,
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "status": "ACTIVE",
  "createdAt": "2025-11-16T10:37:27.123Z",
  "updatedAt": "2025-11-16T10:37:27.123Z",
  "createdById": "admin-uuid",
  "createdBy": {
    "id": "admin-uuid",
    "email": "admin@openleague.com",
    "name": "Super Admin"
  }
}
```

---

## 2️⃣ Crear Cupón de File Upload (Super Admin)

### Request

```bash
POST {{BASE_URL}}/coupons
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "type": "FILE_UPLOAD",
  "description": "Cupón para subida de videos de retos",
  "maxUses": 100,
  "expiresAt": "2025-06-30T23:59:59Z",
  "customCode": "VIDEO-UPLOAD-2025"
}
```

### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "code": "VIDEO-UPLOAD-2025",
  "type": "FILE_UPLOAD",
  "description": "Cupón para subida de videos de retos",
  "arkaPolicyId": null,
  "arkaWalletAddress": null,
  "maxUses": 100,
  "currentUses": 0,
  "maxAmountPerUse": null,
  "expiresAt": "2025-06-30T23:59:59.000Z",
  "status": "ACTIVE",
  "createdAt": "2025-11-16T10:40:00.000Z",
  "updatedAt": "2025-11-16T10:40:00.000Z",
  "createdById": "admin-uuid"
}
```

---

## 3️⃣ Crear Cupón Premium Sin Expiración (Super Admin)

### Request

```bash
POST {{BASE_URL}}/coupons
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "type": "PREMIUM_FEATURE",
  "description": "Acceso premium para patrocinadores VIP",
  "maxUses": 1,
  "customCode": "VIP-PREMIUM-LIFETIME"
}
```

### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "code": "VIP-PREMIUM-LIFETIME",
  "type": "PREMIUM_FEATURE",
  "description": "Acceso premium para patrocinadores VIP",
  "arkaPolicyId": null,
  "arkaWalletAddress": null,
  "maxUses": 1,
  "currentUses": 0,
  "maxAmountPerUse": null,
  "expiresAt": null,
  "status": "ACTIVE",
  "createdAt": "2025-11-16T10:42:00.000Z",
  "updatedAt": "2025-11-16T10:42:00.000Z",
  "createdById": "admin-uuid"
}
```

---

## 4️⃣ Validar Cupón (Público - No requiere auth)

### Request

```bash
POST {{BASE_URL}}/coupons/validate
Content-Type: application/json

{
  "code": "GAS-2025-A1B2C3"
}
```

### cURL

```bash
curl -X POST "http://localhost:3000/api/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GAS-2025-A1B2C3"
  }'
```

### Response (200 OK) - Cupón Válido

```json
{
  "valid": true,
  "coupon": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "GAS-2025-A1B2C3",
    "type": "GAS_SPONSORSHIP",
    "description": "Cupón de gas para jugador profesional - Temporada 2025",
    "arkaPolicyId": "policy-1234567890",
    "arkaWalletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "maxUses": 50,
    "currentUses": 5,
    "remainingUses": 45,
    "maxAmountPerUse": 10.0,
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "status": "ACTIVE",
    "createdAt": "2025-11-16T10:37:27.123Z",
    "updatedAt": "2025-11-16T11:00:00.000Z",
    "createdBy": {
      "id": "admin-uuid",
      "email": "admin@openleague.com",
      "name": "Super Admin"
    },
    "usages": [...]
  }
}
```

### Response (400 Bad Request) - Cupón Expirado

```json
{
  "statusCode": 400,
  "message": "Cupón expirado",
  "error": "Bad Request"
}
```

### Response (404 Not Found) - Cupón No Existe

```json
{
  "statusCode": 404,
  "message": "Cupón no encontrado",
  "error": "Not Found"
}
```

---

## 5️⃣ Usar Cupón (Usuario Autenticado)

### Request

```bash
POST {{BASE_URL}}/coupons/use
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json

{
  "code": "GAS-2025-A1B2C3",
  "amount": 5.5,
  "txHash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
  "metadata": {
    "action": "mint_player_nft",
    "playerId": "player-uuid-123",
    "nftId": "nft-456"
  },
  "ipAddress": "192.168.1.100"
}
```

### cURL

```bash
curl -X POST "http://localhost:3000/api/coupons/use" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GAS-2025-A1B2C3",
    "amount": 5.5,
    "txHash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    "metadata": {
      "action": "mint_player_nft",
      "playerId": "player-uuid-123"
    }
  }'
```

### Response (200 OK)

```json
{
  "success": true,
  "usage": {
    "id": "usage-uuid-001",
    "couponId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid-789",
    "usedAt": "2025-11-16T11:30:00.000Z",
    "amount": 5.5,
    "txHash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    "metadata": {
      "action": "mint_player_nft",
      "playerId": "player-uuid-123",
      "nftId": "nft-456"
    },
    "ipAddress": "192.168.1.100"
  },
  "coupon": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "GAS-2025-A1B2C3",
    "type": "GAS_SPONSORSHIP",
    "status": "ACTIVE",
    "maxUses": 50,
    "currentUses": 6,
    "remainingUses": 44,
    "maxAmountPerUse": 10.0,
    "expiresAt": "2025-12-31T23:59:59.000Z"
  }
}
```

---

## 6️⃣ Listar Todos los Cupones (Super Admin)

### Request

```bash
GET {{BASE_URL}}/coupons
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/coupons" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

### Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "GAS-2025-A1B2C3",
    "type": "GAS_SPONSORSHIP",
    "description": "Cupón de gas para jugador profesional - Temporada 2025",
    "arkaPolicyId": "policy-1234567890",
    "arkaWalletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "maxUses": 50,
    "currentUses": 6,
    "maxAmountPerUse": 10.0,
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "status": "ACTIVE",
    "createdAt": "2025-11-16T10:37:27.123Z",
    "updatedAt": "2025-11-16T11:30:00.000Z",
    "createdById": "admin-uuid",
    "createdBy": {
      "id": "admin-uuid",
      "email": "admin@openleague.com",
      "name": "Super Admin"
    },
    "usages": [
      {
        "id": "usage-uuid-001",
        "usedAt": "2025-11-16T11:30:00.000Z",
        "amount": 5.5,
        "user": {
          "id": "user-uuid-789",
          "email": "player@example.com",
          "name": "Jugador Pro"
        }
      }
    ]
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "code": "VIDEO-UPLOAD-2025",
    "type": "FILE_UPLOAD",
    "description": "Cupón para subida de videos de retos",
    "arkaPolicyId": null,
    "arkaWalletAddress": null,
    "maxUses": 100,
    "currentUses": 23,
    "maxAmountPerUse": null,
    "expiresAt": "2025-06-30T23:59:59.000Z",
    "status": "ACTIVE",
    "createdAt": "2025-11-16T10:40:00.000Z",
    "updatedAt": "2025-11-16T11:25:00.000Z",
    "createdById": "admin-uuid",
    "createdBy": {
      "id": "admin-uuid",
      "email": "admin@openleague.com",
      "name": "Super Admin"
    },
    "usages": [...]
  }
]
```

---

## 7️⃣ Obtener Mi Historial de Uso (Usuario Autenticado)

### Request

```bash
GET {{BASE_URL}}/coupons/my-usage
Authorization: Bearer {{USER_TOKEN}}
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/coupons/my-usage" \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Response (200 OK)

```json
[
  {
    "id": "usage-uuid-001",
    "usedAt": "2025-11-16T11:30:00.000Z",
    "amount": 5.5,
    "txHash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    "metadata": {
      "action": "mint_player_nft",
      "playerId": "player-uuid-123",
      "nftId": "nft-456"
    },
    "ipAddress": "192.168.1.100",
    "coupon": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "GAS-2025-A1B2C3",
      "type": "GAS_SPONSORSHIP",
      "description": "Cupón de gas para jugador profesional - Temporada 2025"
    }
  },
  {
    "id": "usage-uuid-002",
    "usedAt": "2025-11-15T09:15:00.000Z",
    "amount": 3.2,
    "txHash": "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    "metadata": {
      "action": "transfer_tokens"
    },
    "ipAddress": "192.168.1.100",
    "coupon": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "GAS-2025-A1B2C3",
      "type": "GAS_SPONSORSHIP",
      "description": "Cupón de gas para jugador profesional - Temporada 2025"
    }
  }
]
```

---

## 8️⃣ Obtener Detalles de un Cupón por Código (Super Admin)

### Request

```bash
GET {{BASE_URL}}/coupons/GAS-2025-A1B2C3
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/coupons/GAS-2025-A1B2C3" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "GAS-2025-A1B2C3",
  "type": "GAS_SPONSORSHIP",
  "description": "Cupón de gas para jugador profesional - Temporada 2025",
  "arkaPolicyId": "policy-1234567890",
  "arkaWalletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "maxUses": 50,
  "currentUses": 6,
  "remainingUses": 44,
  "maxAmountPerUse": 10.0,
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "status": "ACTIVE",
  "createdAt": "2025-11-16T10:37:27.123Z",
  "updatedAt": "2025-11-16T11:30:00.000Z",
  "createdById": "admin-uuid",
  "createdBy": {
    "id": "admin-uuid",
    "email": "admin@openleague.com",
    "name": "Super Admin"
  },
  "usages": [
    {
      "id": "usage-uuid-001",
      "usedAt": "2025-11-16T11:30:00.000Z",
      "amount": 5.5,
      "txHash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
      "metadata": {
        "action": "mint_player_nft",
        "playerId": "player-uuid-123"
      },
      "user": {
        "id": "user-uuid-789",
        "email": "player@example.com",
        "name": "Jugador Pro"
      }
    },
    {
      "id": "usage-uuid-002",
      "usedAt": "2025-11-16T10:45:00.000Z",
      "amount": 4.0,
      "txHash": "0xdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abc",
      "user": {
        "id": "user-uuid-456",
        "email": "another@example.com",
        "name": "Otro Usuario"
      }
    }
  ]
}
```

---

## 9️⃣ Revocar un Cupón (Super Admin)

### Request

```bash
DELETE {{BASE_URL}}/coupons/GAS-2025-A1B2C3
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### cURL

```bash
curl -X DELETE "http://localhost:3000/api/coupons/GAS-2025-A1B2C3" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "GAS-2025-A1B2C3",
  "type": "GAS_SPONSORSHIP",
  "description": "Cupón de gas para jugador profesional - Temporada 2025",
  "status": "REVOKED",
  "maxUses": 50,
  "currentUses": 6,
  "updatedAt": "2025-11-16T12:00:00.000Z"
}
```

---

## 🔒 Casos de Error Comunes

### Error: Código de Cupón Ya Existe

```json
{
  "statusCode": 400,
  "message": "El código de cupón ya existe",
  "error": "Bad Request"
}
```

### Error: No es Super Admin

```json
{
  "statusCode": 403,
  "message": "Solo los super admins pueden crear cupones",
  "error": "Forbidden"
}
```

### Error: Cupón Expirado

```json
{
  "statusCode": 400,
  "message": "Cupón expirado",
  "error": "Bad Request"
}
```

### Error: Máximo de Usos Alcanzado

```json
{
  "statusCode": 400,
  "message": "Cupón ha alcanzado el máximo de usos",
  "error": "Bad Request"
}
```

### Error: Monto Excede Límite

```json
{
  "statusCode": 400,
  "message": "El monto excede el límite permitido por uso: 10",
  "error": "Bad Request"
}
```

### Error: ARKA_API_KEY No Configurada

```json
{
  "statusCode": 500,
  "message": "ARKA_API_KEY no configurada",
  "error": "Internal Server Error"
}
```

---

## 📊 Postman Collection

### Importar a Postman

Puedes crear una collection en Postman con estos endpoints:

1. **Variables de Colección:**
   - `baseUrl`: `http://localhost:3000/api`
   - `superAdminToken`: Tu token de super admin
   - `userToken`: Tu token de usuario

2. **Requests:**
   - POST Create Gas Sponsorship Coupon
   - POST Create File Upload Coupon
   - POST Validate Coupon (no auth)
   - POST Use Coupon
   - GET List All Coupons
   - GET My Coupon Usage
   - GET Coupon By Code
   - DELETE Revoke Coupon

---

## 🧪 Testing con Jest/Supertest

```typescript
describe('Coupon System (e2e)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let userToken: string;
  let testCouponCode: string;

  beforeAll(async () => {
    // Setup...
  });

  describe('POST /coupons', () => {
    it('should create a gas sponsorship coupon as super admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/coupons')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          type: 'GAS_SPONSORSHIP',
          description: 'Test coupon',
          maxUses: 10,
          maxAmountPerUse: 5.0,
        })
        .expect(201);

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('arkaPolicyId');
      testCouponCode = response.body.code;
    });

    it('should fail to create coupon as regular user', async () => {
      await request(app.getHttpServer())
        .post('/coupons')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          type: 'FILE_UPLOAD',
          maxUses: 5,
        })
        .expect(403);
    });
  });

  describe('POST /coupons/validate', () => {
    it('should validate a valid coupon', async () => {
      const response = await request(app.getHttpServer())
        .post('/coupons/validate')
        .send({ code: testCouponCode })
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.coupon.code).toBe(testCouponCode);
    });
  });

  describe('POST /coupons/use', () => {
    it('should use a coupon successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/coupons/use')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: testCouponCode,
          amount: 3.0,
          metadata: { action: 'test' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.coupon.currentUses).toBe(1);
    });
  });
});
```
