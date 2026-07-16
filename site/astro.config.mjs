import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {
  getAstroSite,
  getAstroBase,
  getSiteUrl,
  customDomain,
  getDeployTarget,
} from './domain.config.mjs';

const site = getAstroSite();
const base = getAstroBase();

console.log(`[astro] deployTarget=${getDeployTarget()} site=${site} base=${base}`);

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  vite: {
    define: {
      __CUSTOM_DOMAIN__: JSON.stringify(customDomain || ''),
      __PUBLIC_SITE_URL__: JSON.stringify(getSiteUrl()),
    },
  },
});
