import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://flowerwithwind.github.io',
  base: '/personal-dev-website',
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
