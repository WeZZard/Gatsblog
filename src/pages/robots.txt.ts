import type { APIRoute } from 'astro';
import { getSiteConfig } from '../lib/config';

export const GET: APIRoute = () => {
  const { site } = getSiteConfig();
  const baseUrl = site.url.replace(/\/$/, '');

  const body = [
    'User-agent: Baiduspider',
    'Disallow: /',
    '',
    'User-agent: Sosospider',
    'Disallow: /',
    '',
    'User-agent: sogou spider',
    'Disallow: /',
    '',
    'User-agent: YodaoBot',
    'Disallow: /',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
