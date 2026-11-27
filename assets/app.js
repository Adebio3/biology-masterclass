(() => {
  const S = window.SITE, page = document.body.dataset.page, root = document.body.dataset.root || '.';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ytId = (u) => { const m = String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
  const has = (c) => ({ i: !!c.interactive, v: !!(c.videos && c.videos.length), b: !!(c.coursebook && c.coursebook.length), p: !!c.practice || !!(c.official && c.official.length) });
  const label = { ready: 'Ready', building: 'In progress', soon: 'Coming soon' };
  const card = (c, href) => { const open = c.status !== 'soon' && href;
    return `<${open ? 'a href="' + href + '"' : 'div'} class="ch2 ${c.status}" style="--c:${c.colour}"><span class="n">${c.n}</span><span class="t"><b>${esc(c.title)}</b>${c.summary ? `<small>${esc(c.summary)}</small>` : ''}</span>${c.status === 'ready' ? '<span class="go">›</span>' : `<span class="badge ${c.status}">${label[c.status]}</span>`}</${open ? 'a' : 'div'}>`; };
  if (page === 'course') {
    const key = document.body.dataset.course, C = S.courses[key];
    const hero = document.querySelector('.hero'); if (hero && !document.querySelector('.backlink')) hero.insertAdjacentHTML('beforebegin', '<a class="backlink" href="../index.html">‹ Home</a>');
    $('#title').textContent = C.title; $('#code').textContent = 'Syllabus ' + C.code; $('#blurb').textContent = C.blurb;
    const groups = {}; C.chapters.forEach((c) => (groups[c.level] = groups[c.level] || []).push(c));
    $('#chapters').innerHTML = Object.entries(groups).map(([lv, list]) => `<section class="sec"><h2>${lv === 'AS' ? 'AS Level' : lv === 'IGCSE' ? 'Topics' : lv}</h2><div class="grid2">${list.map((c) => card(c, `chapter.html?c=${c.n}`)).join('')}</div></section>`).join('');
  }
  if (page === 'chapter') {
    const C = S.courses[document.body.dataset.course], n = +(new URLSearchParams(location.search).get('c') || 1), c = C.chapters.find((x) => x.n === n) || C.chapters[0];
    document.title = `Chapter ${c.n} ${c.title} · ${S.brand}`; document.body.style.setProperty('--c', c.colour);
    $('#crumb').textContent = 'Chapter ' + c.n;
    const vids = (c.videos || []).map((v) => { const id = ytId(v.url); return `<div><div class="vid">${id ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>` : ''}</div><p class="vcap">${esc(v.title)}${id ? '' : ` · <a href="${esc(v.url)}">open</a>`}</p></div>`; }).join('');
    const links = (arr, ic) => arr && arr.length ? `<ul class="list">${arr.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${ic} ${esc(x.title)}</a></li>`).join('')}</ul>` : '';
    const key = 'bm.out.' + document.body.dataset.course + '.' + c.n; let done = {}; try { done = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    const prev = C.chapters.find((x) => x.n === c.n - 1), next = C.chapters.find((x) => x.n === c.n + 1);
    const R = (href, ic, t, d, opt = {}) => href ? `<a class="res" href="${esc(href)}" ${opt.ext ? 'target="_blank" rel="noopener"' : ''}><span class="ico">${ic}</span><span class="rt"><b>${t}</b><small>${d}</small></span><span class="go">›</span></a>` : `<div class="res off"><span class="ico">${ic}</span><span class="rt"><b>${t}</b><small>Coming soon</small></span></div>`;
    const nv = (c.videos || []).length, ready = c.status === 'ready';
    const nOut = (c.outcomes || []).length;
    $('#main').innerHTML = `
      <a class="backlink" href="index.html">‹ All chapters</a>
      <div class="chband"><div class="chband-in"><div class="chnum">${c.n}</div><div><div class="kick">Chapter ${c.n} · ${c.level} · Syllabus ${C.code}</div><h1>${esc(c.title)}</h1><p>${esc(c.summary || '')}</p></div></div>
        <nav class="chpn">${prev ? `<a href="chapter.html?c=${prev.n}" aria-label="Previous chapter">‹ ${prev.n}</a>` : ''}${next ? `<a href="chapter.html?c=${next.n}" aria-label="Next chapter">${next.n} ›</a>` : ''}</nav></div>
      <div class="groups">
        <section class="group"><h2><span>1</span> Learn</h2>
          ${R(c.interactive, '🧪', 'Interactive lesson', 'Lessons, simulations, quiz and class games')}
          ${R(nv ? '#videos' : '', '🎬', 'Videos', nv + (nv === 1 ? ' animated video' : ' animated videos'))}
          ${R(c.coursebook && c.coursebook.length ? c.coursebook[0].url : '', '📘', 'Coursebook', 'Read online or download the PDF', { ext: 1 })}
        </section>
        <section class="group"><h2><span>2</span> Revise</h2>
          ${R(ready ? `flashcards.html?c=${c.n}` : '', '🃏', 'Flashcards', 'Key terms: flip, shuffle, track progress')}
          ${R(ready ? `mindmap.html?c=${c.n}` : '', '🧠', 'Mind map', 'The whole chapter on one page')}
          ${R(ready ? `board.html?c=${c.n}` : '', '✏️', 'Board', 'Write and draw: white or black board')}
          ${R(nOut ? '#checklist' : '', '✅', 'Syllabus checklist', nOut + ' learning outcomes to tick off')}
        </section>
        <section class="group"><h2><span>3</span> Practise</h2>
          ${R(c.practice, '📝', 'Topic questions', c.n >= 12 ? 'Multiple choice and Paper 4 style, with mark schemes' : 'Paper 1 and Paper 2 style, with mark schemes')}
          ${R('#papers', '📄', 'Past papers', 'Official Cambridge papers for this topic')}
        </section>
      </div>
      ${nv ? `<section class="sec" id="videos"><h2>Videos</h2><div class="videos">${vids}</div></section>` : ''}
      ${nOut ? `<section class="sec" id="checklist"><details class="ck"${location.hash === '#checklist' ? ' open' : ''}><summary><h2 style="margin:0">Syllabus checklist</h2><span class="ckc" id="ckc"></span></summary><p class="note" style="margin-top:12px">Tick each learning outcome when you can do it. Your ticks are saved on this device.</p><div class="prog"><i id="pbar"></i></div><ul class="outcomes">${c.outcomes.map((o, i) => `<li><label><input type="checkbox" data-i="${i}" ${done[i] ? 'checked' : ''}> <span>${esc(o)}</span></label></li>`).join('')}</ul></details></section>` : ''}
      <section class="sec" id="papers"><details class="ck"${location.hash === '#papers' ? ' open' : ''}><summary><h2 style="margin:0">Official past papers</h2></summary>
        ${links(c.official, '📄')}<p class="note" style="margin-top:12px">Official past papers and mark schemes are © Cambridge University Press &amp; Assessment, so they are not reproduced here. Teachers can download them from the <a href="${S.supportHub}" target="_blank" rel="noopener">School Support Hub</a>. For original exam-style questions on this chapter, use <b>Topic questions</b> above.</p></details></section>
      <nav class="pn">${prev ? `<a class="btn" href="chapter.html?c=${prev.n}">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="btn" href="chapter.html?c=${next.n}">${esc(next.title)} →</a>` : ''}</nav>`;
    document.querySelectorAll('a.res[href^="#"]').forEach((l) => l.addEventListener('click', () => { const d = document.querySelector(l.getAttribute('href') + ' details'); if (d) d.open = true; }));
    const upd = () => { const bs = [...document.querySelectorAll('.outcomes input')]; const k = bs.filter((b) => b.checked).length; const p = $('#pbar'); if (p) p.style.width = (bs.length ? k / bs.length * 100 : 0) + '%'; const cc = $('#ckc'); if (cc) cc.textContent = k + ' / ' + bs.length; };
    document.querySelectorAll('.outcomes input').forEach((b) => b.addEventListener('change', () => { done[b.dataset.i] = b.checked; try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {} upd(); })); upd();
  }
  if (page === 'home') {
    const A = S.courses.alevel; const ready = A.chapters.filter((c) => c.status === 'ready').length;
    $('#alstat').textContent = `${ready} of ${A.chapters.length} chapters ready`;
  }
  document.querySelectorAll('[data-brand]').forEach((e) => (e.textContent = S.brand));
  document.querySelectorAll('[data-yt]').forEach((e) => (e.href = S.youtube));
  const y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
