import { Body, Controller, Module, Post } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'node:http';
import { z } from 'zod';
import { ApiModule } from './../src/api.module.js';
import {
  ZodValidationPipe,
  configureApiPrefix,
  configureHttp,
} from './../src/modules/platform/index.js';

const createThing = z.object({ name: z.string().min(1) });

@Controller('things')
class ThingsController {
  @Post()
  create(@Body(new ZodValidationPipe(createThing)) body: z.infer<typeof createThing>) {
    return body;
  }
}

@Module({ imports: [ApiModule], controllers: [ThingsController] })
class TestModule {}

describe('Validation and body limits (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [TestModule] }).compile();
    const nest = moduleFixture.createNestApplication<NestExpressApplication>({ bodyParser: false });
    configureApiPrefix(nest);
    configureHttp(nest, 1024);
    app = nest;
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts a valid body', async () => {
    const res = await request(app.getHttpServer()).post('/v1/things').send({ name: 'desk' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ name: 'desk' });
  });

  it('returns 400 problem details listing validation errors', async () => {
    const res = await request(app.getHttpServer()).post('/v1/things').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/^application\/problem\+json/);
    expect((res.body as { errors: string[] }).errors).toEqual([expect.stringMatching(/^name: /)]);
  });

  it('returns 413 problem details when the body exceeds the limit', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/things')
      .send({ name: 'x'.repeat(2000) });
    expect(res.status).toBe(413);
    expect(res.headers['content-type']).toMatch(/^application\/problem\+json/);
    expect(res.body).toMatchObject({ status: 413, title: 'Payload Too Large' });
  });

  it('returns 400 problem details for malformed JSON', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/things')
      .set('content-type', 'application/json')
      .send('{"name":');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/^application\/problem\+json/);
  });
});
