import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppModule } from './app.module.js';
import { AppService } from './app.service.js';

@Module({
  imports: [AppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class ApiModule {}
