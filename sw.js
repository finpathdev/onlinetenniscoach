/* App shell cache. HTML, CSS, and JS are network-first so a refresh
   picks up a new deploy. The cache is only the offline fallback.
   Cross-origin pose models are cached after the first successful load.
   Supabase is never cached. */

const CACHE_NAME = "tennis-coach-v7";
const SHELL = [
  "./",
  "./index.html",
  "./app.html",
  "./theme.css",
  "./bg.js",
  "./pwa.js",
  "./coach.js",
  "./manifest.json",
  "./docs/analyze.png",
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => /^tennis-coach-v\d+$/.test(key) && key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "skip-waiting") self.skipWaiting();
});

function isModel(url) {
  return (url.hostname === "cdn.jsdelivr.net" && url.pathname.startsWith("/npm/@mediapipe/tasks-vision@")) ||
    (url.hostname === "storage.googleapis.com" && url.pathname.startsWith("/mediapipe-models/pose_landmarker/"));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.hostname.endsWith("supabase.co")) return;

  if (url.origin === self.location.origin && url.href.startsWith(self.registration.scope)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (isModel(url)) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      return (await cache.match("./app.html")) || (await cache.match("./index.html"));
    }
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone()).catch(() => {});
  return response;
}
