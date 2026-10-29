import { ConfigError, loadConfig } from './load-config.js';

const valid = {
  DATABASE_URL: 'postgresql://deskops:secret@localhost:5432/deskops',
  REDIS_URL: 'redis://localhost:6379',
};

describe('loadConfig', () => {
  it('returns typed config with defaults', () => {
    expect(loadConfig(valid)).toEqual({
      ...valid,
      NODE_ENV: 'development',
      APP_MODE: 'api',
      PORT: 3000,
      BODY_LIMIT_BYTES: 102_400,
    });
  });

  it('coerces PORT to a number', () => {
    expect(loadConfig({ ...valid, PORT: '4000' }).PORT).toBe(4000);
  });

  it('accepts worker mode and rejects unknown modes', () => {
    expect(loadConfig({ ...valid, APP_MODE: 'worker' }).APP_MODE).toBe('worker');
    expect(() => loadConfig({ ...valid, APP_MODE: 'foo' })).toThrow(/APP_MODE/);
  });

  it('names a missing variable', () => {
    expect(() => loadConfig({ REDIS_URL: valid.REDIS_URL })).toThrow(/DATABASE_URL: is required/);
  });

  it('lists every invalid variable', () => {
    const run = () => loadConfig({ DATABASE_URL: 'mysql://x/y', REDIS_URL: 'nope', PORT: '99999' });
    expect(run).toThrow(ConfigError);
    expect(run).toThrow(/DATABASE_URL[\s\S]*REDIS_URL[\s\S]*PORT|PORT[\s\S]*DATABASE_URL/);
  });

  it('never echoes values', () => {
    expect(() =>
      loadConfig({ ...valid, DATABASE_URL: 'mysql://user:hunter2@host/db' }),
    ).not.toThrow(/hunter2/);
  });
});
