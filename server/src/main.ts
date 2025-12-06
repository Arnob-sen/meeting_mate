import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as dotenv from 'dotenv';
import express, { json } from 'express';
import { AppModule } from './app.module';

// Load environment variables from .env file
dotenv.config();

/**
 * A shared function to configure the NestJS application instance.
 * This ensures that both local development and serverless environments
 * have the exact same setup, preventing inconsistencies.
 * @param app The INestApplication instance.
 */
function configureApp(app: INestApplication) {
  // CORS Configuration
  const allowedOrigins = ['http://localhost:3000'].filter(Boolean);

  if (allowedOrigins.length > 0) {
    app.enableCors({
      origin: allowedOrigins,
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
  } else {
    // Fallback for development if .env is not set up, allowing any origin.
    console.warn(
      'CORS origins not defined in .env, allowing all origins.',
      'Bootstrap',
    );
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
  }

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
}

// --- Local Development Bootstrap ---
async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule);

  // Apply all configurations using the single, shared function
  configureApp(app);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
  console.log(`📚 Scalar Docs running on http://localhost:${port}/reference`);
}

// --- Vercel Serverless Function ---
const server = express();
let nestApp: INestApplication;

async function createNestAppForVercel() {
  if (!nestApp) {
    nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server));
    // Apply all configurations using the single, shared function
    configureApp(nestApp);
    await nestApp.init();
  }
  return nestApp;
}

export default async (req: express.Request, res: express.Response) => {
  await createNestAppForVercel();
  server(req, res);
};

// --- Entry Point ---
// This ensures that the local server only runs when you execute `node main.js`
// and not when it's imported by another file (like Vercel's runtime).
if (require.main === module) {
  void bootstrapLocal();
}
