import { Module } from '@nestjs/common';
import { PlatformFacade } from './platform.facade.js';

@Module({
  providers: [PlatformFacade],
  exports: [PlatformFacade],
})
export class PlatformModule {}
