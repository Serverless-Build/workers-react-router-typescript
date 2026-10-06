# React Router on Workers

A portable React Router 8 app: request-time SSR, typed loader data, hydrated React, validated route actions, and resource routes on Cloudflare Workers.

## Run and deploy

Use Node.js 22.22 or later. `.node-version` pins the tested Node 24.21.0 build toolchain.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run bundle
npm run start
```

`check` generates types, checks TypeScript, builds, and performs a Wrangler dry run. `bundle` creates the reviewed self-contained upload in `dist/worker-bundle`. `start` runs the production build in a local Workers runtime. Run `npx wrangler login`, choose your account, and use `npm run deploy` to build and deploy.

The Wrangler configuration is portable; Workers Static Assets supplies its `ASSETS` binding. Dependencies, generated types, `.react-router/`, and build output stay out of the published source.

## Try it

- Open `/`. Refresh to see new server loader data and reset the browser counter.
- Submit the quote form. `fetcher.Form` calls the route's real `action`, not a client-side calculator.
- `GET /api/health` checks liveness.
- `GET /api/quote?quantity=3&unit_price_cents=250` returns 750 cents in USD. Quantity is a single integer 1–100; unit price is a single integer 1–1000000. Missing, duplicate, decimal, and out-of-range inputs return 400.
- `/robots.txt` and the generated JS/CSS are served by Static Assets.

The stateless demo permits HTTPS embedding and loopback development through its frame-ancestors policy. Route responses use `no-store`; the Worker streams framework responses. The quote form accepts a bounded URL-encoded body. It does not store application or visitor state on the server.

Based on the [official React Router Workers integration](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/) and its Cloudflare Vite plugin setup.

## Pattern and live demo

- [Pattern page](https://serverless.build/patterns/react-router-workers)
- [Live deployment](https://workers-react-router-typescript.dwarven.workers.dev)
