import type { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Body parsers with an explicit size cap. The app must be created with `bodyParser: false`,
 * otherwise Nest registers its own 100kb parsers first and these never see the request.
 */
export function configureHttp(app: NestExpressApplication, bodyLimitBytes: number): void {
  app.useBodyParser('json', { limit: bodyLimitBytes });
  app.useBodyParser('urlencoded', { limit: bodyLimitBytes, extended: true });
}
