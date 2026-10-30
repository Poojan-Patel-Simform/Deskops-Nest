import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'node:http';
import { ApiModule } from './../src/api.module.js';
import { configureApiPrefix } from './../src/modules/platform/index.js';

describe('API prefix (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [ApiModule] }).compile();
    app = moduleFixture.createNestApplication();
    configureApiPrefix(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves routes under /v1', async () => {
    await request(app.getHttpServer()).get('/v1').expect(200);
  });

  it('does not serve routes without the prefix', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
