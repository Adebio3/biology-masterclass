/* Biology Masterclass: classes, students, photos and results.
   Everything is stored only in this browser (localStorage). Nothing is uploaded. */
(function () {
  var KC = 'bm.classes', KS = 'bm.results', KL = 'bm.last', KCUR = 'bm.cur';
  var DEFAULT = ['Elif', 'Semanur', 'Mahira', 'Ilham', 'Jada', 'Nyasha', 'Zikurullah'];
  var BASE = [['as', 'AS Level'], ['a2', 'A Level'], ['ig1', 'IGCSE 1'], ['ig2', 'IGCSE 2']];
  var LS = window.localStorage;
  var raw = function (k) { try { return Storage.prototype.getItem.call(LS, k); } catch (e) { return null; } };
  var put = function (k, v) { try { Storage.prototype.setItem.call(LS, k, v); return true; } catch (e) { return false; } };
  var read = function (k, d) { var v = raw(k); if (v == null) return d; try { return JSON.parse(v); } catch (e) { return d; } };
  var uid = function (p) { return (p || 's') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  var stu = function (n) { return { id: uid(), name: n, photo: '' }; };

  function init() {
    var c = read(KC, null); if (c) return c;
    // first run, or upgrade from the single class list
    var old = read('bm.roster', null), seed = null;
    if (!old) { try { for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (/^tp[0-9a-z]*\.g\.names$/.test(k)) { var n = JSON.parse(raw(k)); if (Array.isArray(n) && n.length) { seed = n; break; } } } } catch (e) {} }
    c = BASE.map(function (b) { return { id: b[0], name: b[1], roster: [] }; });
    c[0].roster = old || (seed || DEFAULT).map(stu);
    put(KC, JSON.stringify(c));
    var res = read(KS, []); res.forEach(function (r) { if (!r.c) r.c = 'as'; }); put(KS, JSON.stringify(res));
    return c;
  }
  var all = function () { return init(); }, saveAll = function (c) { return put(KC, JSON.stringify(c)); };
  var find = function (c, id) { for (var i = 0; i < c.length; i++) if (c[i].id === id) return c[i]; return null; };

  var BM = window.BM = {
    DEFAULT: DEFAULT,
    /* ---- classes ---- */
    classes: function () { return all().map(function (c) { return { id: c.id, name: c.name, size: c.roster.length }; }); },
    cur: function () { var c = all(), id = window.BM_CLS || raw(KCUR) || 'as'; return find(c, id) ? id : c[0] ? c[0].id : 'as'; },
    setCur: function (id) { window.BM_CLS = id; put(KCUR, id); },
    className: function (id) { var c = find(all(), id || BM.cur()); return c ? c.name : ''; },
    addClass: function (name) { name = String(name || '').trim(); if (!name) return null; var c = all(), x = { id: uid('c'), name: name, roster: [] }; c.push(x); saveAll(c); return x.id; },
    renameClass: function (id, name) { name = String(name || '').trim(); if (!name) return; var c = all(), x = find(c, id); if (x) { x.name = name; saveAll(c); } },
    removeClass: function (id) { var c = all().filter(function (x) { return x.id !== id; }); saveAll(c); put(KS, JSON.stringify(BM.results(true).filter(function (r) { return r.c !== id; }))); if (raw(KCUR) === id) put(KCUR, c[0] ? c[0].id : ''); },
    /* ---- students in the current class ---- */
    roster: function (cid) { var x = find(all(), cid || BM.cur()); return x ? x.roster : []; },
    saveRoster: function (r, cid) { var c = all(), x = find(c, cid || BM.cur()); if (!x) return false; x.roster = r; return saveAll(c); },
    names: function () { return BM.roster().map(function (s) { return s.name; }); },
    byName: function (n) { n = String(n || '').trim().toLowerCase(); var r = BM.roster(); for (var i = 0; i < r.length; i++) if (r[i].name.toLowerCase() === n) return r[i]; return null; },
    add: function (name, photo) { var r = BM.roster(); name = String(name || '').trim(); if (!name || BM.byName(name)) return null; var s = stu(name); s.photo = photo || ''; r.push(s); BM.saveRoster(r); return s; },
    update: function (id, patch) { var r = BM.roster(); r.forEach(function (s) { if (s.id === id) for (var k in patch) s[k] = patch[k]; }); return BM.saveRoster(r); },
    remove: function (id) { BM.saveRoster(BM.roster().filter(function (s) { return s.id !== id; })); },
    syncNames: function (list) {
      var r = BM.roster(), out = [];
      list.forEach(function (n) { n = String(n).trim(); if (!n) return; var s = r.filter(function (x) { return x.name.toLowerCase() === n.toLowerCase(); })[0]; out.push(s || stu(n)); });
      BM.saveRoster(out);
    },
    /* ---- results ---- */
    results: function (everyClass) { var a = read(KS, []); if (everyClass) return a; var c = BM.cur(); return a.filter(function (r) { return (r.c || 'as') === c; }); },
    record: function (o) {
      var s = BM.byName(o.name); if (!s) return;
      var a = read(KS, []); a.push({ t: Date.now(), c: BM.cur(), s: s.id, n: s.name, k: o.k, ch: o.ch || 0, sc: o.sc, mx: o.mx || 0 });
      if (a.length > 8000) a = a.slice(a.length - 8000);
      put(KS, JSON.stringify(a));
    },
    clearResults: function () { var c = BM.cur(); put(KS, JSON.stringify(read(KS, []).filter(function (r) { return (r.c || 'as') !== c; }))); },
    last: function (v) { var k = KL + '.' + BM.cur(); if (v === undefined) return raw(k) || ''; put(k, v); },
    summary: function (cid) {
      var keep = window.BM_CLS; if (cid) window.BM_CLS = cid;
      var r = BM.roster(), res = BM.results(), m = {};
      window.BM_CLS = keep;
      r.forEach(function (s) { m[s.id] = { s: s, game: 0, quiz: [0, 0, 0], prac: [0, 0, 0], last: 0, ch: {} }; });
      res.forEach(function (x) {
        var e = m[x.s]; if (!e) return; e.last = Math.max(e.last, x.t);
        var c = e.ch[x.ch] || (e.ch[x.ch] = { game: 0, quiz: [], prac: [] });
        if (x.k === 'game') { e.game += x.sc; c.game += x.sc; }
        else if (x.mx) { var b = x.k === 'quiz' ? e.quiz : e.prac; b[0] += x.sc; b[1] += x.mx; b[2]++; (x.k === 'quiz' ? c.quiz : c.prac).push(Math.round(x.sc / x.mx * 100)); }
      });
      return r.map(function (s) { return m[s.id]; });
    },
    exportData: function () { return JSON.stringify({ app: 'biology-masterclass', v: 2, saved: new Date().toISOString(), classes: all(), results: read(KS, []) }); },
    importData: function (txt) {
      var d = JSON.parse(txt);
      if (d && Array.isArray(d.classes)) { put(KC, JSON.stringify(d.classes)); put(KS, JSON.stringify(d.results || [])); return; }
      if (d && Array.isArray(d.roster)) { var c = all(); c[0].roster = d.roster; saveAll(c); put(KS, JSON.stringify((d.results || []).map(function (r) { r.c = r.c || c[0].id; return r; }))); return; }
      throw new Error('Not a Biology Masterclass backup file');
    },
    avatar: function (name, size) {
      size = size || 32; var s = BM.byName(name); var st = 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;flex:none;display:inline-grid;place-items:center;vertical-align:middle;object-fit:cover;';
      if (s && s.photo) return '<img class="bm-av" alt="" src="' + s.photo + '" style="' + st + '">';
      var h = 0, t = String(name || '?'); for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 360;
      var ini = t.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
      return '<span class="bm-av" aria-hidden="true" style="' + st + 'background:hsl(' + h + ' 65% 45%);color:#fff;font:700 ' + Math.round(size * 0.42) + 'px/1 sans-serif">' + ini + '</span>';
    },
    photoFromFile: function (file, cb) {
      var fr = new FileReader();
      fr.onload = function () { var img = new Image(); img.onload = function () { var S = 160, c = document.createElement('canvas'); c.width = c.height = S; var m = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S); cb(c.toDataURL('image/jpeg', 0.8)); }; img.onerror = function () { cb(''); }; img.src = fr.result; };
      fr.readAsDataURL(file);
    },
    /* class for a chapter page: the teacher's last choice for that chapter, else AS (1–11) or A Level (12–19) */
    classForChapter: function (ch, course) {
      var k = 'bm.cls.' + (course || 'al') + ch, v = raw(k), ids = BM.classes().map(function (c) { return c.id; });
      if (v && ids.indexOf(v) >= 0) return v;
      var d = course === 'ig' ? 'ig1' : ch >= 12 ? 'a2' : 'as'; return ids.indexOf(d) >= 0 ? d : ids[0];
    },
    setClassForChapter: function (ch, id, course) { put('bm.cls.' + (course || 'al') + ch, id); BM.setCur(id); },
    classSelect: function (sel) { return '<select class="bm-cls" style="font-size:15px;padding:5px 8px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a">' + BM.classes().map(function (c) { return '<option value="' + c.id + '"' + (c.id === (sel || BM.cur()) ? ' selected' : '') + '>' + c.name.replace(/</g, '&lt;') + ' (' + c.size + ')</option>'; }).join('') + '</select>'; },
    bindPicker: function (el, ch, course, onClass) {
      var cs = el.querySelector('.bm-cls'), who = el.querySelector('.bm-who');
      who.onchange = function () { BM.last(who.value); };
      cs.onchange = function () {
        BM.setClassForChapter(ch, cs.value, course); var last = BM.last();
        who.innerHTML = '<option value="">Not recorded</option>' + BM.roster().map(function (s) { return '<option' + (s.name === last ? ' selected' : '') + '>' + s.name.replace(/</g, '&lt;') + '</option>'; }).join('');
        if (onClass) onClass(cs.value);
      };
    },
    picker: function (label) {
      var r = BM.roster(), last = BM.last();
      return '<div class="bm-pick" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0"><b>Class</b>' + BM.classSelect() + '<b style="margin-left:6px">' + (label || 'Who is answering?') + '</b><select class="bm-who" style="font-size:16px;padding:6px 10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a"><option value="">Not recorded</option>' + r.map(function (s) { return '<option' + (s.name === last ? ' selected' : '') + '>' + s.name.replace(/</g, '&lt;') + '</option>'; }).join('') + '</select></div>';
    },
  };
})();
