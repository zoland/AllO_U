// sw.js
const CACHE_NAME = 'allo-g-v1.2.0';
const urlsToCache = [
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
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});