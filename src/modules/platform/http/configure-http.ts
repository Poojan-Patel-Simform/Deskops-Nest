import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { API_PREFIX } from './http.constants.js';

/** Mounts every route under `/v1`. Call it on the real app, the OpenAPI generator and e2e apps alike. */
export function configureApiPrefix(app: INestApplication): void {
  app.setGlobalPrefix(API_PREFIX);
}

/**
 * Body parsers with an explicit size cap. The app must be created with `bodyParser: false`,
 * otherwise Nest registers its own 100kb parsers first and these never see the request.
 */
export function configureHttp(app: NestExpressApplication, bodyLimitBytes: number): void {
  app.useBodyParser('json', { limit: bodyLimitBytes });
  app.useBodyParser('urlencoded', { limit: bodyLimitBytes, extended: true });
}
