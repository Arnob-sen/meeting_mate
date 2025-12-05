import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000; // Default to 4000 to match your .env

  // CORS Configuration
  app.enableCors({
    origin: '*', // Allow all for MVP development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      transform: true,
      whitelist: true, // Strips properties not in DTO
      // exceptionFactory: (errors) => new BadRequestException(errors), // Simplified for MVP
    }),
  );

  // Global Interceptors (Standard)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: false, // Changed to false for MVP simplicity
      enableImplicitConversion: true,
    }),
    // new LoggingInterceptor(), // Uncomment if you have this file
  );

  // app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost))); // Uncomment if you have this file

  // --- API DOCUMENTATION SETUP ---
  const options = new DocumentBuilder()
    .addServer('/api') // Important: Matches global prefix
    .setTitle('AI CRM MVP API')
    .setDescription(
      'API for recording, transcribing, and summarizing meetings.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // Swagger UI (Legacy)
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Scalar UI (Modern)
  app.use(
    '/reference',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    apiReference({
      content: document,
    }),
  );

  // Increase body limit for Audio Files
  app.use(json({ limit: '50mb' }));

  // Set Global Prefix
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
  console.log(`📚 Scalar Docs running on http://localhost:${port}/reference`);
}

bootstrap();
