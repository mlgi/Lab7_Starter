// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

// Once the service worker has been installed, feed it some initial URLs to cache
const urlsToCache =[
  '/',
  '/assets/styles/main.css',
  '/index.html',
  '/favicon.ico',
  '/assets/scripts/main.js',
  '/assets/scripts/Router.js',
  '/assets/components/RecipeCard.js',
  '/assets/components/RecipeExpand.js',
  '/assets/images/icons/0-star.svg',
  '/assets/images/icons/1-star.svg',
  '/assets/images/icons/2-star.svg',
  '/assets/images/icons/3-star.svg',
  '/assets/images/icons/4-star.svg',
  '/assets/images/icons/5-star.svg',
  '/assets/images/icons/arrow-down.png'
]
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache)=>{
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((err)=>console.log(err))
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  event.respondWith(
    caches.match(event.request)
      .then((response)=>{
        // check if found in cache
        if (response) {
          return response;
        }

        // otherwise we attempt to fetch
        return fetch(event.request)
          .then((response)=>{
            // check validity
            if (!response || response.status !== 200) {
              // invalid, let whatever fetched deal with it
              return response;
            }

            // is valid: clone, cache, and return

            // clone
            let responseClone = response.clone();
            // cache the clone
            caches.open(CACHE_NAME)
              .then((cache)=> {
                cache.put(event.request, responseClone);
              })
              .catch(err=>console.log(err))

            // return the original response
            return response;
          });
      })
  );
});