const CACHE_NAME = "doctor-duty-scheduler-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles/style.css",
  "./scripts/app.js",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
