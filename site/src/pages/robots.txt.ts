import { getSiteUrl } from '../../domain.config.mjs';

export function GET() {
  const sitemap = `${getSiteUrl()}/sitemap-index.xml`;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
