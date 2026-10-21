/* Borgo Verde – application shell: setup screen, saving, year-end and final screens. */
(function () {
  'use strict';
  const BV = window.BV;
  const C = BV.CONFIG;
  const E = BV.engine;
  const t = (k, p) => BV.i18n.t(k, p);
  const esc = BV.ui.esc;
  const $ = id => document.getElementById(id);

  let state = null;
  let setupDraft = { playerCount: 4, names: [], seed: '', minutes: String(C.turnTimeLimit / 60) };

  // ------------------------------------------------------------- storage

  function store(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage unavailable: the game still works */ }
  }
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function savedGame() {
    const raw = load(C.ui.storageKey);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      return s && s.version === E.STATE_VERSION && s.players ? s : null;
    } catch (e) { return null; }
  }
  function save() { store(C.ui.storageKey, state ? JSON.stringify(state) : null); }

  // ------------------------------------------------------------- modal

  function openModal(html, cls) {
    BV.ui.hideTip();
    const card = $('modal-card');
    card.className = 'modal-card ' + (cls || '');
    card.innerHTML = html;
    $('modal').hidden = false;
    const focus = card.querySelector('[autofocus], .btn-primary, button, input');
    if (focus) focus.focus();
  }
  function closeModal() { $('modal').hidden = true; }

  // -------------------------------------------------------------- chrome

  function applyLanguage() {
    document.documentElement.lang = BV.i18n.lang;
    document.title = t('app.title');
    $('app-title').textContent = t('app.title');
    $('btn-new').textContent = t('ui.newGame');
    $('btn-results').textContent = t('ui.showResults');
    $('btn-manual').textContent = t('ui.manual');
    $('manual-close').textContent = t('ui.close');
    if (!$('manual').hidden) renderManual();
    $('lang-label-text').textContent = t('ui.language');
    const sel = $('lang-select');
    sel.innerHTML = BV.i18n.languages().map(code =>
      `<option value="${code}" ${code === BV.i18n.lang ? 'selected' : ''}>${esc(BV.LANG[code].meta.label)}</option>`).join('');
    $('btn-results').hidden = !(state && state.phase === 'GAME_OVER');
    BV.ui.render();
  }

  // --------------------------------------------------------------- setup

  function defaultName(i) {
    return t('ui.defaultPlayer', { n: i + 1 });
  }

  function setupHtml() {
    const saved = savedGame();
    const n = setupDraft.playerCount;
    const names = [];
    for (let i = 0; i < n; i++) {
      names.push(`<label class="field name-field" style="--pc:${BV.ui.color(i)}">
        <span>${esc(t('ui.playerName', { n: i + 1 }))} · ${esc(t(`municipio.${C.municipi[i]}.short`))}</span>
        <input type="text" maxlength="16" data-name="${i}" value="${esc(setupDraft.names[i] || '')}" placeholder="${esc(defaultName(i))}">
      </label>`);
    }
    return `<h2 class="setup-title">${esc(t('app.title'))}</h2>
      <p class="tagline">${esc(t('app.tagline'))}</p>
      ${saved ? `<div class="saved-box"><p>${esc(t('ui.savedInfo', { year: saved.year, players: saved.playerCount }))}</p>
        <button type="button" class="btn btn-primary" data-setup="resume">${esc(t('ui.resume'))}</button></div>` : ''}
      <form id="setup-form" class="setup-form">
        <fieldset class="field"><legend>${esc(t('ui.players'))}</legend>
          <div class="seg">${C.playerCounts.map(c => `<label><input type="radio" name="pc" value="${c}" ${c === n ? 'checked' : ''}><span>${c}</span></label>`).join('')}</div>
        </fieldset>
        ${names.join('')}
        <label class="field"><span>${esc(t('ui.timeLimit'))}</span>
          <input type="number" id="time-input" min="0" max="30" step="any" value="${esc(setupDraft.minutes)}">
          <small>${esc(t('ui.timeLimitHint'))}</small></label>
        <label class="field"><span>${esc(t('ui.seed'))}</span>
          <input type="text" inputmode="numeric" id="seed-input" value="${esc(setupDraft.seed)}" placeholder="—">
          <small>${esc(t('ui.seedHint'))}</small></label>
        <button type="submit" class="btn btn-primary btn-big">${esc(t('ui.start'))}</button>
        <button type="button" class="btn" data-setup="manual">${esc(t('ui.readManual'))}</button>
      </form>`;
  }

  function readDraft() {
    const form = $('setup-form');
    if (!form) return;
    const pc = form.querySelector('input[name="pc"]:checked');
    if (pc) setupDraft.playerCount = +pc.value;
    form.querySelectorAll('[data-name]').forEach(inp => { setupDraft.names[+inp.dataset.name] = inp.value.trim(); });
    setupDraft.seed = $('seed-input').value.trim();
    setupDraft.minutes = $('time-input').value.trim();
  }

  function showSetup() {
    openModal(setupHtml(), 'setup');
    const card = $('modal-card');
    card.querySelectorAll('input[name="pc"]').forEach(r => r.addEventListener('change', () => {
      readDraft();
      showSetup();
    }));
    $('setup-form').addEventListener('submit', e => {
      e.preventDefault();
      readDraft();
      startGame();
    });
    card.querySelector('[data-setup="manual"]').addEventListener('click', () => { readDraft(); openManual(); });
    const resume = card.querySelector('[data-setup="resume"]');
    if (resume) resume.addEventListener('click', () => {
      state = savedGame();
      closeModal();
      resetTimer();
      BV.ui.setState(state);
      applyLanguage();
      if (state.phase === 'GAME_OVER') showResults();
    });
  }

  function startGame() {
    const n = setupDraft.playerCount;
    const names = [];
    for (let i = 0; i < n; i++) names.push(setupDraft.names[i] || defaultName(i));
    const seedNum = setupDraft.seed !== '' && /^\d+$/.test(setupDraft.seed) ? +setupDraft.seed : null;
    const minutes = parseFloat(String(setupDraft.minutes).replace(',', '.'));
    const limit = isFinite(minutes) && minutes >= 0 ? Math.round(minutes * 60) : C.turnTimeLimit;
    state = E.createGame({ playerCount: n, names, seed: seedNum, autoPass: C.ui.autoPass, turnTimeLimit: limit });
    save();
    closeModal();
    resetTimer();
    BV.ui.setState(state);
    applyLanguage();
  }

  // ------------------------------------------------------------ actions

  function onAction(action) {
    const prev = state;
    try {
      state = E.applyAction(state, action);
    } catch (err) {
      console.error(err);
      return;
    }
    save();
    resetTimer();
    BV.ui.setState(state, prev);
    if (state.phase === 'GAME_OVER') {
      $('btn-results').hidden = false;
      setTimeout(showResults, 700);
    } else if (state.year !== prev.year) {
      setTimeout(() => showYearEnd(prev.year), 700);
    }
  }

  // ------------------------------------------------------------- timer
  // One timer per decision. It runs only while no window is open and the page is
  // visible; past the limit the deciding player loses points every few seconds.

  const timer = { elapsed: 0, charged: 0, last: 0 };

  function resetTimer() {
    timer.elapsed = 0;
    timer.charged = 0;
    timer.last = performance.now();
  }

  function tick() {
    const now = performance.now();
    const dt = (now - timer.last) / 1000;
    timer.last = now;
    const who = state && state.phase !== 'GAME_OVER' ? E.currentActor(state) : null;
    if (who == null || !state.turnTimeLimit) { BV.ui.updateTimer(null); return; }
    const paused = !$('modal').hidden || !$('manual').hidden || document.hidden;
    if (!paused) timer.elapsed += Math.min(dt, 1);
    const over = timer.elapsed - state.turnTimeLimit;
    const due = over > 0 ? Math.floor(over / C.timePenaltyEvery) : 0;
    if (due > timer.charged) {
      while (timer.charged < due) {
        state = E.applyTimePenalty(state, who);
        timer.charged++;
      }
      save();
      BV.ui.update(state);
    }
    BV.ui.updateTimer({
      limit: state.turnTimeLimit,
      elapsed: timer.elapsed,
      penalties: timer.charged * C.timePenaltyPoints,
      next: over > 0 ? C.timePenaltyEvery - (over % C.timePenaltyEvery) : C.timePenaltyEvery,
      paused
    });
  }

  // ------------------------------------------------------------ manual

  function renderManual() {
    const m = BV.MANUAL[BV.i18n.lang] || BV.MANUAL.it;
    $('manual-title').textContent = m.title;
    $('manual-toc').innerHTML = `<ol>${m.sections.map(sec =>
      `<li><a href="#m-${sec.id}" data-section="m-${sec.id}">${esc(sec.title)}</a></li>`).join('')}</ol>`;
    $('manual-content').innerHTML = m.sections.map(sec =>
      `<section id="m-${sec.id}"><h3>${esc(sec.title)}</h3>${sec.html}</section>`).join('');
  }

  function openManual() {
    BV.ui.hideTip();
    renderManual();
    $('manual').hidden = false;
    $('manual-content').scrollTop = 0;
    $('manual-close').focus();
  }

  function closeManual() { $('manual').hidden = true; }

  function showYearEnd(year) {
    const k = year - C.firstYear;
    const pen = state.players.some(p => p.timePenalty);
    const rows = state.players.map((p, i) => `<tr style="--pc:${BV.ui.color(i)}">
        <th scope="row"><span class="dot"></span>${esc(p.name)}</th>
        <td><span class="ico cloud">${p.emissionsHistory[k]}</span></td>
        <td>+${p.yearPoints[k]}</td>
        ${pen ? `<td>${p.timePenalty ? '−' + p.timePenalty : '—'}</td>` : ''}
        <td><span class="ico leaf">${p.score}</span></td>
        <td><span class="ico coin">${p.credits}</span></td></tr>`).join('');
    const events = state.log.filter(e => e.year === year &&
      ['log.networkCompleted', 'log.keyPasses'].indexOf(e.key) >= 0).map(e => `<li>${BV.ui.logText(e)}</li>`).join('');
    openModal(`<h2>${esc(t('ui.yearEnd', { year }))}</h2>
      <p class="city-line">${esc(t('ui.yearEndBody', { emissions: state.cityHistory[k], threshold: state.threshold }))}</p>
      <table class="score-table"><thead><tr><th>${esc(t('ui.player'))}</th><th>${esc(t('ui.emissions'))}</th>
        <th>${esc(t('ui.points'))}</th>${pen ? `<th>${esc(t('ui.timePenalty'))}</th>` : ''}<th>${esc(t('ui.subtotal'))}</th><th>${esc(t('ui.credits'))}</th></tr></thead>
        <tbody>${rows}</tbody></table>
      ${events ? `<ul class="events">${events}</ul>` : ''}
      <button type="button" class="btn btn-primary" id="btn-continue">${esc(t('ui.continue'))}</button>`, 'year-end');
    $('btn-continue').addEventListener('click', closeModal);
  }

  function showResults() {
    if (!state || !state.outcome) return;
    const o = state.outcome;
    const years = [];
    for (let y = C.firstYear; y <= C.lastYear; y++) years.push(y);
    const pen = state.players.some(p => p.timePenalty);
    const head = `<tr><th>${esc(t('ui.rank'))}</th><th>${esc(t('ui.player'))}</th>${years.map(y => `<th>${String(y).slice(2)}</th>`).join('')}
      ${pen ? `<th>${esc(t('ui.timePenalty'))}</th>` : ''}<th>${esc(t('ui.satelliteBonus'))}</th><th>${esc(t('ui.subtotal'))}</th>${o.citySuccess ? '' : `<th>${esc(t('ui.halved'))}</th>`}</tr>`;
    const body = o.ranking.map(r => {
      const p = state.players[r.player];
      return `<tr class="${r.rank === 1 ? 'winner' : ''}" style="--pc:${BV.ui.color(r.player)}">
        <td>${r.rank}</td><th scope="row"><span class="dot"></span>${esc(p.name)}</th>
        ${years.map((y, k) => `<td>${p.yearPoints[k] != null ? p.yearPoints[k] : '—'}</td>`).join('')}
        ${pen ? `<td>${p.timePenalty ? '−' + p.timePenalty : '—'}</td>` : ''}
        <td>${o.satelliteBonus[r.player] ? '+' + o.satelliteBonus[r.player] : '—'}</td>
        <td>${o.citySuccess ? `<b>${o.scoresBeforeHalving[r.player]}</b>` : o.scoresBeforeHalving[r.player]}</td>
        ${o.citySuccess ? '' : `<td><b>${o.finalScores[r.player]}</b></td>`}</tr>`;
    }).join('');
    const names = o.winners.map(i => esc(state.players[i].name)).join(', ');
    openModal(`<h2>${esc(t('ui.gameOver'))}</h2>
      <p class="city-result ${o.citySuccess ? 'ok' : 'ko'}">${esc(o.citySuccess
        ? t('ui.citySuccess', { emissions: o.cityEmissions, threshold: state.threshold })
        : t('ui.cityFailure', { emissions: o.cityEmissions, threshold: state.threshold }))}</p>
      <p class="winner-line">${o.winners.length > 1 ? t('ui.winners', { names }) : t('ui.winner', { names })}</p>
      ${o.citySuccess ? '' : `<p class="note">${esc(t('ui.partialWin'))}</p>`}
      <h3>${esc(t('ui.ranking'))}</h3>
      <div class="table-wrap"><table class="score-table final"><thead>${head}</thead><tbody>${body}</tbody></table></div>
      <div class="modal-actions">
        <button type="button" class="btn" id="btn-view">${esc(t('ui.viewBoard'))}</button>
        <button type="button" class="btn btn-primary" id="btn-again">${esc(t('ui.newGame'))}</button>
      </div>`, 'results');
    $('btn-view').addEventListener('click', closeModal);
    $('btn-again').addEventListener('click', () => { store(C.ui.storageKey, null); showSetup(); });
  }

  function onUi(what) {
    if (what === 'results') showResults();
  }

  // ---------------------------------------------------------------- init

  function init() {
    const lang = load(C.ui.langKey) || ((navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en');
    BV.i18n.setLang(lang);
    BV.ui.init({ onAction, onUi });

    $('lang-select').addEventListener('change', e => {
      readDraft();
      BV.i18n.setLang(e.target.value);
      store(C.ui.langKey, e.target.value);
      applyLanguage();
      if (!$('modal').hidden && $('modal-card').classList.contains('setup')) showSetup();
      else if (!$('modal').hidden && $('modal-card').classList.contains('results')) showResults();
    });
    $('btn-new').addEventListener('click', () => {
      if (state && state.phase !== 'GAME_OVER' && !window.confirm(t('ui.confirmNew'))) return;
      showSetup();
    });
    $('btn-results').addEventListener('click', showResults);
    $('btn-manual').addEventListener('click', openManual);
    $('manual-close').addEventListener('click', closeManual);
    $('manual').addEventListener('click', e => { if (e.target === $('manual')) closeManual(); });
    $('manual-toc').addEventListener('click', e => {
      const a = e.target.closest('[data-section]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.section).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('manual-content').addEventListener('click', e => {
      const a = e.target.closest('a[href^="#m-"]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.getAttribute('href').slice(1)).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('manual').hidden) closeManual(); });
    resetTimer();
    setInterval(tick, 250);
    $('modal').addEventListener('keydown', e => {
      if (e.key === 'Escape' && state && !$('modal-card').classList.contains('setup')) closeModal();
    });

    applyLanguage();
    showSetup();
  }

  // Exposed for debugging and automated checks.
  BV.app = {
    get state() { return state; },
    dispatch: onAction,
    load(s) { state = s; save(); closeModal(); resetTimer(); BV.ui.setState(state); applyLanguage(); },
    timer
  };

  init();
})();
