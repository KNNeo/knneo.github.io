const CACHE_NAME = 'klassic-note-web-reports-v1';
const cacheUrls = getCacheUrls();

function getCacheUrls() {
	let list = ['/'];	
	// all header assets
	list.push(Array.from(document.querySelectorAll('link,script')).map(l => l.href));	
	// all images
	list.push(Array.from(document.querySelectorAll('img')).map(i => i.src));	
	return list;
}

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(cacheUrls);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
	caches.match(event.request)
	  .then(function(response) {
		// Cache hit - return response
		if (response) {
		  return response;
		}

		// Clone the request
		var fetchRequest = event.request.clone();

		return fetch(fetchRequest).then(
		  function(response) {
			// Check if we received a valid response
			if(!response ||
			   response.status !== 200 ||
			   response.type !== 'basic'
			) {
			  return response;
			}

			// Clone the response
			var responseToCache = response.clone();

			caches.open(CACHE_NAME)
			  .then(function(cache) {
				cache.put(event.request, responseToCache);
			  });

			return response;
		  }
		);
	  })
  );
});
