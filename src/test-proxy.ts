// src/test-proxy.ts
fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    USER_ID: 'demo@humanuss.com',
    PASSWORD: 'Humanuss2023'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
