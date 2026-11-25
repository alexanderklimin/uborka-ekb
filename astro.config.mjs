import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_MODE=production — боевая сборка для Yandex Cloud; всё остальное — превью (noindex, Disallow).
const production = process.env.SITE_MODE === 'production';
const SITE_URL = process.env.SITE_URL || 'https://pribrali.ru';
const UPDATED = '2026-11-25';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always', format: 'directory' },
  integrations: production
    ? [sitemap({ filter: (page) => !page.includes('/404'), serialize: (item) => ({ ...item, lastmod: UPDATED }) })]
    : [],
});
