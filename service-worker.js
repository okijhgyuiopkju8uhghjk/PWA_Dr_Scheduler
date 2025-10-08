const CACHE_NAME = "doctor-duty-scheduler-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles/style.css",
  "./scripts/app.js",
  "./manifest.json"
];

// Install event – cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate new service worker immediately
});

// Activate event – clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // Take control of all pages
});

// Fetch event – serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
