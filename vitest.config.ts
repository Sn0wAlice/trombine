import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Tests run against core sources, no build needed.
  resolve: { alias: { '@trombine/core': fileURLToPath(new URL('packages/core/src/index.ts', import.meta.url)) } },
});
