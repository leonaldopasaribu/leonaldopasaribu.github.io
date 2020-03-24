importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log('Workbox telah berhasil');
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/pages/home.html', revision: '1' },
    { url: '/pages/team.html', revision: '1' },
    { url: '/pages/team-favorite.html', revision: '1' },
    { url: '/css/materialize.css', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/date.js', revision: '1' },
    { url: '/js/favorite.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/init.js', revision: '1' },
    { url: '/js/materialize.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/assets/img/star.png', revision: '1' },
    { url: '/assets/img/icons/icon-72x72.png', revision: '1' },
    { url: '/assets/img/icons/icon-96x96.png', revision: '1' },
    { url: '/assets/img/icons/icon-128x128.png', revision: '1' },
    { url: '/assets/img/icons/icon-144x144.png', revision: '1' },
    { url: '/assets/img/icons/icon-152x152.png', revision: '1' },
    { url: '/assets/img/icons/icon-192x192.png', revision: '1' },
    { url: '/assets/img/icons/icon-384x384.png', revision: '1' },
    { url: '/assets/img/icons/icon-512x512.png', revision: '1' },
  ], {
    ignoreUrlParametersMatching: [/.*/]
  });

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/assets/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'assets'
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'endpoint_api'
    })
  );

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          //30 hari
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /\.(?:css)$/,
    workbox.strategies.cacheFirst({
      cacheName: "css",
      plugin: [
        new workbox.expiration.Plugin({
          maxEtries: 20,
          //30 hari
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    /\.(?:js)$/,
    workbox.strategies.cacheFirst({
      cacheName: "js",
      plugin: [
        new workbox.expiration.Plugin({
          maxEtries: 20,
          //30 hari
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );

} else {
  console.log('Workbox telah gagal dimuat!')
}

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }

  var options = {
    body: body,
    badge: "/assets/img/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});