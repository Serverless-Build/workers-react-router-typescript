import { useState } from 'react';
import { data, useFetcher } from 'react-router';
import { calculateQuote, readQuoteForm } from '../quote';
import type { Route } from './+types/home';

export function loader() { return { renderedAt: new Date().toISOString(), runtime: 'Cloudflare Workers' }; }

export async function action({ request }: Route.ActionArgs) {
  const result = calculateQuote(await readQuoteForm(request));
  return data(result, { status: 'error' in result ? 400 : 200 });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [count, setCount] = useState(0);
  const fetcher = useFetcher<typeof action>();
  return <main>
    <header><span className="badge">React Router · Cloudflare Workers</span><h1>Routes. Forms.<br /><em>Rendered at the edge.</em></h1><p className="intro">A full-stack React app with request-time loader data, browser hydration, and a real server action.</p></header>
    <div className="grid">
      <section><span className="step">01 / Request-time SSR</span><h2>Your loader ran on a Worker.</h2><p>Refresh for a fresh timestamp. This value is generated on the server, before browser JavaScript runs.</p><time dateTime={loaderData.renderedAt}>{loaderData.renderedAt}</time><p className="muted">{loaderData.runtime} · no-store</p></section>
      <section><span className="step">02 / Hydrated React</span><h2>A little client-side state.</h2><p>Each browser starts with its own counter. Refreshing resets it.</p><button type="button" onClick={() => setCount(count + 1)}>Count: {count}</button></section>
      <section className="wide"><span className="step">03 / React Router action</span><h2>Let the server calculate.</h2><p>A typed route action validates the submitted form and returns a quote. Try changing the values.</p>
        <fetcher.Form method="post"><label>Quantity<input name="quantity" type="number" min="1" max="100" step="1" defaultValue="3" required /></label><label>Unit price (cents)<input name="unit_price_cents" type="number" min="1" max="1000000" step="1" defaultValue="250" required /></label><button disabled={fetcher.state !== 'idle'}>{fetcher.state === 'idle' ? 'Calculate a quote' : 'Calculating…'}</button></fetcher.Form>
        <output id="result" aria-live="polite">{fetcher.data ? 'error' in fetcher.data ? fetcher.data.error : `${fetcher.data.total_cents} cents · ${fetcher.data.currency}` : 'Your server-calculated quote will appear here.'}</output>
      </section>
    </div><footer>React Router loaders + actions · Workers Static Assets · <a href="/api/health">Health</a> · <a href="/api/quote?quantity=3&unit_price_cents=250">JSON API</a></footer>
  </main>;
}
