import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    message: 'must be a postgres:// or postgresql:// URL',
  }),
  REDIS_URL: z.url({ protocol: /^rediss?$/, message: 'must be a redis:// or rediss:// URL' }),
});

export type AppConfig = z.infer<typeof envSchema>;
