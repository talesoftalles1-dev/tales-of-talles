/*
 * Service Worker do APEX / TALES OF TALLES · IDENTITY OS.
 *
 * Fonte da lógica: o bloco inline em index.html (busca `swCode`), que só é
 * usado como fallback blob em dev. Em produção (GitHub Pages) o index.html
 * registra ESTE arquivo (`navigator.serviceWorker.register('sw.js')`).
 * Mantenha CACHE em sincronia com SW_VERSION do index.html ao versionar.
 */
const CACHE = 'tot-v5';

self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  // Shell (navegações): network-first com fallback ao cache p/ primeiro load offline.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return r; })
        .catch(() => caches.match(e.request).then((m) => m || caches.match('./')))
    );
    return;
  }
  // Recursos cross-origin: cache-first (fontes, CDNs).
  if (u.origin !== location.origin) {
    e.respondWith(
      caches.match(e.request).then((m) => m || fetch(e.request).then((r) => {
        if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); }
        return r;
      }).catch(() => m))
    );
  }
});
