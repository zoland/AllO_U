const CACHE_NAME = 'allo-u-v1';
const urlsToCache = [
    '/AllO_U/',
    '/AllO_U/index.html',
    '/AllO_U/css/style.css',
    '/AllO_U/js/app.js',
    '/AllO_U/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});