// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hosted on GitHub Pages under a project path. When the site moves to its own
// domain (cfa1600.com), change `site` to that domain and remove `base`;
// internal links go through `withBase()` in src/lib/paths.ts, so nothing
// else needs to change.
export default defineConfig({
  site: 'https://abdulazizhhalabi.github.io',
  base: '/cfa1600',
  integrations: [react(), sitemap()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
