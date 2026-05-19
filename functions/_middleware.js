export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const segments = url.pathname.split('/');
    const last = segments[segments.length - 1];
    const prev = segments[segments.length - 2];

    if (prev === 'l' && last && last !== '') {
      const code = last;
      const newPath = '/' + segments.slice(1, -2).join('/');
      const dest = new URL(url.origin + (newPath === '//' ? '/' : newPath));
      url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
      dest.searchParams.set('utm_campaign', code);
      return Response.redirect(dest.toString(), 301);
    }
  } catch (e) {
    // fall through on error
  }
  return context.next();
}
