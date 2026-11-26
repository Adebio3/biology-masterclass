(() => {
  const S = window.SITE, page = document.body.dataset.page, root = document.body.dataset.root || '.';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ytId = (u) => { const m = String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
  const has = (c) => ({ i: !!c.interactive, v: !!(c.videos && c.videos.length), b: !!(c.coursebook && c.coursebook.length), p: !!c.practice || !!(c.official && c.official.length) });
  const label = { ready: 'Ready', building: 'In progress', soon: 'Coming soon' };
  const card = (c, href) => { const h = has(c); const open = c.status !== 'soon' && href;
    return `<${open ? 'a href="' + href + '"' : 'div'} class="ch ${c.status}" style="--c:${c.colour}"><span class="num">Chapter ${c.n} · ${c.level} <span class="badge ${c.status}">${label[c.status]}</span></span><h3>${esc(c.title)}</h3>${c.summary ? `<p>${esc(c.summary)}</p>` : ''}${c.status !== 'soon' ? `<div class="icons"><span class="pill ${h.i ? '' : 'off'}">🧪 Interactive</span><span class="pill ${h.v ? '' : 'off'}">🎬 Videos</span><span class="pill ${h.b ? '' : 'off'}">📘 Notes</span><span class="pill ${h.p ? '' : 'off'}">📝 Practice</span></div>` : ''}</${open ? 'a' : 'div'}>`; };
  if (page === 'course') {
    const key = document.body.dataset.course, C = S.courses[key];
    $('#title').textContent = C.title; $('#code').textContent = 'Syllabus ' + C.code; $('#blurb').textContent = C.blurb;
    const groups = {}; C.chapters.forEach((c) => (groups[c.level] = groups[c.level] || []).push(c));
    $('#chapters').innerHTML = Object.entries(groups).map(([lv, list]) => `<section class="sec"><h2>${lv === 'AS' ? 'AS Level' : lv === 'IGCSE' ? 'Topics' : lv}</h2><div class="grid">${list.map((c) => card(c, `chapter.html?c=${c.n}`)).join('')}</div></section>`).join('');
  }
  if (page === 'chapter') {
    const C = S.courses[document.body.dataset.course], n = +(new URLSearchParams(location.search).get('c') || 1), c = C.chapters.find((x) => x.n === n) || C.chapters[0];
    document.title = `Chapter ${c.n} ${c.title} · ${S.brand}`; document.body.style.setProperty('--c', c.colour);
    $('#crumb').textContent = 'Chapter ' + c.n;
    const vids = (c.videos || []).map((v) => { const id = ytId(v.url); return `<div><div class="vid">${id ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>` : ''}</div><p class="vcap">${esc(v.title)}${id ? '' : ` · <a href="${esc(v.url)}">open</a>`}</p></div>`; }).join('');
    const links = (arr, ic) => arr && arr.length ? `<ul class="list">${arr.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${ic} ${esc(x.title)}</a></li>`).join('')}</ul>` : '';
    const key = 'bm.out.' + document.body.dataset.course + '.' + c.n; let done = {}; try { done = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    const prev = C.chapters.find((x) => x.n === c.n - 1), next = C.chapters.find((x) => x.n === c.n + 1);
    $('#main').innerHTML = `
      <div class="chhero"><div class="num">Chapter ${c.n} · ${c.level} · Syllabus ${C.code} <span class="badge ${c.status}">${label[c.status]}</span></div><h1>${esc(c.title)}</h1><p>${esc(c.summary || '')}</p></div>
      <div class="tiles">
        <div class="tile"><div class="ic">🧪</div><h3>Interactive lesson</h3><p>Guided lessons with check questions, live simulations, teacher mode, an exam-style quiz and class games. Works offline on phones.</p><div class="row">${c.interactive ? `<a class="btn pri" href="${esc(c.interactive)}">Open interactive</a><a class="btn" href="${esc(c.interactive)}" download>Download</a>` : '<span class="empty">Being built: coming soon</span>'}</div></div>
        <div class="tile"><div class="ic">🎬</div><h3>Animated videos</h3><p>Short animated explanations of the hardest processes in this chapter.</p><div class="row">${c.videos && c.videos.length ? `<a class="btn pri" href="#videos">Watch (${c.videos.length})</a>` : ''}<a class="btn" href="${S.youtube}" target="_blank" rel="noopener">YouTube channel</a></div></div>
        <div class="tile"><div class="ic">📘</div><h3>Coursebook and notes</h3><p>The full coursebook chapter: explanations, worked examples, practice and answers. Print it or read it on screen.</p><div class="row">${c.coursebook && c.coursebook.length ? `<a class="btn pri" href="${esc(c.coursebook[0].url)}" target="_blank" rel="noopener">Read</a><a class="btn" href="${esc(c.coursebook[0].url)}" download>Download</a>` : '<span class="empty">Coming soon</span>'}</div></div>
        <div class="tile"><div class="ic">📝</div><h3>Topic exam practice</h3><p>Paper 1 (multiple choice) and Paper 2 (structured) questions on this chapter, with mark schemes.</p><div class="row">${c.practice ? `<a class="btn pri" href="${esc(c.practice)}">Practice questions</a>` : ''}<a class="btn" href="#papers">Past papers</a></div></div>
      </div>
      ${c.outcomes ? `<section class="sec"><h2>Syllabus checklist</h2><p class="note">Tick each learning outcome when you can do it. Your ticks are saved on this device.</p><div class="prog"><i id="pbar"></i></div><ul class="outcomes">${c.outcomes.map((o, i) => `<li><label><input type="checkbox" data-i="${i}" ${done[i] ? 'checked' : ''}> <span>${esc(o)}</span></label></li>`).join('')}</ul></section>` : ''}
      <section class="sec" id="videos"><h2>🎬 Videos</h2>${vids ? `<div class="videos">${vids}</div>` : `<p class="empty">Videos for this chapter are in production. Subscribe at <a href="${S.youtube}" target="_blank" rel="noopener">${S.youtube.replace('https://www.', '')}</a>.</p>`}</section>
      <section class="sec" id="notes"><h2>📘 Coursebook and notes</h2>${links(c.coursebook, '📄') || '<p class="empty">Coming soon.</p>'}</section>
      <section class="sec" id="papers"><h2>📝 Exam practice</h2>
        ${c.practice ? `<ul class="list"><li><a href="${esc(c.practice)}">✍️ Topic questions: Paper 1 and Paper 2 style, with mark schemes</a></li></ul>` : '<p class="empty">Topic questions coming soon.</p>'}
        <h3 style="margin-top:18px;font-size:17px">Official Cambridge past papers on this topic</h3>
        ${links(c.official, '📄') || ''}<p class="note">Official past papers and mark schemes are © Cambridge University Press &amp; Assessment. Teachers can download them from the <a href="${S.supportHub}" target="_blank" rel="noopener">School Support Hub</a>.</p></section>
      <nav class="pn">${prev ? `<a class="btn" href="chapter.html?c=${prev.n}">← Chapter ${prev.n}</a>` : '<span></span>'}${next ? `<a class="btn" href="chapter.html?c=${next.n}">Chapter ${next.n} →</a>` : ''}</nav>`;
    const upd = () => { const bs = [...document.querySelectorAll('.outcomes input')]; const k = bs.filter((b) => b.checked).length; const p = $('#pbar'); if (p) p.style.width = (bs.length ? k / bs.length * 100 : 0) + '%'; };
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
