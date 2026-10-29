import { Module } from '@nestjs/common';
import { IdentityFacade } from './identity.facade.js';

@Module({
  providers: [IdentityFacade],
  exports: [IdentityFacade],
})
export class IdentityModule {}
