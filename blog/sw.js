const CACHE_NAME = 'klassic-note-web-reports-v1';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(['/']);
      })
  );
});

self.addEventListener('fetch', function(event) {
  const request = event.request;
  event.respondWith(
    caches.match(request) // Try to serve from cache first
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Not found in cache, check online status
        if (navigator.onLine) {
          // Online, fetch from network and potentially cache for future use
          return fetch(request)
            .then((response) => {
              // Clone the response for caching
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
              return response;
            });
        } else {
          // Offline, return a fallback UI or error message (optional)
          return new Response('Content not available offline', {
            status: 404,
            statusText: 'Not Found',
          });
        }
      })
  );
});
