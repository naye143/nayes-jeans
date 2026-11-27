/* Nayes Jeans: guarda la app en el equipo para que abra sin internet. Versión 8.7 */
const C='nayes-8.7';
const FIJOS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FIJOS.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('nayes-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const app=u.origin===location.origin;const fijo=/gstatic\.com\/firebasejs\/|fonts\.(googleapis|gstatic)\.com/.test(r.url);
 if(!app&&!fijo)return;
 if(app&&(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))){
  /* la página: primero internet (así se actualiza sola), si no hay, la guardada */
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));return}
 e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
