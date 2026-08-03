// Minimal service worker so the app qualifies as installable.
// It doesn't cache aggressively — this app depends on live network for
// MediaPipe models and Supabase, so offline mode isn't practical.
// This just satisfies the PWA install requirements.

const CACHE_NAME = 'tennis-coach-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // network-first for everything, since content changes and we need live APIs
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
