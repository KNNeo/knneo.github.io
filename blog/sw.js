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

self.addEventListener('sync', function(event) {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.keys().then((keys) => {
            return Promise.all(
              keys.map((key) => {
                // Check if the key represents an image resource (e.g., using URL or extension)
                if (isImageResource(key)) {
                  return fetch(key) // Fetch the image from the network
                    .then((response) => {
                      if (response.ok) {
                        // Update cache with the new response
                        return cache.put(key, response.clone());
                      }
                    });
                }
                return null; // Skip non-image resources
              })
            );
          });
        })
    );
  }
});

function isImageResource(key) {
  // as long as it's static image, won't catch loaded image files ie. must end with extension
  return /\.(png|jpg|jpeg|gif)$/.test(key.url);
}