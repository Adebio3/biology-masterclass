/* Biology Masterclass service worker: offline support */
const V = 'bm-v1';
const CORE = [
"./",
"index.html",
"settings.html",
"manifest.webmanifest",
"icons/icon-192.png",
"icons/icon-512.png",
"assets/app.js",
"assets/classroom.js",
"assets/data.js",
"assets/fonts.css",
"assets/study-tools.js",
"assets/study.js",
"assets/style.css",
"as-a-level/board.html",
"as-a-level/chapter.html",
"as-a-level/flashcards.html",
"as-a-level/index.html",
"as-a-level/mindmap.html",
"igcse/chapter.html",
"igcse/index.html",
"as-a-level/practice/chapter-01.html",
"as-a-level/practice/chapter-02.html",
"as-a-level/practice/chapter-03.html",
"as-a-level/practice/chapter-04.html",
"as-a-level/practice/chapter-05.html",
"as-a-level/practice/chapter-06.html",
"as-a-level/practice/chapter-07.html",
"as-a-level/practice/chapter-08.html",
"as-a-level/practice/chapter-09.html",
"as-a-level/practice/chapter-10.html",
"as-a-level/practice/chapter-11.html",
"as-a-level/practice/chapter-12.html",
"as-a-level/practice/chapter-13.html",
"as-a-level/practice/chapter-14.html",
"as-a-level/practice/chapter-15.html",
"as-a-level/practice/chapter-16.html",
"as-a-level/practice/chapter-17.html",
"as-a-level/practice/chapter-18.html",
"as-a-level/practice/chapter-19.html",
"as-a-level/practice/img/ch01_cell_letters.svg"
];
const EXTRA = [
"interactives/Biodiversity_Conservation_Interactive.html",
"interactives/Biological_Molecules_Interactive.html",
"interactives/Cell_Membranes_Interactive.html",
"interactives/Cell_Structure_Interactive.html",
"interactives/Control_Coordination_Interactive.html",
"interactives/Energy_Respiration_Interactive.html",
"interactives/Enzymes_Interactive.html",
"interactives/Gas_Exchange_Interactive.html",
"interactives/Genetic_Technology_Interactive.html",
"interactives/Homeostasis_Interactive.html",
"interactives/Immunity_Interactive.html",
"interactives/Infectious_Diseases_Interactive.html",
"interactives/Inheritance_Interactive.html",
"interactives/Mitotic_Cell_Cycle_Interactive.html",
"interactives/Nucleic_Acids_Interactive.html",
"interactives/Photosynthesis_Interactive.html",
"interactives/Selection_Evolution_Interactive.html",
"interactives/Transport_in_Mammals_Interactive.html",
"interactives/Transport_in_Plants_Interactive.html"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(V).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then((r) => { if (r && r.ok && r.type === 'basic') c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net; if (r) return r;
    if (req.mode === 'navigate') return (await c.match('index.html')) || Response.error();
    return Response.error();
  }));
});
self.addEventListener('message', (e) => {
  if (e.data !== 'cache-all') return;
  e.waitUntil(caches.open(V).then((c) => c.addAll(CORE.concat(EXTRA)).then(() => (e.source && e.source.postMessage({ cached: CORE.length + EXTRA.length })))));
});
