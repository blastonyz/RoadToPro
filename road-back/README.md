# Frontend REPO Link

https://github.com/Emanuel250YT/OpenLeague-Frontend

# CDN REPO LINK

https://github.com/Emanuel250YT/arka-cdn

# OPEN LEAGUE DEMO AND WEBSITE

https://openleague.pro

# OpenLeague Backend

Backend en NestJS con soporte para Prisma (ORM), Hardhat (Smart Contracts) y Arka CDN (Almacenamiento Descentralizado).

> 📚 **Índice completo de documentación:** Ver [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## 🚀 Características

- **NestJS**: Framework progresivo de Node.js para aplicaciones server-side
- **Prisma**: ORM moderno para TypeScript y Node.js
- **Hardhat**: Entorno de desarrollo para Ethereum
- **Smart Contracts**: Contrato TournamentManager para gestión de torneos on-chain
- **Arka CDN**: Almacenamiento descentralizado en Arkiv Network
- **Autenticación JWT**: Sistema completo de auth con tokens revocables
- **Multi-Wallet**: Soporte para vincular múltiples wallets (Ethereum, Polygon, BSC, etc.)
- **Login con Wallet**: Autenticación con wallet + OTP por email
- **Sistema de Perfiles**: Perfiles para jugadores, clubes, entrenadores y fans
- **Sistema de Notificaciones**: Notificaciones automáticas vinculadas a acciones relevantes
- **Sistema de Retos**: Retos temporales con integración de Arka CDN y creación automática
- **Tareas Programadas**: Cron jobs para gestión automática de retos y notificaciones
- **Upload de Archivos**: Subida y gestión de archivos en blockchain
- **Swagger**: Documentación interactiva de API REST
- **TypeScript**: Tipado estático completo
- **Validación**: Class-validator para validación de DTOs

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (para Prisma)
- npm o yarn
- Cuenta en Arka CDN (https://arkacdn.cloudycoding.com)

## 🛠️ Instalación

1. **Clonar o navegar al proyecto**

```bash
cd openleague-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `JWT_ACCESS_EXPIRATION`: Tiempo de expiración de access tokens (ej: "15m")
- `JWT_REFRESH_EXPIRATION`: Tiempo de expiración de refresh tokens (ej: "7d")
- `EMAIL_HOST`: Servidor SMTP (ej: "smtp.gmail.com")
- `ARKA_CDN_EMAIL`: Email de tu cuenta en Arka CDN
- `ARKA_CDN_PASSWORD`: Contraseña de tu cuenta en Arka CDN
- `EMAIL_PORT`: Puerto SMTP (587)
- `EMAIL_USER`: Tu email para enviar mensajes
- `EMAIL_PASSWORD`: Contraseña de aplicación de Gmail
- `RPC_URL`: URL del proveedor RPC (Alchemy, Infura, etc.)
- `PRIVATE_KEY`: Clave privada para deployments
- `CONTRACT_ADDRESS`: Dirección del contrato desplegado

4. **Configurar Prisma**

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

5. **Compilar Smart Contracts**

```bash
npm run hardhat:compile
```

## 🏃‍♂️ Ejecución

### Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000/api`

**📚 Documentación Swagger:** `http://localhost:3000/api/docs`

### Producción

```bash
npm run build
npm run start:prod
```

## 🔗 Blockchain

### Iniciar red local de Hardhat

```bash
npx hardhat node
```

### Desplegar contratos

```bash
# Red local
npm run hardhat:deploy

# Red de prueba (Sepolia)
npx hardhat run scripts/deploy.ts --network sepolia
```

### Probar contratos

```bash
npm run hardhat:test
```

## 📊 Prisma Studio

Para visualizar y editar datos en la base de datos:

```bash
npm run prisma:studio
```

## 🗂️ Estructura del Proyecto

```
openleague-backend/
├── contracts/              # Smart Contracts de Solidity
│   └── TournamentManager.sol
├── prisma/                 # Configuración de Prisma
│   └── schema.prisma
├── scripts/                # Scripts de deployment
│   └── deploy.ts
├── src/                    # Código fuente
│   ├── auth/              # Módulo de autenticación
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── polkadot-wallet.service.ts
│   ├── upload/            # Módulo de Arka CDN
│   │   ├── dto/
│   │   ├── arka-cdn.service.ts
│   │   ├── upload.service.ts
│   │   ├── upload.controller.ts
│   │   ├── data.controller.ts
│   │   └── upload.module.ts
│   ├── notification/      # Módulo de notificaciones
│   │   ├── dto/
│   │   ├── notification.controller.ts
│   │   ├── notification.service.ts
│   │   └── notification.module.ts
│   ├── challenge/         # Módulo de retos
│   │   ├── dto/
│   │   ├── challenge.controller.ts
│   │   ├── challenge.service.ts
│   │   └── challenge.module.ts
│   ├── tasks/             # Módulo de tareas programadas
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── profile/           # Módulo de perfiles
│   │   ├── dto/
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   └── profile.module.ts
│   ├── email/             # Módulo de email
│   │   ├── email.module.ts
│   │   └── email.service.ts
│   ├── prisma/            # Módulo de Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── users/             # Módulo de usuarios
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── hardhat.config.ts      # Configuración de Hardhat
├── AUTH_SYSTEM.md         # Documentación del sistema de autenticación
├── NOTIFICATIONS_AND_CHALLENGES.md  # Documentación de notificaciones y retos
├── PROFILES_SYSTEM.md     # Documentación del sistema de perfiles
├── QUICK_START.md         # Guía de inicio rápido
├── package.json
└── tsconfig.json
```

## 📡 API Endpoints

> 📖 **Referencia completa de API:** Ver [API_REFERENCE.md](./API_REFERENCE.md) - Documentación detallada de todos los endpoints (60+)

### General

- `GET /api` - Mensaje de bienvenida
- `GET /api/health` - Health check

### Autenticación 🔐

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (email/contraseña o wallet)
- `POST /api/auth/verify-otp` - Verificar código OTP
- `POST /api/auth/refresh` - Refrescar access token
- `POST /api/auth/logout` - Cerrar sesión (requiere JWT)
- `POST /api/auth/wallets` - Vincular wallet (requiere JWT)
- `GET /api/auth/wallets` - Listar wallets (requiere JWT)
- `GET /api/auth/me` - Obtener perfil (requiere JWT)

> 📖 **Documentación completa:** Ver [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)

### Usuarios

- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/wallet/:address` - Obtener usuario por wallet
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Upload / Arka CDN

- `POST /api/upload/file` - Subir archivo
- `POST /api/upload/plain` - Subir texto/JSON
- `GET /api/upload` - Listar archivos del usuario
- `GET /api/upload/:id` - Obtener información del archivo
- `GET /api/upload/:id/text` - Obtener contenido de texto
- `GET /api/upload/:id/json` - Obtener y parsear JSON
- `GET /api/upload/:id/status` - Obtener estado de subida
- `DELETE /api/upload/:id` - Eliminar archivo
- `GET /api/data/:uuid` - **Descargar archivo (público, sin auth)**

### Blockchain

- `POST /api/blockchain/tournament` - Crear torneo on-chain
- `GET /api/blockchain/tournament/:id` - Obtener torneo
- `POST /api/blockchain/tournament/:id/participant` - Agregar participante
- `GET /api/blockchain/tournament/:id/participants` - Listar participantes
- `POST /api/blockchain/tournament/:id/payout` - Pagar a ganadores

### Notificaciones 🔔

- `GET /api/notifications` - Obtener notificaciones del usuario (requiere JWT)
  - Query params: `type`, `isRead`, `page`, `limit`
- `GET /api/notifications/unread-count` - Contador de notificaciones no leídas (requiere JWT)
- `GET /api/notifications/:id` - Obtener notificación específica (requiere JWT)
- `PATCH /api/notifications/:id` - Marcar notificación como leída (requiere JWT)
- `PATCH /api/notifications/mark-all/read` - Marcar todas como leídas (requiere JWT)
- `DELETE /api/notifications/:id` - Eliminar notificación (requiere JWT)

> 📖 **Documentación completa:** Ver [NOTIFICATIONS_AND_CHALLENGES.md](./NOTIFICATIONS_AND_CHALLENGES.md)

### Retos (Challenges) 🏆

- `POST /api/challenges` - Crear reto (requiere JWT)
- `GET /api/challenges` - Listar retos con filtros
  - Query params: `status`, `difficulty`, `page`, `limit`
- `GET /api/challenges/active` - Obtener retos activos
- `GET /api/challenges/:id` - Obtener reto específico
- `PATCH /api/challenges/:id` - Actualizar reto (requiere JWT)
- `DELETE /api/challenges/:id` - Eliminar reto (requiere JWT)

> 📖 **Documentación completa:** Ver [NOTIFICATIONS_AND_CHALLENGES.md](./NOTIFICATIONS_AND_CHALLENGES.md)

### Participaciones (Challenge Submissions) 🎥

- `POST /api/challenges/submissions` - Crear participación en reto (requiere JWT)
- `GET /api/challenges/submissions/my` - Obtener mis participaciones (requiere JWT)
- `GET /api/challenges/:id/submissions` - Obtener participaciones de un reto
- `GET /api/challenges/submissions/:id` - Obtener participación específica (requiere JWT)
- `PATCH /api/challenges/submissions/:id` - Actualizar participación (aprobar/rechazar) (requiere JWT)
- `DELETE /api/challenges/submissions/:id` - Eliminar participación (requiere JWT)

> 📖 **Documentación completa:** Ver [NOTIFICATIONS_AND_CHALLENGES.md](./NOTIFICATIONS_AND_CHALLENGES.md)

## 📚 Documentación Adicional

### Sistema de Autenticación

- **[AUTH_SYSTEM.md](AUTH_SYSTEM.md)** - Sistema completo de autenticación
  - Registro y login con email/contraseña
  - Login con wallet + OTP
  - Gestión de múltiples wallets
  - Tokens JWT revocables

### Sistema de Perfiles

- **[PROFILES_SYSTEM.md](PROFILES_SYSTEM.md)** - Sistema de perfiles
  - Perfiles de jugadores (con NFTs)
  - Perfiles de clubes (con tokens ERC20)
  - Perfiles de entrenadores
  - Perfiles de fans

### Sistema de Notificaciones y Retos

- **[NOTIFICATIONS_AND_CHALLENGES.md](NOTIFICATIONS_AND_CHALLENGES.md)** - Documentación completa
  - Sistema de notificaciones automáticas (12 tipos)
  - Sistema de retos temporales (4 niveles de dificultad)
  - Participaciones con videos de Arka CDN
  - Tareas programadas (cron jobs)
- **[TESTING_COMMANDS.md](TESTING_COMMANDS.md)** - Comandos para testing
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Resumen de implementación

### Arka CDN Integration

Para documentación completa sobre la integración de Arka CDN:

- **[QUICK_START.md](QUICK_START.md)** - Guía rápida de configuración (5 minutos)
- **[ARKA_CDN_INTEGRATION.md](ARKA_CDN_INTEGRATION.md)** - Documentación completa de la API
- **[FRONTEND_EXAMPLES.md](FRONTEND_EXAMPLES.md)** - Ejemplos listos para frontend

### Características de Arka CDN

- ✅ Subida de archivos (imágenes, videos, documentos, texto, JSON)
- ✅ Almacenamiento descentralizado en Arkiv Network
- ✅ Compresión automática de imágenes y videos
- ✅ División en chunks para archivos grandes
- ✅ URLs públicas para compartir archivos
- ✅ TTL configurable para archivos temporales
- ✅ Seguimiento de estado de subida
- ✅ Acceso público sin autenticación

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🎯 Ejemplos de Uso

### Registrar y autenticar un usuario

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "SecurePass123!",
    "name": "Player One"
  }'

# 2. Vincular wallet al usuario (usando el accessToken del registro)
curl -X POST http://localhost:3000/api/auth/wallets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "network": "ethereum",
    "currency": "ETH",
    "isDefault": true
  }'

# 3. Login con wallet (recibe OTP por email)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'

# 4. Verificar OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "code": "123456"
  }'
```

### Crear un torneo on-chain

```bash
curl -X POST http://localhost:3000/api/blockchain/tournament \
  -H "Content-Type: application/json" \
  -d '{"name": "Championship 2024", "prizePool": "1.0"}'
```

### Crear un usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "name": "Player One",
    "walletAddress": "0x..."
  }'
```

### Obtener notificaciones del usuario

```bash
# Obtener todas las notificaciones no leídas
curl -X GET "http://localhost:3000/api/notifications?isRead=false" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Marcar todas como leídas
curl -X PATCH http://localhost:3000/api/notifications/mark-all/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Ver retos activos y participar

```bash
# 1. Ver retos activos
curl -X GET http://localhost:3000/api/challenges/active

# 2. Subir video para participación
curl -X POST http://localhost:3000/api/upload/file \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@video.mp4" \
  -F "description=Mi participación" \
  -F "compress=true"

# 3. Crear participación en el reto
curl -X POST http://localhost:3000/api/challenges/submissions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "uuid-del-reto",
    "arkaFileId": "uuid-del-video",
    "videoUrl": "https://arka-cdn.com/...",
    "description": "Mi mejor regate"
  }'

# 4. Ver mis participaciones
curl -X GET http://localhost:3000/api/challenges/submissions/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Smart Contract

El contrato `TournamentManager` incluye:

- Creación de torneos con prize pool
- Gestión de participantes
- Distribución de premios
- Control de acceso (solo organizador)
- Protección contra reentrancy

## 📚 Documentación Adicional

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT

# MILESTONE 2 PLAN — Open League

The future of discovery, scouting & player growth for amateur football worldwide.

Team: Mariano Velarde & Emanuel Guzmán
Track: ✔ SHIP-A-TON
Date: Noviembre 2025

## 📍 WHERE WE ARE NOW

What we built/validated this weekend

Validamos el concepto central: un sistema de retos + videos + ranking que permite que jugadores amateurs puedan mostrar su progreso y tener visibilidad global.

Creamos las primeras pantallas funcionales usando IA para acelerar producción y tener un MVP visualizable.

Probamos el concepto con lapachanga.club, una comunidad real de jugadores casuales y amateurs que confirmaron el entusiasmo por la gamificación y el progreso visible.

Probamos el flujo básico de carga de videos, validamos que el proceso es intuitivo y atractivo para jugadores jóvenes.

## What's working

La gamificación genera una respuesta muy fuerte: los jugadores quieren mejorar, avanzar en rankings y cumplir retos.

El enfoque de progreso individual (tipo “camino a profesional”) resuena profundamente en comunidades amateurs.

El contenido generado por usuarios (UGC) funciona muy bien con creadores de contenido de fútbol (potencial de virales).

El MVP es viable sin diseño final gracias al uso de IA + arquitectura clara.

What still needs work

Diseño y UX profesional (estaba previsto realizarlo en Webflow, pero lo pospusimos por tiempo).

Afinar el sistema de retos con apoyo experto (coaches, clubes, entrenadores profesionales).

Refinar el onboarding de marcas, clubes y socios.

Definir criterios justos y transparentes para scoring, clasificación y ranking de videos.

Establecer el marco legal para donaciones, pagos y contratos (internacionales).

Blockers or hurdles we hit

Falta de tiempo para diseño visual avanzado.

Limitaciones para integrar Webflow en esta etapa.

Necesidad de una estructura legal sólida debido a la naturaleza internacional del modelo.

Necesidad de apoyo experto para tokenomics (esperamos obtenerlo con Polkadot).

## 🚀 WHAT WE'LL SHIP IN 30 DAYS

Our MVP will do this

Open League permitirá que jugadores amateurs suban videos cumpliendo retos deportivos, reciban puntuaciones y compitan en rankings visibles por clubes, marcas y creadores.
A su vez, permitirá que clubes y patrocinadores descubran talento emergente y puedan apoyarlos económicamente a través de donaciones o pequeños contratos iniciales.
El MVP demostrará un “player-to-world showcase” funcional con scoring y retos activos.

⚙ Features We'll Build (3–5 MAX)
Week 1–2
Feature: Onboarding de jugadores + perfiles + carga de videos

Why it matters: es el corazón del MVP; necesitamos que los jugadores puedan comenzar su camino, documentar su progreso y generar material para ranking.
Who builds it: Emanuel Guzmán.

Feature: Sistema inicial de retos dinámicos (con expiración, reintentos y registro histórico)

Why it matters: Los retos son el método principal para medir progreso real; permiten retener usuarios y atraer creadores de contenido.
Who builds it: Emanuel Guzmán.

Week 2–3
Feature: Sistema de scoring + ranking visible

Why it matters: Permite que el ecosistema funcione como “liga abierta mundial". Es lo que vuelve adictiva la experiencia.
Who builds it: Emanuel Guzmán, con validación externa de entrenadores y clubes.

Feature: Inicio de onboarding para marcas y clubes

Why it matters: Abrimos la puerta a patrocinios reales, donaciones y oportunidades de scouting.
Who builds it: Mariano Velarde (relaciones + negociación).

Week 3–4
Feature: Integración legal y financiera básica (donaciones, contratos iniciales)

Why it matters: Necesitamos procesar transacciones legales e internacionales.
Who builds it: Mariano Velarde + equipo legal externo (a confirmar).

Feature: Panel interno para validar y moderar videos

Why it matters: Garantiza fairness, combate contenido fraudulento y protege la reputación del piloto.
Who builds it: Emanuel Guzmán.

## 👥 Team Breakdown

Mariano Velarde — CEO / BizDev / Community Lead | 10–20 hrs/semana

Fundador de lapachanga.club, comunidad real de jugadores amateurs.

Dueño de una red activa dentro del ecosistema del fútbol amateur y profesional.

Responsable de alianzas estratégicas (clubes profesionales, academias, marcas deportivas).

Gestionará contactos con iniciativas como Copa Potrero, influencers, academias y sponsors.

Emanuel Guzmán — CTO / Tech Lead | 10–15 hrs/semana

Desarrollador para la Escuela de Fútbol de River Plate en Salta.

Con experiencia en Web3 y sistemas de evaluación/deportivos.

Responsable de arquitectura, desarrollo del MVP, base de datos, retos y scoring.

Coordina tokenomics con mentores de Polkadot.

## 🧠 Mentoring & Expertise We Need

Areas where we need support

Marco legal y compliance para contratos internacionales y donaciones.

Estructura financiera Web3 confiable y auditada.

UX avanzado para escalar fuera del MVP.

Specific expertise we're looking for

Asesoría en Tokenomics con Polkadot (modelo sostenible y escalable).

Asesores deportivos profesionales para calibrar retos y métricas.

Mentoría en escalado de plataformas UGC para comunidades masivas.

## 🎯 WHAT HAPPENS AFTER

When M2 is done, we plan to…

Lanzar el MVP público para los primeros 100 jugadores reales antes del fin del mes.

Activar campañas virales con creadores de contenido de fútbol (reacciones a jugadores).

Abrir nuestro primer pipeline de scouting con clubes y academias ya en contacto.

Comenzar negociaciones con sponsors para financiar los primeros desafíos y premios.

And 6 months out we see our project achieve…

Tener una estructura legal completa y una empresa constituida.

Conseguir nuestro primer jugador contratado o becado gracias a Open League.

Establecer alianzas con clubes medianos y grandes (tenemos contactos activos).

Ser adoptados por creadores de contenido (los más grandes reaccionan a talento; esto amplifica 1 jugador → millones de vistas).

Incorporar tokenomics optimizados con Polkadot para recompensas, transparencia y trazabilidad.

Superar los 10.000 jugadores registrados y tener un ecosistema activo, con retos, ranking y scouting real.

## 🏁 Open League: una liga abierta al mundo

Construimos una herramienta que permite que cualquier jugador, desde cualquier potrero, pueda competir, progresar y ser visto.
Creemos en el talento oculto.
Y estamos construyendo la plataforma que lo va a revelar
