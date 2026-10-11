// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Produkční doména – použije se pro canonical URL, sitemapu a Open Graph.
// Na GitHub Pages ji (spolu s cestou /Technikman) nastaví workflow přes proměnné prostředí.
const SITE = process.env.SITE_URL || 'https://proklepto.cz';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
    format: 'directory',
  },
  vite: {
    build: { chunkSizeWarningLimit: 700 },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(brand|admin|protokol)\//.test(page),
      changefreq: 'monthly',
      priority: 0.7,
      i18n: { defaultLocale: 'cs', locales: { cs: 'cs-CZ' } },
    }),
  ],
});
