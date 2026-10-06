import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('api/health', 'routes/health.ts'),
  route('api/quote', 'routes/quote.ts'),
] satisfies RouteConfig;
