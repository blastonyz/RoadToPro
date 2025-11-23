# Sistema de Campañas de Jugadores

## Descripción

Sistema que permite a **admins** y **super admins** crear campañas de financiamiento para jugadores con información detallada sobre metas, presupuesto, cronograma y retos verificados.

## Endpoints

### 1. Crear Campaña

**POST** `/campaigns`

**Requiere:** Bearer Token (Admin o Super Admin)

**Body de ejemplo:**

```json
{
  "title": "Campaña del Jugador - Cristiano Ronaldo",
  "description": "Campaña de financiamiento para desarrollo profesional del jugador",
  "photoUrl": "https://example.com/player-photo.jpg",
  "presentationVideo": "https://example.com/presentation-video.mp4",
  "olRating": 78,
  "sportingGoals": [
    { "goal": "Mejorar precisión de pase al 90%" },
    { "goal": "Aumentar resistencia aeróbica nivel 8/10" },
    { "goal": "Prueba en club semiprofesional" }
  ],
  "budget": {
    "nutrition": 200,
    "personalTrainer": 350,
    "travels": 300,
    "equipment": 150,
    "physiotherapy": 200,
    "total": 1200
  },
  "timeline": [
    { "date": "2025-02-01", "milestone": "Semana 1: +2 puntos OL" },
    { "date": "2025-02-08", "milestone": "Semana 2: Objetivo físico cumplido" },
    { "date": "2025-02-15", "milestone": "Semana 3: Nuevo récord de precisión" }
  ],
  "featuredChallenges": [
    {
      "name": "Control orientado bajo presión",
      "category": "Técnica",
      "points": 50,
      "validated": true,
      "validator": "Staff OL"
    },
    {
      "name": "Sprint 40m",
      "category": "Física",
      "points": 30,
      "validated": true,
      "validator": "Staff OL"
    },
    {
      "name": "Disciplina semanal",
      "category": "Mental",
      "points": 35,
      "validated": true,
      "validator": "Staff OL"
    }
  ],
  "playerId": "uuid-del-jugador",
  "startDate": "2025-02-01",
  "endDate": "2025-05-01"
}
```

**Respuesta exitosa (201):**

```json
{
  "id": "campaign-uuid",
  "title": "Campaña del Jugador - Cristiano Ronaldo",
  "description": "Campaña de financiamiento para desarrollo profesional del jugador",
  "photoUrl": "https://example.com/player-photo.jpg",
  "presentationVideo": "https://example.com/presentation-video.mp4",
  "olRating": 78,
  "sportingGoals": [...],
  "budget": {...},
  "timeline": [...],
  "featuredChallenges": [...],
  "status": "DRAFT",
  "startDate": "2025-02-01T00:00:00.000Z",
  "endDate": "2025-05-01T00:00:00.000Z",
  "createdAt": "2025-11-16T10:30:00.000Z",
  "updatedAt": "2025-11-16T10:30:00.000Z",
  "playerId": "uuid-del-jugador",
  "player": {
    "id": "uuid-del-jugador",
    "email": "player@example.com",
    "name": "Cristiano Ronaldo",
    "playerProfile": {
      "displayName": "CR7",
      "position": "Delantero",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  },
  "createdById": "uuid-del-admin",
  "createdBy": {
    "id": "uuid-del-admin",
    "email": "admin@openleague.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

---

### 2. Obtener todas las campañas

**GET** `/campaigns`

**Query Params (opcionales):**

- `status`: DRAFT | ACTIVE | PAUSED | COMPLETED | CANCELLED
- `playerId`: UUID del jugador

**Ejemplos:**

- `/campaigns` - Todas las campañas
- `/campaigns?status=ACTIVE` - Solo campañas activas
- `/campaigns?playerId=uuid-del-jugador` - Campañas de un jugador específico

---

### 3. Obtener una campaña por ID

**GET** `/campaigns/:id`

**Ejemplo:** `/campaigns/campaign-uuid`

---

### 4. Actualizar una campaña

**PATCH** `/campaigns/:id`

**Requiere:** Bearer Token (Admin que la creó o Super Admin)

**Body (todos los campos son opcionales):**

```json
{
  "title": "Nuevo título",
  "olRating": 80,
  "status": "ACTIVE",
  "sportingGoals": [...],
  "budget": {...},
  "timeline": [...]
}
```

---

### 5. Eliminar una campaña

**DELETE** `/campaigns/:id`

**Requiere:** Bearer Token (Admin que la creó o Super Admin)

---

### 6. Obtener campañas de un jugador

**GET** `/campaigns/player/:playerId`

**Ejemplo:** `/campaigns/player/uuid-del-jugador`

---

## Estados de Campaña

- **DRAFT**: Borrador (por defecto al crear)
- **ACTIVE**: Activa y visible públicamente
- **PAUSED**: Pausada temporalmente
- **COMPLETED**: Completada exitosamente
- **CANCELLED**: Cancelada

---

## Permisos

✅ **Crear campañas:** Solo ADMIN y SUPER_ADMIN  
✅ **Ver campañas:** Todos (público)  
✅ **Editar/Eliminar:** Solo quien creó la campaña o SUPER_ADMIN

---

## Notas

1. El `playerId` debe ser un usuario con perfil de jugador (`playerProfile`)
2. Los campos `featuredChallenges`, `photoUrl`, `presentationVideo`, `startDate` y `endDate` son opcionales
3. El `olRating` debe estar entre 0 y 100
4. El `budget.total` es obligatorio en el objeto budget
5. Las fechas deben estar en formato ISO 8601: `YYYY-MM-DD`
