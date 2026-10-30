import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { ApiModule } from './../src/api.module.js';
import { configureApiPrefix } from './../src/modules/platform/index.js';

describe('Problem details (e2e)', () => {
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

  it('returns RFC 9457 problem details carrying the request ID on an unknown route', async () => {
    const res = await request(app.getHttpServer()).get('/v1/nope').set('x-request-id', 'trace-7');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/^application\/problem\+json/);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      instance: '/v1/nope',
      requestId: 'trace-7',
    });
  });
});
