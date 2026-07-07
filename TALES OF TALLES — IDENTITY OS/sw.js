// TALES OF TALLES — Service Worker (offline shell).
// Coloque este ficheiro AO LADO do HTML no mesmo host para ativar o offline-shell.
// O HTML deteta-o automaticamente (tryHosted). Sem ele, a app degrada com elegância
// e continua a funcionar offline via IndexedDB.
const CACHE='tot-v5';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
);});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})
        .catch(()=>caches.match(e.request).then(m=>m||caches.match('./')))
    );return;
  }
  if(u.origin!==location.origin){
    e.respondWith(
      caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{
        if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;
      }).catch(()=>m))
    );
  }
});
