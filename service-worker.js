//! Now that the browser knows about the service worker (the registartion portion in the index.html),
//! we need to install it, adding files to the precache, so that the application can use the cache.
//! We do this by setting up event listeners

//todo: The service worker is the FIRST CODE THAT RUNS IN THE APPLICATION, even before index.html or any
//todo: other JavaScript file. As long as the browser supports service workers, the service worker will run,
//todo: regardless of whether or not the user is connected to the internet. This means that if the application
//todo: code is updated, the service worker will still load the OLD FILES.


//* define some needed global constants
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//* define which files we want to cache; USE RELATIVE PATHS AS SHOWN
//TODO Note that we didn't include the images in assets. This was intentional. Every browser has a cache limit,
//TODO which can range anywhere from 50 MB to 250 MB. We've prioritized caching the JavaScript and HTML files
//TODO so that the site is at least functional.
const FILES_TO_CACHE = [
   './index.html',
   './events.html',
   './tickets.html',
   './schedule.html',
   './assets/css/style.css',
   './assets/css/bootstrap.css',
   './assets/css/tickets.css',
   './dist/app.bundle.js',
   './dist/events.bundle.js',
   './dist/tickets.bundle.js',
   './dist/schedule.bundle.js',
];

//* service workers run before the window object has even been created. Therefore, instead of using
//* the window object window.eventListener(), we use the self keyword to instantiate listeners on the
//* service worker.The context of self here refers to the service worker object.
//! Service Worker - INSTALLATION
self.addEventListener('install', function (event) {
   //* BROWSER must wait until the work is completed before the service worker is terminated
   event.waitUntil(
      //* open CACHE_NAME
      caches.open(CACHE_NAME).then(function (cache) {
         console.log('installing cache : ' + CACHE_NAME);
         //* return cache with all cached files
         return cache.addAll(FILES_TO_CACHE);
      })
   );
});

//! Service Worker - ACTIVATION
self.addEventListener('activate', function (event) {
   event.waitUntil(
      //* .keys() returns an array of all cache names and we call them keyList
      //* keyList is a parameter that contains all cache names under <username>.github.io.
      //* Because we may host many sites from the same URL, we should filter out caches that have the
      //* app prefix.We'll capture the ones that have that prefix, stored in APP_PREFIX, and save
      //* them to an array called cacheKeeplist using the.filter() method.
      caches.keys().then(function (keyList) {
         let cacheKeepList = keyList.filter(function (key) {
            return key.indexOf(APP_PREFIX);
         });
         //* add the current cache to the keeplist in the activate event listener
         cacheKeepList.push(CACHE_NAME);

         //* returns a Promise that resolves once all old versions of the cache have been deleted
         return Promise.all(
            keyList.map(function (key, i) {
               if (cacheKeepList.indexOf(key) === -1) {
                  console.log('deleting cache : ' + keyList[i]);
                  return caches.delete(keyList[i]);
               }
            })
         );
      })
   );
});

//! Service Worker - WAITING/IDLE (INTERCEPT FETCH REQUESTS)
self.addEventListener('fetch', function (event) {
   console.log('fetch request : ' + event.request.url);
   //* using respondWith to intercept the fetch request
   event.respondWith(
      //* use .match() to determine if the resource already exists in caches. If it does, log the URL to the
      //* console with a message and then return the cached resource
      caches.match(event.request).then(function (request) {
         if (request) {
            console.log('responding with cache : ' + event.request.url);
            return request;
         }
         //* if the resource is not in caches, retrieved resource from the online network as usual
         else {
            console.log('file is not cached, fetching : ' + event.request.url);
            return fetch(event.request);
         }
         
         //! this one line replaces the if/else code above
         //* return request || fetch(e.request);
      })
   );
});


