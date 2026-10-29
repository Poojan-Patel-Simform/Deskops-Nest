import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    env: {
      DATABASE_URL: 'postgresql://deskops:deskops@localhost:5432/deskops',
      REDIS_URL: 'redis://localhost:6379',
    },
    include: ['**/*.e2e-spec.ts'],
  },
});
