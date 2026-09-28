// DU Law Notes Portal — Progressive Web App Service Worker
const CACHE_NAME = "du-law-portal-v40";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./terms.html",
  "./privacy.html",
  "./css/styles.css",
  "./css/notes-responsive.css",
  "./js/wave_grid_background.js",
  "./js/interactive_particles.js",
  "./particles.png",
  "./js/books_showcase.js",
  "./js/bare_acts.js",
  "./js/bns_converter.js",
  "./js/app.js",
  "./favicon.svg",
  "./manifest.json"
];

// Install Event — Precaching Core Shell (excluding heavy dynamic data)
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

// Fetch Event — High-Performance Hybrid Caching Strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 1. Never cache sw.js itself
  if (url.pathname.endsWith("/sw.js")) {
    return;
  }

  const isHtml = event.request.mode === "navigate" || 
    (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html"));

  // 2. Main Portal Shell (Network-First with immediate cache fallback)
  const isMainShell = isHtml && (
    url.pathname === "/" ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/terms.html") ||
    url.pathname.endsWith("/privacy.html")
  );

  if (isMainShell) {
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

  // 3. Subject Notes & Dossier HTML (Stale-While-Revalidate for instant 0.01s reader opening)
  if (isHtml) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          // Return instant cached copy if available, else wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 4. Static Assets (JS, CSS, Images, Fonts, Data) — Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" ||
             url.hostname.includes("fonts.googleapis.com") ||
             url.hostname.includes("fonts.gstatic.com") ||
             url.hostname.includes("cdnjs.cloudflare.com"))
          ) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});

