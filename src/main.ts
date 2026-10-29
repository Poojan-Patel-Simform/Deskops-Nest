import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module.js';
import {
  ConfigError,
  configureHttp,
  loadConfig,
  type AppConfig,
} from './modules/platform/index.js';
import { WorkerModule } from './worker.module.js';

async function bootstrapApi(config: AppConfig) {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, { bodyParser: false });
  configureHttp(app, config.BODY_LIMIT_BYTES);
  app.enableShutdownHooks();
  await app.listen(config.PORT);
}

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
  // Nothing holds the event loop open until queue connections exist; shutdown hooks re-raise the signal to exit.
  setInterval(() => undefined, 2 ** 30);
  new Logger('Worker').log('Worker started');
}

async function bootstrap() {
  // Validate before Nest starts so a bad environment prints a short message, not a DI stack trace.
  let config: AppConfig;
  try {
    config = loadConfig();
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
  if (config.APP_MODE === 'worker') {
    await bootstrapWorker();
  } else {
    await bootstrapApi(config);
  }
}
await bootstrap();
