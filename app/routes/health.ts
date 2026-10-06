export function loader() {
  return Response.json({ ok: true, framework: 'React Router', marker: 'SERVERLESS_BUILD_REACT_ROUTER_TYPESCRIPT_V1' }, { headers: { 'Cache-Control': 'no-store' } });
}

export function action() { return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'GET, HEAD' } }); }
