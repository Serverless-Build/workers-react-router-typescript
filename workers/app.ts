import { createRequestHandler, RouterContextProvider } from 'react-router';
import { cloudflareContext } from '../app/cloudflare-context';

const handle = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE);

export default {
  async fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, ctx });
    const pathname = new URL(request.url).pathname;
    // React Router handles OPTIONS before resource routes, so enforce their
    // read-only contract at the Worker entrypoint as well as in route actions.
    const readOnlyApi = pathname === '/api/health' || pathname === '/api/quote';
    const response = readOnlyApi && request.method !== 'GET' && request.method !== 'HEAD'
      ? Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'GET, HEAD' } })
      : await handle(request, context);
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // This stateless reference UI may be embedded by HTTPS catalogs and local development.
    headers.set('Content-Security-Policy', 'frame-ancestors https: http://localhost:* http://127.0.0.1:*');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
} satisfies ExportedHandler<Env>;
