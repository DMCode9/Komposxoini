const CACHE_NAME = 'komposxoini-v2';
const ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './audio/cadel1.mp3',
  './audio/efraim_arizonitis.mp3',
  './audio/efraim_katounakiotis.mp3',
  './audio/paisios.mp3',
  './audio/porfirios.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((url) => {
          return fetch(new Request(url, { cache: 'no-cache' })).then((response) => {
            if (!response.ok) {
              throw new Error('Fetch failed for ' + url);
            }
            return cache.put(url, response);
          });
        })
      );
    })
  );
  // Removed self.skipWaiting() to allow user-controlled update
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
