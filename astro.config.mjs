import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';

export default defineConfig({
  site: 'https://belgotours.com',

  output: 'static',
  trailingSlash: 'ignore',

  adapter: netlify(),

  integrations: [
    tailwind(),
    sitemap()
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});