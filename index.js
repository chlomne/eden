addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

const BUCKET_URL = 'https://yhnhyvjuksphwndbgwtq.supabase.co/storage/v1/object/public';
const DISCORD_UA = 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)';

/**
 * @param {string} image 
 * @param {string} path
 */
const HTML = (image, path) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="theme-color" content="#fff1f2">
    <meta property="og:title" content="Chloe's Image Host">
    <meta property="og:description" content="${path.replace(/\/-\//, '').trim()}">
    <meta content="${image}" property="og:image">
    <meta property="twitter:card" content="summary_large_image">
  </head>
</html>`.trim();

async function serveAsset(event) {
  const userAgent = event.request.headers.get('User-Agent');
  const url = new URL(event.request.url);
  const cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    const headers = { 'cache-control': 'public, max-age=14400', 'content-type': 'text/html' };
    if (userAgent === DISCORD_UA) {
      response = new Response(HTML(`${BUCKET_URL}${url.pathname}`, url.pathname), { ...response, headers });
    } else {
      response = await fetch(`${BUCKET_URL}${url.pathname}`);
    }
    event.waitUntil(cache.put(event.request, response.clone()));
  }
  return response;
}

/**
 * 
 * @param {Event} event 
 * @returns 
 */
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