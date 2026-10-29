import { Module } from '@nestjs/common';
import { TenancyFacade } from './tenancy.facade.js';

@Module({
  providers: [TenancyFacade],
  exports: [TenancyFacade],
})
export class TenancyModule {}
