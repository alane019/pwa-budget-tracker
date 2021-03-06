const FILES_TO_CACHE = [
  "/",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/db.js",
  "/index.html",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
];

//CACHE_NAME stores static files
const CACHE_NAME = "static-cache-v2";
//DATA_CACHE_NAME stores data returned with server responses
const DATA_CACHE_NAME = "data-cache-v1";

// self event listener "install"
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//self event listener "activate"
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// self add event listener "fetch"
self.addEventLlistener("fetch", function (evt) {
  // successful requests are cached to API
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      //open cache
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              //if response is OK, clone it and store in cache
              if (response.status === 200) {
                console.log("response was OK");
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch((err) => {
              //Network request failed
              // Try to get requested resource from cache instead
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );
    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      });
    })
  );
});
