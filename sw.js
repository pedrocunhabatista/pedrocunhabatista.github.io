const CACHE = 'pedro-batista-live-20260912';
const CORE = ['./', './index.html', './pt.html', './styles.css', './journey.css', './app.js', './manifest.webmanifest', './assets/images/icon.svg', './assets/photography/portrait.webp'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('pedro-batista-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 const request = event.request;
 const url = new URL(request.url);
 if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('range') || /\.(mp4|pdf)$/.test(url.pathname)) return;
 event.respondWith(fetch(request).then(response => {
  if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy))); }
  return response;
 }).catch(async () => (await caches.match(request)) || (request.mode === 'navigate' ? await caches.match(url.pathname.endsWith('pt.html') ? './pt.html' : './index.html') : Response.error())));
});
