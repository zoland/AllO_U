// Service Worker для AllO_I
const CACHE_NAME = 'allo-i-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './research.js',
  './manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Обработка fetch запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Обработка уведомлений
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Открываем приложение при клике на уведомление
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./');
    })
  );
});
