const VERSION = 'oracle-v82'; // ⚠️ Incrémenter à CHAQUE déploiement

// Fichiers critiques à pré-cacher à l'installation (légers, indispensables au démarrage)
// Les mp3 ne sont PLUS pré-cachés : ils sont mis en cache au vol à la première lecture
// (installation plus rapide, et un seul 404 ne fait plus échouer toute l'installation)
const PRECACHE = [
  '/Oracle/oracle.html',
  '/Oracle/manifest.json',
  '/Oracle/js/data/facts-fr.js',
  '/Oracle/js/data/facts-en.js',
  '/Oracle/js/data/facts-es.js',
  '/Oracle/js/data/ephemeris.js',
  '/Oracle/js/data/sources.js',
  '/Oracle/js/data/deep-dives.js',
  '/Oracle/js/app.js',
  '/Oracle/js/features/thematic-days.js',
  '/Oracle/js/features/share.js',
  '/Oracle/js/features/audio.js',
  '/Oracle/js/features/quiz.js',
  '/Oracle/js/features/space-game.js',
  '/Oracle/js/features/starfield.js',
  '/Oracle/js/features/push.js'
];

// Domaines dont on cache les réponses au vol (Google Fonts)
const RUNTIME_CACHE_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// ── Installation : pré-cache résilient ──
// Chaque fichier est mis en cache individuellement : un échec isolé
// (404, réseau) ne bloque pas l'installation du Service Worker.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache =>
      Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Précache échoué pour', url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// ── Activation : nettoyage des anciens caches ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch : stratégie selon le type de ressource ──
self.addEventListener('fetch', e => {
  // Ignorer les requêtes non-GET (POST Firestore, etc.)
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Google Fonts → cache-first (elles ne changent jamais)
  if (RUNTIME_CACHE_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(VERSION).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // oracle.html et fichiers JS → network-first (toujours servir la dernière version si possible)
  if (url.pathname.endsWith('oracle.html') || (url.pathname.endsWith('.js') && url.pathname.startsWith('/Oracle/js/'))) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Audio et autres fichiers locaux → cache-first (gros fichiers, changent rarement)
  if (url.pathname.startsWith('/Oracle/')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(VERSION).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Tout le reste → network only, fallback cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// ── PUSH NOTIFICATIONS (FCM) ───────────────────────────────────────────────
// Réception des messages data-only envoyés par le Worker Cloudflare.
// try/catch : si le CDN est injoignable au moment de l'installation,
// le Service Worker continue de fonctionner (sans push).
try {
  importScripts(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
  );
  firebase.initializeApp({
    apiKey: "AIzaSyCLag6Sggmy7brtOD5LDv_gQid3pMW90wg",
    authDomain: "oracle-360d6.firebaseapp.com",
    projectId: "oracle-360d6",
    storageBucket: "oracle-360d6.firebasestorage.app",
    messagingSenderId: "160038588661",
    appId: "1:160038588661:web:fe50c75d30cc214fe9f5bc"
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(function(payload){
    const d = (payload && payload.data) || {};
    return self.registration.showNotification(d.title || 'Oracle', {
      body: d.body || '',
      icon: '/Oracle/icons/icon-192.png',
      badge: '/Oracle/icons/icon-192.png',
      tag: 'oracle-daily',
      data: { url: d.url || '/Oracle/oracle.html' }
    });
  });
} catch(e) {
  // FCM indisponible : le SW fonctionne normalement sans push
}

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/Oracle/oracle.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (const c of list) {
        if (c.url.includes('/Oracle/') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
