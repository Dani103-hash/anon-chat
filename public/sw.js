
const CACHE_NAME = 'anonchat-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push notification event
self.addEventListener('push', function(event) {
  if (event.data) {
    const notificationData = event.data.json();
    
    const options = {
      body: notificationData.body,
      icon: '/lovable-uploads/icon-192x192.png',
      badge: '/lovable-uploads/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: notificationData.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Message',
          icon: '/lovable-uploads/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/lovable-uploads/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
