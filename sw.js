// DU Law Notes Portal — Progressive Web App Service Worker
const CACHE_NAME = "du-law-portal-v69";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./terms",
  "./privacy",
  "./about",
  "./feedback.html",
  "./tools/bare-acts.html",
  "./tools/bns-converter.html",
  "./tools/flashcards.html",
  "./css/styles.css?v=69.0",
  "./css/notes-responsive.css?v=69.0",
  "./js/wave_grid_background.js?v=69.0",
  "./js/interactive_particles.js?v=69.0",
  "./particles.png",
  "./js/books_showcase.js?v=69.0",
  "./js/data.js?v=69.0",
  "./js/bare_acts.js?v=69.0",
  "./js/bns_converter.js?v=69.0",
  "./js/app.js?v=69.0",
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

  // 2. Main Portal Shell & Clean Routed Pages (Network-First with immediate cache fallback)
  const isMainShell = isHtml && (
    url.pathname === "/" ||
    url.pathname.startsWith("/subject") ||
    url.pathname.startsWith("/semester") ||
    url.pathname.startsWith("/sem") ||
    url.pathname.startsWith("/tools/") ||
    url.pathname === "/terms" ||
    url.pathname === "/terms.html" ||
    url.pathname.endsWith("/terms.html") ||
    url.pathname === "/privacy" ||
    url.pathname === "/privacy.html" ||
    url.pathname.endsWith("/privacy.html") ||
    url.pathname === "/about" ||
    url.pathname === "/about.html" ||
    url.pathname.endsWith("/about.html") ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/feedback.html")
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
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (url.pathname === "/terms" || url.pathname.endsWith("/terms") || url.pathname.endsWith("/terms.html")) {
              return caches.match("./terms") || caches.match("/terms") || caches.match("./terms.html") || caches.match("/terms.html");
            }
            if (url.pathname === "/privacy" || url.pathname.endsWith("/privacy") || url.pathname.endsWith("/privacy.html")) {
              return caches.match("./privacy") || caches.match("/privacy") || caches.match("./privacy.html") || caches.match("/privacy.html");
            }
            if (url.pathname === "/about" || url.pathname.endsWith("/about") || url.pathname.endsWith("/about.html")) {
              return caches.match("./about") || caches.match("/about") || caches.match("./about.html") || caches.match("/about.html");
            }
            return caches.match("./index.html") || caches.match("/index.html");
          });
        })
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
        if (!cachedResponse) {
          return cache.match(event.request, { ignoreSearch: true }).then((fallbackResponse) => {
            const initial = fallbackResponse || null;
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
            }).catch(() => initial);

            return initial || fetchPromise;
          });
        }

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

