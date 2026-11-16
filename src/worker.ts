import type { ExportedHandler, Fetcher } from '@cloudflare/workers-types';

interface Env {
  ASSETS: Fetcher;
}

/**
 * Cloudflare Worker entrypoint:
 * Replicates legacy short-link redirect middleware (`/l/:code` and nested `/.../l/:code`)
 * and delegates all other requests to Cloudflare Workers Static Assets.
 */
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const segments = url.pathname.split('/');
      const last = segments[segments.length - 1];
      const prev = segments[segments.length - 2];

      if (prev === 'l' && last && last !== '') {
        const code = last;
        const newPath = '/' + segments.slice(1, -2).join('/');
        const dest = new URL(url.origin + (newPath === '//' ? '/' : newPath));
        url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
        dest.searchParams.set('utm_campaign', code);
        return Response.redirect(dest.toString(), 301) as unknown as ReturnType<Fetcher['fetch']>;
      }
    } catch {
      // Fall through to static assets on URL parse error.
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
