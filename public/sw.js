// Service Worker - Esporte Clube Pelotas PWA
const CACHE_NAME = 'ecpelotas-pwa-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/images/pelotas-logo.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return;
  }
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/ws') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/gestao')
  ) {
    return;
  }

  // Navegação sempre Network-First para nunca servir HTML/chunks antigos
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Apenas assets estáticos de mídia/fonte
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
