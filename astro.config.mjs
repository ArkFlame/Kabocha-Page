import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://kabocha.arkflame.com',
  base: process.env.PUBLIC_BASE_PATH || '/',
  output: 'static',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
