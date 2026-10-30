import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { ApiModule } from './../src/api.module.js';
import { configureApiPrefix } from './../src/modules/platform/index.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApiPrefix(app);
    await app.init();
  });

  it('/v1 (GET)', () => {
    return request(app.getHttpServer()).get('/v1').expect(200).expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
