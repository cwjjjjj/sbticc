// Retire the old Monetag service worker.
// Keeping this file lets browsers update an existing registration and remove it.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
    })()
  );
});
