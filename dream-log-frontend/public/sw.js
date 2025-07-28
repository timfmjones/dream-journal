// public/sw.js - Service Worker for offline functionality
const CACHE_NAME = 'dream-log-v1';
const STATIC_CACHE_NAME = 'dream-log-static-v1';
const DYNAMIC_CACHE_NAME = 'dream-log-dynamic-v1';

// Core files to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/dream-log-icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  // Add your built CSS and JS files here after build
  // '/assets/index-[hash].css',
  // '/assets/index-[hash].js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('dream-log-') && 
                   cacheName !== STATIC_CACHE_NAME &&
                   cacheName !== DYNAMIC_CACHE_NAME;
          })
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For external resources, try network first, cache as fallback
    event.respondWith(
      fetch(request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, responseToCache));
          
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // API calls - network first, no cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return a custom offline response for API calls
        return new Response(
          JSON.stringify({ error: 'Offline mode - data may not be current' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // HTML pages - network first, cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => caches.match(request).then(response => {
          return response || caches.match('/index.html');
        }))
    );
    return;
  }

  // For everything else - cache first, network fallback
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        // Update cache in background
        fetch(request).then(fetchResponse => {
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, fetchResponse));
        });
        return response;
      }

      return fetch(request).then(fetchResponse => {
        // Check if valid response
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }

        const responseToCache = fetchResponse.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => cache.put(request, responseToCache));

        return fetchResponse;
      });
    })
  );
});

// Background sync for offline dream saves
self.addEventListener('sync', event => {
  if (event.tag === 'sync-dreams') {
    event.waitUntil(syncDreams());
  }
});

async function syncDreams() {
  // Get dreams from IndexedDB or localStorage
  const pendingDreams = await getPendingDreams();
  
  for (const dream of pendingDreams) {
    try {
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dream.token}`
        },
        body: JSON.stringify(dream.data)
      });
      
      if (response.ok) {
        await removePendingDream(dream.id);
      }
    } catch (error) {
      console.error('Failed to sync dream:', error);
    }
  }
}

// Placeholder functions - implement with IndexedDB
async function getPendingDreams() {
  // TODO: Implement IndexedDB storage
  return [];
}

async function removePendingDream(id) {
  // TODO: Implement IndexedDB removal
}

// Push notifications support
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'Time to record your dreams!',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Dream Log Reminder', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});