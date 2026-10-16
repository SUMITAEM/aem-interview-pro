const CACHE_NAME = 'aem-prep-v2';
const ASSETS = [
  '/aem-interview-pro/',
  '/aem-interview-pro/index.html',
  '/aem-interview-pro/AEM_interview_live.html',
  '/aem-interview-pro/sg-logo.png',
  '/aem-interview-pro/AEM-cheat-sheet.html',
  '/aem-interview-pro/icons/icon-192.png',
  '/aem-interview-pro/icons/icon-512.png',
  '/aem-interview-pro/images/aem-architecture-stack.svg',
  '/aem-interview-pro/images/aem-author-publish.svg',
  '/aem-interview-pro/images/aem-caching-layers.svg',
  '/aem-interview-pro/images/aem-component-structure.svg',
  '/aem-interview-pro/images/aem-project-structure.svg',
  '/aem-interview-pro/images/aem-request-flow.svg',
  '/aem-interview-pro/images/aem-security.svg',
  '/aem-interview-pro/images/aem-workflow.svg',
  '/aem-interview-pro/images/cf-vs-xf.svg',
  '/aem-interview-pro/images/editable-template.svg',
  '/aem-interview-pro/images/msm-live-copy.svg',
  '/aem-interview-pro/images/osgi-bundle-lifecycle.svg',
  '/aem-interview-pro/images/sling-model-flow.svg',
  '/aem-interview-pro/images/aem-6-5-vs-cloud.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebaseapp.com')) return;
  if (event.request.url.includes('googleapis.com')) return;
  if (event.request.url.includes('gstatic.com')) return;
  if (event.request.url.includes('google.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('/aem-interview-pro/index.html');
      }
    })
  );
});
