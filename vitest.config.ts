import { defineConfig } from 'vitest/config';
// @ts-ignore
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['packages/**/src/**/*.{ts,tsx}'],
      exclude: ['**/test/**', '**/__tests__/**', '**/index.ts', '**/types.ts'],
    },
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@crux/context': path.resolve(__dirname, 'packages/context/src'),
      '@crux/reactivity': path.resolve(__dirname, 'packages/reactivity/src'),
      '@crux/core': path.resolve(__dirname, 'packages/core/src'),
    },
  },
});
