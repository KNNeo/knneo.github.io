const CACHE_NAME_PAGES = 'html-20240429-1';
const CACHE_NAME_RESOURCES = 'script-20240428';
const CACHE_NAME_STATIC = 'default-20240428';
const ALL_CACHES = [];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(Promise.all(
		ALL_CACHES.map(name => caches.open(name))
	).then(function(caches) {
		console.log('Opened cache');
		return caches;
	})
  );
});

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);
  const fileType = url.pathname.split('.').pop();
  // Decide cache based on file extension
  let cacheName = CACHE_NAME_STATIC;
  switch(fileType.toLowerCase()) {
	  case 'html':
		cacheName = CACHE_NAME_PAGES;
		break;
	  case 'css':
	  case 'js':
		cacheName = CACHE_NAME_RESOURCES;
		break;
	  default:
	    cacheName = CACHE_NAME_STATIC;
		break;
  };
  
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
              caches.open(cacheName)
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

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (ALL_CACHES.filter(name => name != cacheName).length < 1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME_STATIC)
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