/* Flashcards, mind map and drawing board pages. Uses window.SITE and window.STUDY. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const page = document.body.dataset.tool;
  const C = window.SITE.courses.alevel;
  const n = +(new URLSearchParams(location.search).get('c') || 1);
  const ch = C.chapters.find((x) => x.n === n) || C.chapters[0];
  const data = (window.STUDY || {})[ch.n];
  document.body.style.setProperty('--c', ch.colour);
  const label = { cards: 'Flashcards', map: 'Mind map', board: 'Board' }[page];
  document.title = `${label} · Chapter ${ch.n} ${ch.title} · Biology Masterclass`;
  const cr = $('#crumb'); if (cr) { cr.textContent = 'Chapter ' + ch.n; cr.href = 'chapter.html?c=' + ch.n; }
  const chooser = () => `<select id="chsel" aria-label="Choose chapter" style="max-width:100%;font:600 15px Lexend,sans-serif;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink)">${C.chapters.filter((c) => window.STUDY[c.n]).map((c) => `<option value="${c.n}" ${c.n === ch.n ? 'selected' : ''}>Chapter ${c.n}: ${esc(c.title)}</option>`).join('')}</select>`;
  const head = (sub) => `<a class="backlink" href="chapter.html?c=${ch.n}">‹ Chapter ${ch.n}: ${esc(ch.title)}</a><div class="chhero" style="padding-bottom:10px;padding-top:14px"><div class="num">Chapter ${ch.n} · ${esc(ch.title)}</div><h1>${label}</h1><p>${sub}</p><div class="row noprint" style="margin-top:10px">${chooser()}<a class="btn" href="flashcards.html?c=${ch.n}" ${page === 'cards' ? 'aria-current="page" style="border-color:var(--c)"' : ''}>🃏 Flashcards</a><a class="btn" href="mindmap.html?c=${ch.n}" ${page === 'map' ? 'aria-current="page" style="border-color:var(--c)"' : ''}>🧠 Mind map</a><a class="btn" href="board.html?c=${ch.n}" ${page === 'board' ? 'aria-current="page" style="border-color:var(--c)"' : ''}>✏️ Board</a></div></div>`;
  const main = $('#main');
  const bindChooser = () => { const s = $('#chsel'); if (s) s.onchange = () => { location.search = '?c=' + s.value; }; };

  /* ---------------- FLASHCARDS ---------------- */
  if (page === 'cards') {
    const key = 'bm.cards.' + ch.n; let known = {}; try { known = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    const all = data.cards.map((c, i) => ({ i, t: c[0], d: c[1] }));
    let deck = all.slice(), pos = 0, flipped = false, reverse = false, onlyLearning = false;
    main.innerHTML = head('Tap the card to flip it. Mark each one <b>Got it</b> or <b>Still learning</b>; your progress is saved on this device.') + `
      <div class="fc-bar noprint"><button class="btn" id="fcShuffle">🔀 Shuffle</button><button class="btn" id="fcRev">⇄ Show answer first</button><button class="btn" id="fcOnly">Only "still learning"</button><button class="btn" id="fcList">📋 List view</button><button class="btn" id="fcReset">Reset progress</button></div>
      <div class="fc-prog"><span id="fcCount"></span><div class="prog"><i id="fcBar"></i></div></div>
      <div class="fc-stage"><button class="fc-card" id="fcCard" aria-live="polite"><div class="fc-inner"><div class="fc-face fc-front"><small>TERM</small><div id="fcFront"></div></div><div class="fc-face fc-back"><small>ANSWER</small><div id="fcBack"></div></div></div></button></div>
      <div class="row fc-nav noprint"><button class="btn" id="fcPrev">← Previous</button><button class="btn" id="fcNo" style="border-color:#f59e0b">Still learning</button><button class="btn pri" id="fcYes">Got it ✓</button><button class="btn" id="fcNext">Next →</button></div>
      <p class="note noprint" style="margin-top:14px">Keyboard: Space flips, ← → move, 1 = still learning, 2 = got it.</p>
      <div id="fcListBox" hidden></div>`;
    const rebuild = () => { deck = (onlyLearning ? all.filter((c) => !known[c.i]) : all.slice()); if (!deck.length) deck = all.slice(); pos = Math.min(pos, deck.length - 1); show(); };
    const show = () => { const c = deck[pos]; flipped = false; $('#fcCard').classList.remove('on'); $('#fcFront').textContent = reverse ? c.d : c.t; $('#fcBack').textContent = reverse ? c.t : c.d; $('#fcFront').parentElement.querySelector('small').textContent = reverse ? 'ANSWER' : 'TERM'; $('#fcBack').parentElement.querySelector('small').textContent = reverse ? 'TERM' : 'ANSWER';
      const k = all.filter((x) => known[x.i]).length; $('#fcCount').innerHTML = `Card <b>${pos + 1}</b> of ${deck.length} · <b>${k}</b> of ${all.length} known ${known[c.i] ? '· ✓ known' : ''}`; $('#fcBar').style.width = (k / all.length * 100) + '%'; };
    const save = () => { try { localStorage.setItem(key, JSON.stringify(known)); } catch (e) {} };
    const flip = () => { flipped = !flipped; $('#fcCard').classList.toggle('on', flipped); };
    const go = (d) => { pos = (pos + d + deck.length) % deck.length; show(); };
    const mark = (v) => { known[deck[pos].i] = v; save(); if (onlyLearning && v) { rebuild(); } else go(1); };
    $('#fcCard').onclick = flip; $('#fcPrev').onclick = () => go(-1); $('#fcNext').onclick = () => go(1);
    $('#fcYes').onclick = () => mark(true); $('#fcNo').onclick = () => mark(false);
    $('#fcShuffle').onclick = () => { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } pos = 0; show(); };
    $('#fcRev').onclick = (e) => { reverse = !reverse; e.target.style.borderColor = reverse ? 'var(--c)' : ''; show(); };
    $('#fcOnly').onclick = (e) => { onlyLearning = !onlyLearning; e.target.style.borderColor = onlyLearning ? 'var(--c)' : ''; pos = 0; rebuild(); };
    $('#fcReset').onclick = () => { known = {}; save(); rebuild(); };
    $('#fcList').onclick = () => { const b = $('#fcListBox'); b.hidden = !b.hidden; b.innerHTML = `<div class="scroll"><table class="datatab" style="width:100%;text-align:left">${all.map((c) => `<tr><th style="text-align:left;width:32%">${esc(c.t)}</th><td style="text-align:left">${esc(c.d)}</td></tr>`).join('')}</table></div>`; if (!b.hidden) b.scrollIntoView({ behavior: 'smooth' }); };
    document.addEventListener('keydown', (e) => { if (e.target.tagName === 'SELECT') return; if (e.key === ' ') { e.preventDefault(); flip(); } else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === '1') mark(false); else if (e.key === '2') mark(true); });
    show();
  }

  /* ---------------- MIND MAP ---------------- */
  if (page === 'map') {
    const B = Object.entries(data.map);
    main.innerHTML = head('Every branch of the chapter on one page. Use <b>Quiz me</b> to hide the details, then tap a branch to reveal it.') + `
      <div class="row noprint" style="margin:6px 0 12px"><button class="btn" id="mmQuiz">🙈 Quiz me</button><button class="btn" id="mmShow">👀 Show all</button><button class="btn" id="mmOutline">☰ Outline view</button><button class="btn" onclick="print()">🖨 Print</button></div>
      <div class="mm-wrap" id="mmWrap"></div><div id="mmList" hidden></div>`;
    const hidden = new Set(); let quiz = false;
    const PAL = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#ca8a04'];
    const wrapT = (s, max) => { const w = s.split(' '); const L = []; let cur = ''; w.forEach((x) => { if ((cur + ' ' + x).trim().length > max) { if (cur) L.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) L.push(cur); return L; };
    const draw = () => {
      const nb = B.length, half = Math.ceil(nb / 2), sides = [B.map((x, i) => i).slice(0, half), B.map((x, i) => i).slice(half)];
      const rowsOf = (i) => B[i][1].reduce((t, p) => t + wrapT(p, 32).length, 0);
      const need = sides.map((ids) => ids.reduce((t, i) => t + rowsOf(i) * 22 + B[i][1].length * 14 + 26, 0));
      const W = 1300, H = Math.max(620, Math.max(...need) + 60), cx = W / 2, cy = H / 2;
      let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mind map of ${esc(ch.title)}" style="width:100%;height:auto;display:block">`;
      const branchSvg = [];
      sides.forEach((ids, side) => {
        const right = side === 0, dir = right ? 1 : -1; let y = (H - need[side]) / 2 + 13;
        ids.forEach((i) => {
          const [name, pts] = B[i], col = PAL[i % PAL.length], show = !(quiz && !hidden.has(i));
          const ys = []; pts.forEach((p) => { const nl = wrapT(p, 32).length; const h = nl * 22 + 14; ys.push(y + h / 2); y += h; }); y += 26;
          const by = (ys[0] + ys[ys.length - 1]) / 2, bx = cx + dir * 250, tx = cx + dir * 370;
          s += `<path d="M${cx + dir * 80},${cy} C${cx + dir * 170},${cy} ${cx + dir * 150},${by} ${bx},${by}" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>`;
          pts.forEach((p, k) => { const ly = ys[k], lines = wrapT(p, 32);
            s += `<path d="M${bx},${by} C${(bx + tx) / 2},${by} ${(bx + tx) / 2},${ly} ${tx},${ly}" stroke="${col}" stroke-width="2.5" fill="none" opacity=".6"/>`;
            s += `<g opacity="${show ? 1 : 0.2}">` + lines.map((ln, j) => `<text x="${tx + dir * 8}" y="${ly + (j - (lines.length - 1) / 2) * 20 + 5}" font-size="16" text-anchor="${right ? 'start' : 'end'}" fill="currentColor">${show ? esc(ln) : (j ? '' : '• • •')}</text>`).join('') + `</g>`; });
          const bl = wrapT(name, 16), bw = Math.max(...bl.map((x) => x.length)) * 10.5 + 30, bh = bl.length * 20 + 18;
          branchSvg.push(`<g class="mm-b" data-i="${i}" style="cursor:pointer"><rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="14" fill="${col}"/>` + bl.map((ln, j) => `<text x="${bx}" y="${by + (j - (bl.length - 1) / 2) * 20 + 6}" font-size="17" font-weight="700" text-anchor="middle" fill="#fff">${esc(ln)}</text>`).join('') + `</g>`);
        });
      });
      s += branchSvg.join('');
      const tl = wrapT(ch.title, 16);
      s += `<circle cx="${cx}" cy="${cy}" r="92" fill="${ch.colour}"/><text x="${cx}" y="${cy - 14 - (tl.length - 1) * 11}" font-size="15" text-anchor="middle" fill="#fff" opacity=".85">Chapter ${ch.n}</text>` + tl.map((ln, j) => `<text x="${cx}" y="${cy + 12 + (j - (tl.length - 1) / 2) * 22}" font-size="20" font-weight="700" text-anchor="middle" fill="#fff">${esc(ln)}</text>`).join('') + '</svg>';
      $('#mmWrap').innerHTML = s;
      document.querySelectorAll('.mm-b').forEach((g) => g.addEventListener('click', () => { const i = +g.dataset.i; hidden.has(i) ? hidden.delete(i) : hidden.add(i); draw(); }));
      $('#mmList').innerHTML = `<div class="tiles">${B.map(([name, pts], i) => `<div class="tile" style="border-top:5px solid ${PAL[i % PAL.length]}"><h3>${esc(name)}</h3><ul style="margin:0;padding-left:18px">${pts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')}</div>`;
    };
    $('#mmQuiz').onclick = () => { quiz = true; hidden.clear(); draw(); };
    $('#mmShow').onclick = () => { quiz = false; draw(); };
    $('#mmOutline').onclick = () => { const l = $('#mmList'), w = $('#mmWrap'); l.hidden = !l.hidden; w.hidden = !l.hidden; };
    if (innerWidth < 640) { $('#mmList').hidden = false; $('#mmWrap').hidden = true; }
    draw();
  }

  /* ---------------- BOARD ---------------- */
  if (page === 'board') {
    main.innerHTML = head('Write, draw and annotate with your finger, stylus or mouse. Switch between a white board and a black board.') + `
      <div class="bd-tools noprint" id="bdTools">
        <div class="bd-group" role="group" aria-label="Tool"><button class="bd-b on" data-tool="pen" title="Pen">✏️</button><button class="bd-b" data-tool="hl" title="Highlighter">🖍</button><button class="bd-b" data-tool="line" title="Straight line">📏</button><button class="bd-b" data-tool="text" title="Type text">T</button><button class="bd-b" data-tool="erase" title="Eraser">🧽</button></div>
        <div class="bd-group" id="bdCols" role="group" aria-label="Colour"></div>
        <div class="bd-group" role="group" aria-label="Size"><button class="bd-b" data-size="2">•</button><button class="bd-b on" data-size="4">●</button><button class="bd-b" data-size="9"><span style="font-size:22px">●</span></button></div>
        <div class="bd-group"><button class="bd-b" id="bdBg" title="White or black board">⬛ Black</button><button class="bd-b" id="bdPaper" title="Background">▦ Grid</button></div>
        <div class="bd-group"><button class="bd-b" id="bdUndo" title="Undo">↶</button><button class="bd-b" id="bdRedo" title="Redo">↷</button><button class="bd-b" id="bdClear">🗑 Clear</button><button class="bd-b" id="bdSave">💾 Save</button><button class="bd-b" id="bdFull">⛶ Full screen</button></div>
      </div>
      <div class="bd-wrap" id="bdWrap"><canvas id="bd" aria-label="Drawing board"></canvas></div>`;
    const wrap = $('#bdWrap'), cv = $('#bd'), ctx = cv.getContext('2d');
    const st = { tool: 'pen', size: 4, dark: false, paper: 'blank', strokes: [], redo: [], cur: null };
    const COLS_LIGHT = ['#111827', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'], COLS_DARK = ['#ffffff', '#facc15', '#60a5fa', '#f87171', '#4ade80', '#f9a8d4'];
    let colIdx = 0;
    const cols = () => (st.dark ? COLS_DARK : COLS_LIGHT);
    const drawCols = () => { $('#bdCols').innerHTML = cols().map((c, i) => `<button class="bd-b bd-c ${i === colIdx ? 'on' : ''}" data-col="${i}" style="--sw:${c}" aria-label="Colour ${i + 1}"></button>`).join(''); };
    const key = 'bm.board.' + ch.n;
    const fit = () => { const r = wrap.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * d; cv.height = r.height * d; cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0); redraw(); };
    const bg = () => { const w = cv.clientWidth, h = cv.clientHeight; ctx.fillStyle = st.dark ? '#14201a' : '#ffffff'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = st.dark ? 'rgba(255,255,255,.08)' : 'rgba(15,23,42,.08)'; ctx.lineWidth = 1;
      if (st.paper === 'grid') { for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
      if (st.paper === 'lines') { for (let y = 40; y < h; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
      ctx.fillStyle = st.dark ? 'rgba(255,255,255,.35)' : 'rgba(15,23,42,.35)'; ctx.font = '600 13px Lexend, sans-serif'; ctx.fillText(`Chapter ${ch.n} · ${ch.title}`, 12, 20); };
    const col = (s) => (st.dark ? COLS_DARK : COLS_LIGHT)[s.ci] || s.c;
    const paint = (s) => {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (s.tool === 'text') { ctx.fillStyle = col(s); ctx.font = `${12 + s.size * 3}px 'Atkinson Hyperlegible', sans-serif`; s.text.split('\n').forEach((ln, i) => ctx.fillText(ln, s.p[0][0], s.p[0][1] + i * (14 + s.size * 3))); ctx.restore(); return; }
      if (s.tool === 'erase') { ctx.strokeStyle = st.dark ? '#14201a' : '#ffffff'; ctx.lineWidth = s.size * 5; }
      else if (s.tool === 'hl') { ctx.globalAlpha = 0.35; ctx.strokeStyle = col(s); ctx.lineWidth = s.size * 4; }
      else { ctx.strokeStyle = col(s); ctx.lineWidth = s.size; }
      const P = s.p; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
      if (s.tool === 'line') ctx.lineTo(P[P.length - 1][0], P[P.length - 1][1]);
      else { for (let i = 1; i < P.length - 1; i++) { const mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2; ctx.quadraticCurveTo(P[i][0], P[i][1], mx, my); } if (P.length > 1) ctx.lineTo(P[P.length - 1][0], P[P.length - 1][1]); else ctx.lineTo(P[0][0] + 0.1, P[0][1]); }
      ctx.stroke();
      if (s.tool === 'erase' && st.paper !== 'blank') { /* eraser over paper lines is fine */ }
      ctx.restore(); };
    const redraw = () => { bg(); st.strokes.forEach(paint); if (st.cur) paint(st.cur); };
    const store = () => { try { localStorage.setItem(key, JSON.stringify({ s: st.strokes.slice(-400), dark: st.dark, paper: st.paper })); } catch (e) {} };
    try { const o = JSON.parse(localStorage.getItem(key) || 'null'); if (o) { st.strokes = o.s || []; st.dark = !!o.dark; st.paper = o.paper || 'blank'; } } catch (e) {}
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => {
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      if (st.tool === 'text') { const p = pos(e); const box = document.createElement('textarea'); box.className = 'bd-text'; box.style.left = p[0] + 'px'; box.style.top = (p[1] - 16) + 'px'; box.style.color = cols()[colIdx]; box.style.font = `${12 + st.size * 3}px 'Atkinson Hyperlegible', sans-serif`; wrap.appendChild(box); setTimeout(() => box.focus(), 0);
        const done = () => { if (box.value.trim()) { st.strokes.push({ tool: 'text', ci: colIdx, size: st.size, p: [[p[0], p[1]]], text: box.value }); st.redo = []; store(); redraw(); } box.remove(); };
        box.addEventListener('blur', done); box.addEventListener('keydown', (k) => { if (k.key === 'Escape') box.blur(); }); return; }
      st.cur = { tool: st.tool, ci: colIdx, size: st.size, p: [pos(e)] }; });
    cv.addEventListener('pointermove', (e) => { if (!st.cur) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; if (st.cur.tool === 'line') st.cur.p[1] = pos(e); else evs.forEach((ev) => st.cur.p.push(pos(ev))); redraw(); });
    const end = () => { if (!st.cur) return; st.strokes.push(st.cur); st.cur = null; st.redo = []; store(); redraw(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    $('#bdTools').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.tool) { st.tool = b.dataset.tool; b.parentElement.querySelectorAll('.bd-b').forEach((x) => x.classList.toggle('on', x === b)); }
      if (b.dataset.size) { st.size = +b.dataset.size; b.parentElement.querySelectorAll('.bd-b').forEach((x) => x.classList.toggle('on', x === b)); }
      if (b.dataset.col) { colIdx = +b.dataset.col; drawCols(); if (st.tool === 'erase') st.tool = 'pen'; } });
    $('#bdBg').onclick = () => { st.dark = !st.dark; $('#bdBg').textContent = st.dark ? '⬜ White' : '⬛ Black'; drawCols(); store(); redraw(); };
    const PAPERS = ['blank', 'grid', 'lines']; $('#bdPaper').onclick = () => { st.paper = PAPERS[(PAPERS.indexOf(st.paper) + 1) % 3]; $('#bdPaper').textContent = { blank: '▦ Grid', grid: '☰ Lines', lines: '▢ Blank' }[st.paper]; store(); redraw(); };
    $('#bdUndo').onclick = () => { if (st.strokes.length) { st.redo.push(st.strokes.pop()); store(); redraw(); } };
    $('#bdRedo').onclick = () => { if (st.redo.length) { st.strokes.push(st.redo.pop()); store(); redraw(); } };
    let armed = 0; $('#bdClear').onclick = () => { if (Date.now() - armed < 2500) { st.strokes = []; st.redo = []; store(); redraw(); $('#bdClear').textContent = '🗑 Clear'; armed = 0; } else { armed = Date.now(); $('#bdClear').textContent = 'Tap again to clear'; setTimeout(() => { $('#bdClear').textContent = '🗑 Clear'; }, 2500); } };
    $('#bdSave').onclick = () => { const a = document.createElement('a'); a.download = `Chapter${ch.n}_board.png`; a.href = cv.toDataURL('image/png'); a.click(); };
    $('#bdFull').onclick = () => { const el = document.querySelector('.bd-page'); if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); else document.exitFullscreen(); };
    document.addEventListener('fullscreenchange', () => setTimeout(fit, 120));
    document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); $('#bdUndo').click(); } });
    $('#bdBg').textContent = st.dark ? '⬜ White' : '⬛ Black'; $('#bdPaper').textContent = { blank: '▦ Grid', grid: '☰ Lines', lines: '▢ Blank' }[st.paper];
    drawCols(); new ResizeObserver(fit).observe(wrap); fit();
  }
  bindChooser();
})();
