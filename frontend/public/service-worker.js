self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

self.addEventListener('message', async (event) => {
  try {
    await fetch('http://localhost:5000/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event.data),
    });
    console.log('Event sent:', event.data.event_type);
  } catch (err) {
    console.error('Failed to send event:', err);
  }
});
