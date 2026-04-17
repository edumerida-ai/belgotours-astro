import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/app/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/app')) return next();

  if (pathname === '/app/login') {
    const response = await next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  const token = context.cookies.get('bt_session')?.value;

  if (!token) {
    return context.redirect('/app/login?r=no_session');
  }

  const user = await verifySessionToken(token);

  if (!user) {
    context.cookies.delete('bt_session', { path: '/' });
    return context.redirect('/app/login?r=invalid');
  }

  context.locals.user = user;

  const response = await next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
});
