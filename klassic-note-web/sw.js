// Caches, in decreasing order of update frequency
const CACHE_DB = 'klassicnote-db-20240728';
const CACHE_CONTENT = 'klassicnote-web-20240519';
const CACHE_RESOURCES = 'klassicnote-static-20240701';
const ALL_CACHES = [ CACHE_DB, CACHE_CONTENT, CACHE_RESOURCES ];

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
  // Perform fetch of any url in application
  const request = event.request;
  event.respondWith(
    checkCaches(request)
      .then((cachedResponse) => {
		// Try to find in cache
		if (cachedResponse) {
		  return cachedResponse;
		}
        // Check online status
        if (navigator.onLine) {
		  // Decide cache based on Accept header
		  let cacheName = CACHE_RESOURCES;
		  if (request.headers.get('Accept').includes('text/html') || request.headers.get('Accept').includes('text/css') || request.url.endsWith('.js'))
			cacheName = CACHE_CONTENT;
		  if (request.url.includes('.db'))
			cacheName = CACHE_DB;
          // Online, fetch from network and potentially cache for future use
          return fetch(request)
            .then((response) => {
              // Clone the response for caching
              const responseClone = response.clone();		
			  // Open cache and add response
              caches.open(cacheName)
                .then((cache) => cache.put(request, responseClone));
              return response;
            });
        } else {
          // Offline but not in cache, return a fallback UI or error message (optional)
          return new Response('Content not available offline', {
            status: 404,
            statusText: 'Not Found',
          });
        }
      })
  );
});

self.addEventListener('activate', (event) => {
  // Perform delete of cache if name does not exist
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (ALL_CACHES.filter(name => name == cacheName).length < 1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('sync', function(event) {
  // Perform update of static images (subject to browser implementation)
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME_STATIC)
        .then((cache) => {
          return cache.keys().then((keys) => {
            return Promise.all(
              keys.map((key) => {
                // Check if the key represents an image resource
                if (isImageResource(key)) {
				  // If is image, fetch from network
                  return fetch(key) 
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

async function checkCaches(request) {
  for (const cacheName of ALL_CACHES) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  return null; // No match found in desired caches
}

function isImageResource(key) {
  // As long as it's static image, won't catch loaded image files ie. must end with extension
  return /\.(png|jpg|jpeg|gif)$/.test(key.url);
}
