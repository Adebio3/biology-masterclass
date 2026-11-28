/* Biology Masterclass: class list, photos and results.
   Everything is stored only in this browser (localStorage). Nothing is uploaded. */
(function () {
  var KR = 'bm.roster', KS = 'bm.results', KL = 'bm.last';
  var DEFAULT = ['Elif', 'Semanur', 'Mahira', 'Ilham', 'Jada', 'Nyasha', 'Zikurullah'];
  var LS = window.localStorage;
  var raw = function (k) { try { return Storage.prototype.getItem.call(LS, k); } catch (e) { return null; } };
  var put = function (k, v) { try { Storage.prototype.setItem.call(LS, k, v); return true; } catch (e) { return false; } };
  var read = function (k, d) { var v = raw(k); if (v == null) return d; try { return JSON.parse(v); } catch (e) { return d; } };
  var uid = function () { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };

  function seedNames() {
    // reuse names a teacher already typed into the games, if any
    try { for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (/^tp[0-9a-z]*\.g\.names$/.test(k)) { var n = JSON.parse(raw(k)); if (Array.isArray(n) && n.length) return n; } } } catch (e) {}
    return DEFAULT;
  }
  var BM = window.BM = {
    DEFAULT: DEFAULT,
    roster: function () { var r = read(KR, null); if (!r) { r = seedNames().map(function (n) { return { id: uid(), name: n, photo: '' }; }); put(KR, JSON.stringify(r)); } return r; },
    saveRoster: function (r) { return put(KR, JSON.stringify(r)); },
    names: function () { return BM.roster().map(function (s) { return s.name; }); },
    byName: function (n) { n = String(n || '').trim().toLowerCase(); var r = BM.roster(); for (var i = 0; i < r.length; i++) if (r[i].name.toLowerCase() === n) return r[i]; return null; },
    add: function (name, photo) { var r = BM.roster(); name = String(name || '').trim(); if (!name || BM.byName(name)) return null; var s = { id: uid(), name: name, photo: photo || '' }; r.push(s); BM.saveRoster(r); return s; },
    update: function (id, patch) { var r = BM.roster(); r.forEach(function (s) { if (s.id === id) for (var k in patch) s[k] = patch[k]; }); return BM.saveRoster(r); },
    remove: function (id) { BM.saveRoster(BM.roster().filter(function (s) { return s.id !== id; })); },
    // keep the roster in step with a plain list of names (e.g. edited inside a game)
    syncNames: function (list) {
      var r = BM.roster(), out = [];
      list.forEach(function (n) { n = String(n).trim(); if (!n) return; var s = r.filter(function (x) { return x.name.toLowerCase() === n.toLowerCase(); })[0]; out.push(s || { id: uid(), name: n, photo: '' }); });
      BM.saveRoster(out);
    },
    results: function () { return read(KS, []); },
    record: function (o) {
      // o: { name, k: 'game'|'quiz'|'practice', ch, sc, mx }
      var s = BM.byName(o.name); if (!s) return;
      var a = BM.results(); a.push({ t: Date.now(), s: s.id, n: s.name, k: o.k, ch: o.ch || 0, sc: o.sc, mx: o.mx || 0 });
      if (a.length > 6000) a = a.slice(a.length - 6000);
      put(KS, JSON.stringify(a));
    },
    clearResults: function () { put(KS, '[]'); },
    last: function (v) { if (v === undefined) return raw(KL) || ''; put(KL, v); },
    summary: function () {
      var r = BM.roster(), res = BM.results(), m = {};
      r.forEach(function (s) { m[s.id] = { s: s, game: 0, quiz: [0, 0, 0], prac: [0, 0, 0], last: 0, ch: {} }; });
      res.forEach(function (x) {
        var e = m[x.s]; if (!e) return; e.last = Math.max(e.last, x.t);
        var c = e.ch[x.ch] || (e.ch[x.ch] = { game: 0, quiz: [], prac: [] });
        if (x.k === 'game') { e.game += x.sc; c.game += x.sc; }
        else if (x.mx) { var p = x.sc / x.mx; var b = x.k === 'quiz' ? e.quiz : e.prac; b[0] += x.sc; b[1] += x.mx; b[2]++; (x.k === 'quiz' ? c.quiz : c.prac).push(Math.round(p * 100)); }
      });
      return r.map(function (s) { return m[s.id]; });
    },
    exportData: function () { return JSON.stringify({ app: 'biology-masterclass', v: 1, saved: new Date().toISOString(), roster: BM.roster(), results: BM.results() }); },
    importData: function (txt) { var d = JSON.parse(txt); if (!d || !Array.isArray(d.roster)) throw new Error('Not a Biology Masterclass backup file'); put(KR, JSON.stringify(d.roster)); put(KS, JSON.stringify(d.results || [])); },
    // a small round picture, or coloured initials when there is no photo
    avatar: function (name, size) {
      size = size || 32; var s = BM.byName(name); var st = 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;flex:none;display:inline-grid;place-items:center;vertical-align:middle;object-fit:cover;';
      if (s && s.photo) return '<img class="bm-av" alt="" src="' + s.photo + '" style="' + st + '">';
      var h = 0, t = String(name || '?'); for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 360;
      var ini = t.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
      return '<span class="bm-av" aria-hidden="true" style="' + st + 'background:hsl(' + h + ' 65% 45%);color:#fff;font:700 ' + Math.round(size * 0.42) + 'px/1 sans-serif">' + ini + '</span>';
    },
    // resize a chosen image file to a small square JPEG (keeps storage small)
    photoFromFile: function (file, cb) {
      var fr = new FileReader();
      fr.onload = function () { var img = new Image(); img.onload = function () { var S = 160, c = document.createElement('canvas'); c.width = c.height = S; var m = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S); cb(c.toDataURL('image/jpeg', 0.8)); }; img.onerror = function () { cb(''); }; img.src = fr.result; };
      fr.readAsDataURL(file);
    },
    // name picker used before quizzes and topic questions
    picker: function (label) {
      var r = BM.roster(), last = BM.last();
      return '<label class="bm-pick" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0"><b>' + (label || 'Who is answering?') + '</b><select class="bm-who" style="font-size:16px;padding:6px 10px;border-radius:10px;border:1px solid #cbd5e1"><option value="">Not recorded</option>' + r.map(function (s) { return '<option' + (s.name === last ? ' selected' : '') + '>' + s.name.replace(/</g, '&lt;') + '</option>'; }).join('') + '</select></label>';
    },
  };
})();
