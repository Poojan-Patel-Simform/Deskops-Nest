import { Module } from '@nestjs/common';
import { IdentityModule } from './modules/identity/index.js';
import { PlatformModule } from './modules/platform/index.js';
import { TenancyModule } from './modules/tenancy/index.js';

@Module({
  imports: [IdentityModule, TenancyModule, PlatformModule],
})
export class AppModule {}
