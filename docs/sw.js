const CACHE_NAME = "australia-brief-v13";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./favicon-16.png",
  "./favicon-32.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./news.json",
  "./news.zh-Hans.json",
  "./news.zh-Hant.json",
  "./news.si.json",
  "./news.en.json",
  "./news.es.json",
  "./news.ja.json",
  "./news.ko.json",
  "./news.vi.json",
  "./news.th.json",
  "./social-trends.en.json",
  "./social-trends.zh-Hans.json",
  "./social-trends.zh-Hant.json",
  "./social-trends.si.json",
  "./social-trends.es.json",
  "./social-trends.ja.json",
  "./social-trends.ko.json",
  "./social-trends.vi.json",
  "./social-trends.th.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isNewsData = /\/news(\.[A-Za-z-]+)?\.json$/.test(url.pathname);
  const isSocialTrendData = /\/social-trends(\.[A-Za-z-]+)?\.json$/.test(url.pathname);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy.clone());
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  if (isNewsData || isSocialTrendData) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(isNewsData ? "./news.json" : "./social-trends.en.json")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
