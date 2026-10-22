/* Borgo Verde – print-and-play sheets.
 * Lays out every piece of the game on A4 pages, ready to cut out. Pages that
 * hold double-sided pieces are followed by their back, mirrored left to right
 * so that it lands behind the front when printed duplex (long-edge flip). */
(function () {
  'use strict';
  const BV = window.BV, C = BV.CONFIG, CAT = BV.CATALOG, t = BV.i18n.t;

  // Sizes in millimetres.
  const AREA = { x: 8, y: 10, w: 194, h: 279 };   // printable area, centred on A4
  const T = 32;                                     // land tile; a district is 3 × 3 tiles
  const LABEL = 5, GAP = 4;
  const ROLE = { w: 50, h: 50 * 220 / 160 };        // same ratio as the role art
  const CARD = { w: 48, h: 74 };

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const asset = id => `assets/tiles/${id}.svg?v=${C.version}`;
  const repeat = (n, fn) => Array.from({ length: n }, fn);

  // ------------------------------------------------------------ pieces
  function tile(img, name, cls = '') {
    return `<div class="pp-tile ${cls}"><img src="${asset(img)}" alt="">${name ? `<span class="pp-band">${esc(name)}</span>` : ''}</div>`;
  }
  function cloud(n) {
    return `<svg class="pp-cloud" viewBox="0 0 36 30" aria-hidden="true"><path d="M6 22 a8 8 0 0 1 2-15 a10 10 0 0 1 18-2 a8 8 0 0 1 8 10 a6 6 0 0 1-2 7z" fill="#3a3a3a" stroke="#fff" stroke-width="1.5"/><text x="19" y="19" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">${n}</text></svg>`;
  }
  function leaf() {
    return `<svg class="pp-leaf" viewBox="0 0 36 32" aria-hidden="true"><path d="M4 26 C4 8 18 2 34 2 C34 18 26 30 8 30 Z" fill="#a5d6a7" stroke="#fff" stroke-width="1.5"/><path d="M6 28 L28 8" stroke="#fff" stroke-width="1.5"/></svg>`;
  }
  function stars() {
    return `<svg class="pp-stars" viewBox="0 0 40 40" aria-hidden="true">${repeat(12, (_, i) => {
      const a = i * Math.PI / 6, x = 20 + 14 * Math.cos(a), y = 20 + 14 * Math.sin(a);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#ffcc00"/>`;
    }).join('')}<circle cx="20" cy="20" r="7" fill="#e0b43a" stroke="#fff" stroke-width="1.2"/></svg>`;
  }
  function back(cls, icon, label) {
    return `<div class="pp-back ${cls}">${icon}<b>${esc(t('app.title'))}</b><span>${esc(label)}</span></div>`;
  }
  function municipio(m) {
    return `<div class="pp-mun"><img src="${asset(CAT.municipi[m].id)}" alt=""><span class="pp-ribbon">${esc(t(`municipio.${m}.short`))}</span></div>`;
  }
  function investment(c) {
    return `<div class="pp-card"><div class="pp-card-img"><img src="${asset(c.id)}" alt=""><span class="pp-band">${esc(t(`tile.${c.id}.name`))}</span></div>
      <p class="pp-printed">${esc(t(`tile.${c.id}.text`))}</p><p>${esc(t(`tile.${c.id}.effect`))}</p></div>`;
  }
  function role(r) {
    return `<div class="pp-role"><img src="${asset('ruolo_' + r)}" alt=""><div class="pp-role-text">
      <b>${esc(t(`role.${r}.name`))}</b>
      <p><em>${esc(t('print.everyone'))}:</em> ${esc(t(`role.${r}.action`))}</p>
      <p><em>${esc(t('print.privilege'))}:</em> ${esc(t(`role.${r}.privilege`))}</p></div></div>`;
  }
  function disc(cls, text, color) {
    return `<div class="pp-disc ${cls}" ${color ? `style="--c:${color}"` : ''}><span>${esc(text)}</span></div>`;
  }
  function track(title, cols, cells, cls = '') {
    return `<div class="pp-track ${cls}"><h4>${esc(title)}</h4>
      <div class="pp-cells" style="grid-template-columns:repeat(${cols},1fr)">${cells.map(c => `<span class="${c.cls || ''}">${esc(c.text)}</span>`).join('')}</div></div>`;
  }
  function personalTrack(m) {
    const cells = repeat(C.baseEmissions + 1, (_, n) => `<span>${n}</span>`).join('');
    return `<div class="pp-ptrack" style="--c:${CAT.municipi[m].color}"><b>${esc(t(`municipio.${m}.short`))}</b>${cells}</div>`;
  }

  // ------------------------------------------------------------ groups
  // Each group lists its pieces ({ w, h, front, back?, round? }); `gap` is
  // the space between pieces (0 = butted, so one cut separates two pieces).
  function groups() {
    const copies = (list, fn) => list.flatMap(x => repeat(x.copies || 1, () => fn(x)));
    const years = repeat(C.lastYear - C.firstYear + 1, (_, i) => ({ text: String(C.firstYear + i) }));
    const maxCity = C.baseEmissions * C.municipi.length;
    return [
      { key: 'network', items: C.networks.flatMap(net => C.municipi.map(() => ({
        w: 3 * T, h: T, front: tile(`rete_${net}_front`, '', 'wide'), back: tile(`rete_${net}_back`, '', 'wide') }))) },
      { key: 'buildings', items: copies(CAT.buildings, b => ({
        w: T, h: T, front: tile(b.id + '_front', t(`tile.${b.id}.front.name`)), back: tile(b.id + '_back', t(`tile.${b.id}.back.name`)) })) },
      { key: 'grey', items: copies(CAT.grey, g => ({
        w: T, h: T, front: tile(g.id, t(`tile.${g.id}.name`)), back: back('pp-back-grey', cloud(g.emission), t('print.backGrey')) })) },
      { key: 'infra', items: copies(CAT.infra, i => ({
        w: T, h: T, front: tile(i.id, t(`tile.${i.id}.name`)), back: back('pp-back-infra', leaf(), t('print.backInfra')) })) },
      { key: 'investments', items: CAT.investments.map(c => ({
        w: CARD.w, h: CARD.h, front: investment(c), back: back('pp-back-inv', stars(), t('print.backInvestment')) })) },
      { key: 'municipi', items: C.municipi.map(m => ({ w: 3 * T, h: 3 * T, front: municipio(m) })) },
      { key: 'roles', items: C.roles.map(r => ({ w: ROLE.w, h: ROLE.h, front: role(r) })) },
      { key: 'tracks', gap: GAP, items: [
        { w: 190, h: 5 + 10 * 11.5, front: track(`${t('ui.points')} · ${t('print.scoreNote')}`, 10,
          repeat(100, (_, n) => ({ text: n, cls: n % 10 === 0 ? 'ten' : n % 5 === 0 ? 'five' : '' })), 'pp-score') },
        { w: 190, h: 5 + Math.ceil((maxCity + 1) / 10) * 10, front: track(t('ui.cityEmissions'), 10,
          repeat(maxCity + 1, (_, n) => ({ text: n, cls: n % 10 === 0 ? 'ten' : '' }))) }
      ] },
      { key: 'playerTracks', gap: 2, items: [
        { w: 6 * 30, h: 5 + 10, front: track(t('ui.year'), 6, years, 'pp-years') },
        ...C.municipi.map(m => ({ w: 24 + (C.baseEmissions + 1) * 11, h: 12, front: personalTrack(m) }))
      ] },
      { key: 'tokens', gap: 3, items: [
        ...C.networks.map(net => ({ w: 22, h: 22, round: true, front: `<img class="pp-img" src="${asset('token_rete_' + net)}" alt="">` })),
        { w: 22, h: 22, round: true, front: `<img class="pp-img" src="${asset('token_chiave')}" alt="">` },
        { w: 12, h: 12, round: true, front: disc('pp-year', t('print.yearMarker')) },
        { w: 12, h: 12, round: true, front: disc('pp-threshold', t('print.thresholdMarker')) }
      ] },
      { key: 'markers', gap: 3, items: C.municipi.flatMap(m => [
        { w: 9, h: 9, front: disc('pp-cube', 'CO₂', CAT.municipi[m].color) },
        { w: 9, h: 9, round: true, front: disc('pp-pawn', '★', CAT.municipi[m].color) }
      ]) },
      { key: 'coins', gap: 1, items: [
        ...repeat(40, () => ({ w: 16, h: 16, round: true, front: disc('pp-coin', '1') })),
        ...repeat(10, () => ({ w: 16, h: 16, round: true, front: disc('pp-coin five', '5') }))
      ] }
    ];
  }

  // Rows are filled left to right. A group goes whole on the first page with
  // room for it; otherwise it continues from the last page, overflowing onto
  // new ones, so small groups fill the gaps left by the large ones.
  function layout(list) {
    const pages = [];
    const newPage = () => { const p = { y: 0, group: null, labels: [], items: [] }; pages.push(p); return p; };
    for (const g of list) {
      const gap = g.gap || 0, rows = [];
      let row = null;
      for (const it of g.items) {
        if (!row || row.w + gap + it.w > AREA.w) rows.push(row = { w: -gap, h: 0, items: [] });
        row.w += gap + it.w; row.h = Math.max(row.h, it.h); row.items.push(it);
      }
      const block = LABEL + rows.reduce((s, r) => s + r.h, 0) + gap * (rows.length - 1);
      const head = p => (p.y ? GAP : 0) + LABEL;
      let page = pages.find(p => p.y + head(p) + block <= AREA.h) || pages[pages.length - 1] || newPage();
      for (const r of rows) {
        const need = page.group === g.key ? gap + r.h : head(page) + r.h;
        if (page.y + need > AREA.h) page = newPage();
        if (page.group === g.key) page.y += gap;
        else {
          if (page.y) page.y += GAP;
          page.labels.push({ y: page.y, text: t(`print.group.${g.key}`) });
          page.y += LABEL;
          page.group = g.key;
        }
        let x = (AREA.w - r.w) / 2;
        for (const it of r.items) {
          page.items.push(Object.assign({ x, y: page.y + (r.h - it.h) / 2, group: g.key }, it));
          x += it.w + gap;
        }
        page.y += r.h;
      }
    }
    return pages;
  }

  // ------------------------------------------------------------ render
  const pos = (x, y, w, h) => `left:${(AREA.x + x).toFixed(2)}mm;top:${(AREA.y + y).toFixed(2)}mm;width:${w.toFixed(2)}mm;height:${h.toFixed(2)}mm`;

  function sheet(n, total, info, body) {
    return `<section class="sheet"><div class="sheet-head"><span>${esc(t('app.title'))} · ${esc(t('print.title'))}</span>
      <span>${esc(t('print.pageOf', { n, total }))} · ${esc(info)}</span></div>${body}</section>`;
  }

  function render() {
    const list = groups();
    const pages = layout(list);
    // Sheet 1 is the instructions, then each page followed by its back if it has one.
    const order = [];
    pages.forEach(p => { order.push({ page: p, back: false }); if (p.items.some(i => i.back)) order.push({ page: p, back: true }); });
    const total = order.length + 1;
    order.forEach((s, i) => { s.n = i + 2; if (!s.back) s.page.n = s.n; });
    const duplex = order.filter(s => s.back);
    const from = duplex.length ? duplex[0].n - 1 : 0, to = duplex.length ? duplex[duplex.length - 1].n : 0;

    const contents = list.map(g => {
      const nums = pages.filter(p => p.items.some(i => i.group === g.key)).map(p => p.n);
      return `<tr><td>${esc(t(`print.group.${g.key}`))}</td><td>${g.items.length}</td><td>${nums.join(', ')}</td></tr>`;
    }).join('');
    const intro = `<div class="pp-intro" style="${pos(0, 0, AREA.w, AREA.h)}">
      <h2>${esc(t('app.title'))} – ${esc(t('print.title'))}</h2>
      <p>${esc(t('print.intro'))}</p>
      <h3>${esc(t('print.howTo'))}</h3>
      <ol><li>${esc(t('print.step1'))}</li>${duplex.length ? `<li>${esc(t('print.step2', { from, to }))}</li>` : ''}
        <li>${esc(t('print.step3'))}</li><li>${esc(t('print.step4'))}</li><li>${esc(t('print.step5'))}</li></ol>
      <h3>${esc(t('print.needTitle'))}</h3><p>${esc(t('print.need'))}</p>
      <h3>${esc(t('print.contentsTitle'))}</h3>
      <table><thead><tr><th>${esc(t('print.piece'))}</th><th>${esc(t('print.quantity'))}</th><th>${esc(t('print.pages'))}</th></tr></thead>
        <tbody>${contents}</tbody></table>
      <p class="pp-note">${esc(t('print.threePlayers'))}</p></div>`;

    const html = [sheet(1, total, t('print.howTo'), intro)];
    for (const s of order) {
      const p = s.page;
      let body = '';
      if (!s.back) body += p.labels.map(l => `<div class="pp-label" style="${pos(0, l.y, AREA.w, LABEL)}">${esc(l.text)}</div>`).join('');
      for (const it of p.items) {
        if (s.back && !it.back) continue;
        const x = s.back ? AREA.w - it.x - it.w : it.x;
        body += `<div class="pp-item ${it.round ? 'round' : ''}" style="${pos(x, it.y, it.w, it.h)}">${s.back ? it.back : it.front}</div>`;
      }
      html.push(sheet(s.n, total, s.back ? t('print.backOf', { n: p.n }) : t('print.front'), body));
    }
    $('sheets').innerHTML = html.join('');
  }

  // ------------------------------------------------------------ page chrome
  function loadLang() {
    const q = new URLSearchParams(location.search).get('lang');
    let saved = null;
    try { saved = localStorage.getItem(C.ui.langKey); } catch (e) { /* storage blocked */ }
    return q || saved || ((navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en');
  }

  function applyLang(code) {
    BV.i18n.setLang(code);
    document.documentElement.lang = BV.i18n.lang;
    document.title = `${t('app.title')} – ${t('print.title')}`;
    $('pp-title').textContent = document.title;
    $('pp-lang-label').textContent = t('ui.language');
    $('pp-print').textContent = t('print.printBtn');
    $('pp-back').textContent = t('print.backToGame');
    $('pp-lang').innerHTML = BV.i18n.languages().map(c =>
      `<option value="${c}" ${c === BV.i18n.lang ? 'selected' : ''}>${esc(BV.LANG[c].meta.label)}</option>`).join('');
    render();
  }

  applyLang(loadLang());
  $('pp-lang').addEventListener('change', e => {
    try { localStorage.setItem(C.ui.langKey, e.target.value); } catch (err) { /* storage blocked */ }
    const url = new URL(location.href);
    url.searchParams.set('lang', e.target.value);
    history.replaceState(null, '', url);
    applyLang(e.target.value);
  });
  $('pp-print').addEventListener('click', () => window.print());
})();
