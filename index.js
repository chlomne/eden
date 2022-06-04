addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

const BUCKET_URL = 'https://yhnhyvjuksphwndbgwtq.supabase.co/storage/v1/object/authenticated/';

async function serveAsset(event) {
  const url = new URL(event.request.url);
  const cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    response = await fetch(`${BUCKET_URL}${url.pathname}`, {
      headers: {
        'Authorization': 'Bearer ' + SUPABASE_TOKEN
      }
    });
    const headers = { 'cache-control': 'public, max-age=14400' };
    response = new Response(response.body, { ...response, headers });
    event.waitUntil(cache.put(event.request, response.clone()));
  }
  return response;
}

async function handleRequest(event) {
  if (event.request.method === 'GET') {
    let response = await serveAsset(event);
    if (response.status > 399) {
      response = new Response(JSON.stringify({ message: response.statusText, code: response.status }), { status: response.status, headers: {
        'Content-Type': 'application/json',
      } });
    }
    return response;
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed', code: 405 }), { status: 405, headers: {
      'Content-Type': 'application/json'
    } });
  }
}