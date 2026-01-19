import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  trailingSlash: 'ignore',

  integrations: [
    tailwind(),
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
