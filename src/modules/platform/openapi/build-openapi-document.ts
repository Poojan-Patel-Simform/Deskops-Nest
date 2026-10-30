import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

/** Builds the OpenAPI document from the Nest route metadata. `version` is the published contract version. */
export function buildOpenApiDocument(app: INestApplication, version: string): OpenAPIObject {
  const options = new DocumentBuilder()
    .setTitle('DeskOps API')
    .setDescription('REST API for DeskOps. Errors are RFC 9457 problem details.')
    .setVersion(version)
    .build();
  return SwaggerModule.createDocument(app, options);
}
