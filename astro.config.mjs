// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Produkční doména – použije se pro canonical URL, sitemapu a Open Graph.
const SITE = 'https://proklepto.cz';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/brand/'),
      changefreq: 'monthly',
      priority: 0.7,
      i18n: { defaultLocale: 'cs', locales: { cs: 'cs-CZ' } },
    }),
  ],
});
