import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigError, ConfigService, loadConfig } from './modules/platform/index.js';

async function bootstrap() {
  // Validate before Nest starts so a bad environment prints a short message, not a DI stack trace.
  try {
    loadConfig();
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(app.get(ConfigService).get('PORT'));
}
await bootstrap();
