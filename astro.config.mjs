// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hosted on GitHub Pages at the custom domain below (public/CNAME keeps the
// domain attached across deploys). Internal links go through `withBase()` in
// src/lib/paths.ts, so a future base path change touches only this file.
export default defineConfig({
  site: 'https://charter1900.com',
  integrations: [react(), sitemap()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
