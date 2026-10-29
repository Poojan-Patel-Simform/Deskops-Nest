import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { ApiModule } from './../src/api.module.js';

describe('Request context (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [ApiModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('echoes a supplied x-request-id', async () => {
    const res = await request(app.getHttpServer()).get('/').set('x-request-id', 'trace-42');
    expect(res.headers['x-request-id']).toBe('trace-42');
  });

  it('generates an x-request-id when none is supplied', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });
});
