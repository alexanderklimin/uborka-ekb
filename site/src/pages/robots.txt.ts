import { SITE_MODE } from '../data/site.js';
// Превью закрыто целиком. В production — открыто, sitemap указан.
export function GET({ site }: { site: URL }) {
  const body = SITE_MODE === 'production'
    ? `User-agent: *\nDisallow:\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
