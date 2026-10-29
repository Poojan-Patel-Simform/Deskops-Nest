import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { IdentityModule } from './modules/identity/index.js';
import { PlatformModule } from './modules/platform/index.js';
import { TenancyModule } from './modules/tenancy/index.js';

@Module({
  imports: [IdentityModule, TenancyModule, PlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
