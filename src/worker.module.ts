import { Module } from '@nestjs/common';
import { AppModule } from './app.module.js';

// Processors and schedulers register here as they are added.
@Module({
  imports: [AppModule],
})
export class WorkerModule {}
