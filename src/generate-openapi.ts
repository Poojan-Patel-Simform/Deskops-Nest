import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ApiModule } from './api.module.js';
import { buildOpenApiDocument } from './modules/platform/index.js';

/** Writes the OpenAPI document without listening on a port. Usage: `node dist/generate-openapi [outFile]`. */
async function generate() {
  const out = resolve(process.argv[2] ?? 'openapi.json');
  const pkg = JSON.parse(await readFile(resolve('package.json'), 'utf8')) as { version: string };
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    bodyParser: false,
    logger: ['error'],
  });
  const document = buildOpenApiDocument(app, pkg.version);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
  console.log(`Wrote ${out}`);
}
await generate();
