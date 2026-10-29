import { envSchema, type AppConfig } from './env.schema.js';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/** Validates the environment; the error lists each bad variable but never echoes its value. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = envSchema.safeParse(env);
  if (result.success) return result.data;

  const lines = result.error.issues.map(
    (issue) =>
      `  - ${issue.path.join('.')}: ${env[issue.path[0] as string] === undefined ? 'is required' : issue.message}`,
  );
  throw new ConfigError(`Invalid environment configuration:\n${lines.join('\n')}`);
}
