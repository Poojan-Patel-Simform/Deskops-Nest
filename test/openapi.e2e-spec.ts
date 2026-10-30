import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApiModule } from './../src/api.module.js';
import { buildOpenApiDocument } from './../src/modules/platform/index.js';

describe('OpenAPI document (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [ApiModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('describes the app routes with the given version', () => {
    const doc = buildOpenApiDocument(app, '1.2.3');
    expect(doc.openapi).toMatch(/^3\./);
    expect(doc.info).toMatchObject({ title: 'DeskOps API', version: '1.2.3' });
    expect(doc.paths['/']?.get).toBeDefined();
  });
});
