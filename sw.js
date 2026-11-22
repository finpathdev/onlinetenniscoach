/* App shell cache. HTML, CSS, and JS are network-first so a refresh
   picks up a new deploy. The cache is only the offline fallback.
   Cross-origin pose models are cached after the first successful load.
   Supabase is never cached. */

const CACHE_NAME = "tennis-coach-v3";
const SHELL = [
  "./",
  "./index.html",
  "./app.html",
  "./theme.css",
  "./bg.js",
  "./pwa.js",
  "./coach.js",
  "./manifest.json",
  "./logo-180.png",
  "./logo-192.png",
  "./logo-512.png",
  "./fonts/outfit-400.woff2",
  "./fonts/outfit-500.woff2",
  "./fonts/outfit-700.woff2",
  "./fonts/outfit-800.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "skip-waiting") self.skipWaiting();
});

function isModel(url) {
  return url.hostname === "cdn.jsdelivr.net" || url.hostname === "storage.googleapis.com";
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.hostname.endsWith("supabase.co")) return;

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (isModel(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      return (await caches.match("./app.html")) || (await caches.match("./index.html"));
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);
  const fetching = fetch(request).then((response) => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetching;
}
