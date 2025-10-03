// sw.js
const CACHE_NAME = 'allo-cache-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/utils/Constants.js',
  './js/models/Scene.js',
  './js/models/Participant.js',
  './js/models/Event.js',
  './js/models/Profile.js',
  './js/services/StorageService.js',
  './js/services/TestDataService.js',
  './js/services/ImageService.js',
  './js/views/ScenesView.js',
  './js/views/TeamView.js',
  './js/views/EventsView.js',
  './js/views/LocatorView.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cached => cached || fetch(event.request))
  );
});