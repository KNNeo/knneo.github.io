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
          // If found in cache, return it
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not cached, fetch from network and cache the response
          return fetch(request)
            .then((response) => {
              // Clone the response for caching
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
              return response;
            });
        })
    );
});