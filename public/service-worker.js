const APP_PREFIX = 'Budget-Tracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "/index.html",
  "/css/styles.css",
  "/js/index.js"
]


//installs the cache and adds necessary files to it
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

//activates the service worker, adds current cache to keep list and removes old versions of the cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      let cacheKeeplist = keyList.filter(function(key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

//intercepts the fetch request with 'respondWith' and checks to see if the request is stored in cache or not
//which determines if the resource will be delivered from the cache, or normally.

self.addEventListener('fetch', function (event) {
  console.log('fetch request : ' + event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (request) {
      if (request) { 
        console.log('responding with cache : ' + event.request.url)
        return request
      } else {       
        console.log('file is not cached, fetching : ' + event.request.url)
        return fetch(event.request)
      }
    })
  )
})