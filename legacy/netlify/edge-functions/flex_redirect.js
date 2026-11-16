export default async (request, context) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    // Look for a "/l/:code" suffix anywhere in the path
    // e.g., /post/slug/l/rdt.claudecode  →  /post/slug?utm_campaign=rdt.claudecode
    const segments = path.split('/'); // ["", "post", "slug", "l", "code"]
    const last = segments[segments.length - 1];
    const prev = segments[segments.length - 2];
    if (prev === 'l' && last && last !== '') {
      const code = last;
      // New path without the trailing /l/:code
      const newPath = '/' + segments.slice(1, -2).join('/');
      const dest = new URL(url.origin + (newPath === '//' ? '/' : newPath));
      // Preserve existing query params and set utm_campaign
      url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
      dest.searchParams.set('utm_campaign', code);
      return Response.redirect(dest.toString(), 301);
    }
  } catch (e) {
    // fall through on error
  }
  return context.next();
};

