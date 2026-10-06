import { calculateQuote } from '../quote';
import type { Route } from './+types/quote';

export function loader({ request }: Route.LoaderArgs) {
  const result = calculateQuote(new URL(request.url).searchParams);
  return Response.json(result, { status: 'error' in result ? 400 : 200, headers: { 'Cache-Control': 'no-store' } });
}

export function action() { return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'GET, HEAD' } }); }
