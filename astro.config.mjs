import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import path from 'node:path';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'hybrid',
  trailingSlash: 'ignore',

  adapter: netlify(),

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
