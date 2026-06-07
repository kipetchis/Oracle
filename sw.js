const VERSION = 'oracle-v71';

// Fichiers critiques à pré-cacher à l'installation
const PRECACHE = [
  '/Oracle/oracle.html',
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
  '/Oracle/audio/ambient-earth.mp3',
  '/Oracle/audio/ambient-mars.mp3',
  '/Oracle/audio/ambient-jupiter.mp3',
  '/Oracle/audio/ambient-saturn.mp3',
  '/Oracle/audio/ambient-neptune.mp3',
  '/Oracle/audio/ambient-venus.mp3',
  '/Oracle/audio/ambient-mercury.mp3',
  '/Oracle/audio/ambient-pluto.mp3',
  '/Oracle/audio/ambient-sun.mp3',
  '/Oracle/audio/ambient-moon.mp3',
  '/Oracle/audio/ambient-nebula.mp3',
  '/Oracle/audio/ambient-pangaea.mp3'
];

const IMAGES_CACHE = 'oracle-images-v1';

// Domaines dont on cache les réponses au vol (Google Fonts)
const RUNTIME_CACHE_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// ── Installation : pré-cache des fichiers critiques ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activation : nettoyage des anciens caches (sauf images) ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION && k !== IMAGES_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch : stratégie selon le type de ressource ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Images Wikimedia → cache-first progressif (hors ligne après 1er affichage)
  if (url.hostname === 'upload.wikimedia.org') {
    e.respondWith(
      caches.open(IMAGES_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => new Response('', {status: 404}));
        })
      )
    );
    return;
  }

  // Google Fonts → cache-first (elles changent jamais)
  if (RUNTIME_CACHE_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // oracle.html et fichiers JS → network-first (toujours servir la dernière version si possible)
  if (url.pathname.endsWith('oracle.html') || url.pathname.endsWith('.js') && url.pathname.startsWith('/Oracle/js/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, clone));
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
          if (res.status === 200) {
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
