import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('OpenLeague Backend API')
    .setDescription(
      'API REST para gestión de torneos con integración blockchain (Hardhat), base de datos (Prisma) y almacenamiento descentralizado (Arka CDN / Arkiv Network)',
    )
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Autenticación y gestión de usuarios')
    .addTag('users', 'Gestión de usuarios')
    .addTag('profiles', 'Gestión de perfiles (Jugador, Club, DT, Fan)')
    .addTag('notifications', '🔔 Sistema de notificaciones automáticas')
    .addTag('challenges', '🏆 Sistema de retos temporales')
    .addTag('submissions', '🎥 Participaciones en retos con videos')
    .addTag('campaigns', '🎯 Sistema de campañas de jugadores')
    .addTag('coupons', '🎟️ Sistema de cupones (Gas Sponsorship, File Upload, Premium)')
    .addTag('blockchain', 'Interacción con smart contracts')
    .addTag('upload', 'Subida y gestión de archivos en Arkiv Network')
    .addTag('data', 'Acceso público a archivos (no requiere autenticación)')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'OpenLeague API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
