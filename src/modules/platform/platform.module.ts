import { APP_FILTER } from '@nestjs/core';
import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { APP_CONFIG, ConfigService, loadConfig } from './config/index.js';
import { PlatformFacade } from './platform.facade.js';
import { ProblemDetailsFilter } from './problem-details/index.js';
import { RequestContextMiddleware, RequestContextService } from './request-context/index.js';

@Module({
  providers: [
    { provide: APP_CONFIG, useFactory: () => loadConfig() },
    ConfigService,
    RequestContextService,
    PlatformFacade,
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
  exports: [PlatformFacade, ConfigService, RequestContextService],
})
export class PlatformModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('{*path}');
  }
}
