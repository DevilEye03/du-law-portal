// DU Law Notes Portal — Progressive Web App Service Worker
const CACHE_NAME = "du-law-portal-v12";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/wave_grid_background.js",
  "./js/interactive_particles.js",
  "./particles.png",
  "./js/books_showcase.js",
  "./js/data.js",
  "./js/bare_acts.js",
  "./js/bns_converter.js",
  "./js/app.js",
  "./favicon.svg",
  "./manifest.json"
];

// Install Event — Precaching Core Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Precaching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Cleanup Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Network-First for HTML navigation, Cache-First for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const isHtml = event.request.mode === "navigate" || 
    (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html"));

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes("fonts.googleapis.com") ||
           event.request.url.includes("fonts.gstatic.com") ||
           event.request.url.includes("cdnjs.cloudflare.com"))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
