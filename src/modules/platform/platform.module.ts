import { Module } from '@nestjs/common';
import { APP_CONFIG, ConfigService, loadConfig } from './config/index.js';
import { PlatformFacade } from './platform.facade.js';

@Module({
  providers: [
    { provide: APP_CONFIG, useFactory: () => loadConfig() },
    ConfigService,
    PlatformFacade,
  ],
  exports: [PlatformFacade, ConfigService],
})
export class PlatformModule {}
