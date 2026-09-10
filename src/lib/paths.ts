/**
 * Prefix a root-relative path ("/topics/economics") with the site's base path
 * from astro.config.mjs, so links work both under a sub-path on GitHub Pages
 * and at the root of a custom domain.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
