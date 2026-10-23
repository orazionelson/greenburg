/* Borgo Verde – rendering and board interaction.
 * The board is laid out at a fixed logical size and scaled to fit. */
(function () {
  'use strict';
  const BV = window.BV;
  const C = BV.CONFIG;
  const CAT = BV.CATALOG;
  const E = BV.engine;
  const t = (k, p) => BV.i18n.t(k, p);

  const M = 270;          // Municipio side (3 x 3 slots)
  const S = M / 3;        // network lane width = slot side
  const TAG = 42;         // room above/below for name tags
  const ASSETS = 'assets/tiles/';
  // The version in the URL makes browsers fetch new images after a release.
  const asset = name => `${ASSETS}${name}.svg?v=${C.version}`;

  const ui = {
    state: null,
    prev: null,
    selectedDisplay: null,
    logAll: false,
    onAction: null
  };

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // ------------------------------------------------------------- helpers

  function color(i) { return CAT.municipi[C.municipi[i]].color; }
  function playerName(i) { return ui.state.players[i].name; }
  function playerTag(i) {
    return `<b class="pname" style="--pc:${color(i)}">${esc(playerName(i))}</b>`;
  }
  function side(front) { return front ? 'front' : 'back'; }
  function buildingName(b) { return t(`tile.${b.tileId}.${side(b.side === 'grigio')}.name`); }
  function tileName(id) {
    return id.indexOf('ed_') === 0 ? t(`tile.${id}.front.name`) : t(`tile.${id}.name`);
  }
  function roleName(r) { return t(`role.${r}.name`); }
  function roleShort(r) {
    const s = t(`role.${r}.short`);
    return s === `role.${r}.short` ? roleName(r) : s;
  }
  function coin(n) { return `<span class="ico coin" aria-label="${esc(t('ui.cost'))}">${n}</span>`; }

  function logText(entry) {
    const p = Object.assign({}, entry.params);
    const map = {
      player: v => playerTag(v),
      role: v => esc(roleName(v)),
      tile: v => esc(tileName(v)),
      grey: v => esc(tileName(v)),
      network: v => esc(t(`network.${v}.name`)),
      investment: v => esc(t(`tile.${v}.name`))
    };
    Object.keys(p).forEach(k => { if (map[k]) p[k] = map[k](p[k]); });
    return t(entry.key, p);
  }

  function investmentFlags(i) {
    return E.ownedInvestments(ui.state, i).map(id =>
      `<img class="flag inv" src="${asset(id)}" alt="${esc(t(`tile.${id}.name`))}" title="${esc(t(`tile.${id}.name`))}" ${tip('investment', id)}>`).join('');
  }

  function legal() { return ui.state ? E.legalActions(ui.state) : []; }
  function actor() { return ui.state ? E.currentActor(ui.state) : null; }
  function actAttr(a) { return `data-act='${JSON.stringify(a)}'`; }

  // ------------------------------------------------------------ geometry

  // The common area lives outside the ring, so the ring is as tight as the
  // network tiles allow: on each side the gap between Municipi is one tile.
  function geometry(n) {
    const o = M / 2;
    if (n === 4) {
      const D = 2 * M;
      return {
        W: D + M, H: D + M + 2 * TAG,
        v: [[o, o + TAG], [o + D, o + TAG], [o + D, o + D + TAG], [o, o + D + TAG]]
      };
    }
    // On the 60° sides a square Municipio covers M/√3 of the line instead of M/2.
    const D = 2 * M + 2 * (M / Math.sqrt(3) - M / 2), h = D * Math.sqrt(3) / 2;
    return {
      W: D + M, H: h + M + 2 * TAG,
      v: [[o, o + TAG], [o + D, o + TAG], [o + D / 2, o + h + TAG]]
    };
  }

  // ---------------------------------------------------------------- tiles

  // Returns tooltip descriptor string for data-tip.
  function tip(...parts) { return `data-tip="${esc(parts.join('|'))}"`; }

  function tileImg(file, alt) {
    return `<img src="${asset(file)}" alt="${esc(alt)}" draggable="false">`;
  }

  function slotTile(slot) {
    if (slot.kind === 'grigia') {
      return { file: slot.tileId, name: tileName(slot.tileId), tip: tip('grey', slot.tileId) };
    }
    if (slot.kind === 'infrastruttura') {
      return { file: slot.tileId, name: tileName(slot.tileId), tip: tip('infra', slot.tileId) };
    }
    const front = slot.side === 'grigio';
    return {
      file: `${slot.tileId}_${side(front)}`, name: buildingName(slot),
      tip: tip('building', slot.tileId, slot.side)
    };
  }

  // Animation classes by comparing with the previous state.
  function slotAnim(pi, kind, k) {
    const prev = ui.prev;
    if (!prev || !prev.players[pi]) return { cls: '', ghost: '' };
    const before = prev.players[pi][kind][k];
    const now = ui.state.players[pi][kind][k];
    if (before.kind === 'grigia' && now.kind === 'infrastruttura') {
      return { cls: 'anim-place', ghost: `<div class="ghost fade">${tileImg(before.tileId, '')}</div>` };
    }
    if (before.kind === 'edificio' && before.side !== now.side) {
      return { cls: 'anim-flip', ghost: `<div class="ghost flip">${tileImg(`${before.tileId}_${side(before.side === 'grigio')}`, '')}</div>` };
    }
    return { cls: '', ghost: '' };
  }

  function renderMunicipio(g, pi) {
    const st = ui.state;
    const p = st.players[pi];
    const [cx, cy] = g.v[pi];
    const cur = actor() === pi;
    const acts = cur ? legal() : [];
    const sel = ui.selectedDisplay;

    // Slot order in the 3x3 grid: T1 T2 T3 / E1 crest E2 / T4 T5 T6.
    const grid = [['territorial', 0], ['territorial', 1], ['territorial', 2],
      ['buildings', 0], null, ['buildings', 1],
      ['territorial', 3], ['territorial', 4], ['territorial', 5]];

    const cells = grid.map((cell, gi) => {
      if (!cell) {
        return `<div class="crest" ${tip('municipio', p.municipio)}></div>`;
      }
      const [kind, k] = cell;
      const slot = p[kind][k];
      const tl = slotTile(slot);
      const an = slotAnim(pi, kind, k);
      let action = null;
      if (kind === 'territorial' && sel != null) {
        action = acts.find(a => a.type === 'placeInfra' && a.display === sel && a.slot === k);
      } else if (kind === 'buildings') {
        action = acts.find(a => a.type === 'reconvert' && a.slot === k);
      }
      const label = kind === 'territorial' ? CAT.slotLabels[k] : CAT.buildingLabels[k];
      return `<div class="slot slot-${gi}">
        <div class="tile ${an.cls} ${action ? 'selectable' : ''}" ${tl.tip}
          ${action ? `${actAttr(action)} role="button" tabindex="0"` : ''}
          aria-label="${esc(label + ': ' + tl.name)}">${tileImg(tl.file, tl.name)}</div>${an.ghost}</div>`;
    }).join('');

    const top = cy - M / 2, left = cx - M / 2;
    const tagAbove = cy < g.H / 2;
    const flags = (st.keyHolder === pi ? `<img class="flag" src="${asset(`token_chiave`)}" alt="${esc(t('ui.keyHolder'))}" title="${esc(t('ui.keyHolder'))}">` : '') +
      investmentFlags(pi);
    return `<div class="municipio ${cur ? 'current' : ''}" style="left:${left}px;top:${top}px;--pc:${color(pi)}">
        <img class="mun-bg" src="${asset(`mun_${p.municipio}`)}" alt="">
        <div class="mun-grid">${cells}</div>
      </div>
      <div class="name-tag ${tagAbove ? 'above' : 'below'} ${cur ? 'current' : ''}" style="left:${left - 50}px;top:${tagAbove ? top - TAG + 2 : top + M + 4}px;width:${M + 100}px;--pc:${color(pi)}">
        <span>${esc(p.name)} · ${esc(t(`municipio.${p.municipio}.short`))}</span>${flags}
      </div>`;
  }

  function renderSide(g, pi) {
    const st = ui.state;
    const n = st.playerCount;
    const [x1, y1] = g.v[pi];
    const [x2, y2] = g.v[(pi + 1) % n];
    const L = Math.hypot(x2 - x1, y2 - y1);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const p = st.players[pi];
    const acts = actor() === pi ? legal() : [];

    const lanes = C.networks.map(net => {
      const renewed = p.network[net] === 'rinnovata';
      const action = acts.find(a => a.type === 'renew' && a.network === net);
      let cls = '', ghost = '';
      const before = ui.prev && ui.prev.players[pi] && ui.prev.players[pi].network[net];
      if (before && before !== p.network[net]) {
        cls = 'anim-flip';
        ghost = `<div class="ghost flip net">${tileImg(`rete_${net}_front`, '')}</div>`;
      }
      const name = t(`network.${net}.${side(!renewed)}.name`);
      return `<div class="lane lane-${net} ${renewed ? 'renewed' : ''}">
        <div class="net-tile-wrap" style="left:${(L - M) / 2}px">
          <div class="net-tile ${cls} ${action ? 'selectable' : ''}" ${tip('network', net, p.network[net], pi)}
            ${action ? `${actAttr(action)} role="button" tabindex="0"` : ''}
            aria-label="${esc(name + ' – ' + p.name)}">${tileImg(`rete_${net}_${side(!renewed)}`, name)}</div>${ghost}
        </div></div>`;
    }).join('');

    return `<div class="side" style="left:${mx - L / 2}px;top:${my - S}px;width:${L}px;height:${2 * S}px;transform:rotate(${ang}rad);--pc:${color(pi)}">${lanes}</div>`;
  }

  function renderCityPanel() {
    const st = ui.state;
    const acts = legal();

    const years = [];
    for (let y = C.firstYear; y <= C.lastYear; y++) {
      years.push(`<li class="${y === st.year ? 'now' : y < st.year ? 'past' : ''}">${y}</li>`);
    }
    const max = st.playerCount * C.baseEmissions;
    const live = E.cityEmissions(st);
    const pct = v => (100 * v / max).toFixed(2) + '%';
    const city = `<div class="city-track" title="${esc(t('ui.cityEmissions'))}">
        <div class="city-head"><span>${esc(t('ui.cityEmissions'))}</span><b>${live}</b><span class="thr">${esc(t('ui.threshold'))} ${st.threshold}</span></div>
        <div class="bar"><div class="fill ${live <= st.threshold ? 'ok' : ''}" style="width:${pct(live)}"></div>
          <div class="threshold" style="left:${pct(st.threshold)}"></div></div>
      </div>`;

    const display = st.infraDisplay.map((id, d) => {
      const can = acts.some(a => a.type === 'placeInfra' && a.display === d);
      const cost = st.phase === 'ROLE_EXECUTION' && st.activeRole === 'urbanista' ? E.infraCost(st, actor(), id) : null;
      return `<div class="tile disp ${can ? 'selectable' : ''} ${ui.selectedDisplay === d ? 'selected' : ''}" ${tip('infra', id)}
          ${can ? `data-select-display="${d}" role="button" tabindex="0"` : ''} aria-label="${esc(tileName(id))}">
          ${tileImg(id, tileName(id))}${cost != null && can ? `<span class="pay">${coin(cost)}</span>` : ''}</div>`;
    }).join('');

    const roles = C.roles.map(r => {
      const chosen = st.rolesChosenThisYear.indexOf(r) >= 0;
      const action = acts.find(a => a.type === 'chooseRole' && a.role === r);
      const active = st.activeRole === r;
      const by = chosen ? chooserOf(r) : null;
      return `<div class="role-card ${chosen ? 'chosen' : ''} ${active ? 'active' : ''} ${action ? 'selectable' : ''}"
          ${tip('role', r)} ${action ? `${actAttr(action)} role="button" tabindex="0"` : ''}
          ${by != null ? `style="--pc:${color(by)}"` : ''} aria-label="${esc(roleName(r))}">
          <img src="${asset(`ruolo_${r}`)}" alt="" draggable="false">
          <span class="role-name">${esc(roleShort(r))}</span>
          ${st.roleCredits[r] ? `<span class="role-credits">${coin(st.roleCredits[r])}</span>` : ''}
          ${by != null ? `<span class="role-by">${esc(playerName(by))}</span>` : ''}
        </div>`;
    }).join('');

    const investments = st.investmentsOnTable.map(id => {
      const owner = st.investmentOwners[id];
      const name = t(`tile.${id}.name`);
      if (owner != null) {
        return `<div class="tile inv owned" ${tip('investment', id)} style="--pc:${color(owner)}" aria-label="${esc(name + ' – ' + playerName(owner))}">${tileImg(id, '')}<span class="owner">${esc(playerName(owner))}</span></div>`;
      }
      const buy = acts.find(a => a.type === 'buyInvestment' && a.id === id);
      return `<div class="tile inv ${buy ? 'selectable' : ''}" ${tip('investment', id)} ${buy ? `${actAttr(buy)} role="button" tabindex="0"` : ''} aria-label="${esc(name)}">${tileImg(id, name)}</div>`;
    }).join('');
    const tokens = C.networks.map(net => `<div class="token ${st.networkCompleted[net] ? 'done' : ''}" ${tip('token', net)}>
        <img src="${asset(`token_rete_${net}`)}" alt="${esc(t(`network.${net}.token`))}"></div>`).join('');

    // Below 1200px the roles move to the top of the sidebar, next to the action panel.
    const rolesHtml = `<h3>${esc(t('ui.roles'))}</h3><div class="cp-cards">${roles}</div>`;
    const side = compact();
    $('roles-side').hidden = !side;
    $('roles-side').innerHTML = side ? rolesHtml : '';
    $('city-panel').innerHTML = `
      <div class="cp-block cp-time">
        <ol class="year-track" aria-label="${esc(t('ui.year'))}">${years.join('')}</ol>${city}
      </div>
      <div class="cp-block cp-extras">
        <h3>${esc(t('ui.investments'))} · ${esc(t('ui.networks'))}</h3>
        <div class="cp-row"><div class="cp-invest">${investments}</div><div class="tokens">${tokens}</div></div>
      </div>
      <div class="cp-block cp-display">
        <h3>${esc(t('ui.display'))} <span class="deck-count">${esc(t('ui.deck', { n: st.infraDeck.length }))}</span></h3>
        <div class="cp-tiles" aria-label="${esc(t('ui.display'))}">${display || '<span class="empty">—</span>'}</div>
      </div>
      ${side ? '' : `<div class="cp-block cp-roles">${rolesHtml}</div>`}`;
  }

  const compactQuery = window.matchMedia('(max-width: 1199px)');
  function compact() { return compactQuery.matches; }

  function chooserOf(role) {
    // The log records who chose each role this year.
    const st = ui.state;
    for (let i = st.log.length - 1; i >= 0; i--) {
      const e = st.log[i];
      if (e.year !== st.year) break;
      if (e.key === 'log.chooseRole' && e.params.role === role) return e.params.player;
    }
    return null;
  }

  function renderBoard() {
    const st = ui.state;
    const g = geometry(st.playerCount);
    const board = $('board');
    board.style.width = g.W + 'px';
    board.style.height = g.H + 'px';
    board.style.setProperty('--m', M + 'px');
    board.style.setProperty('--s', S + 'px');
    let html = '';
    for (let i = 0; i < st.playerCount; i++) html += renderSide(g, i);
    for (let i = 0; i < st.playerCount; i++) html += renderMunicipio(g, i);
    board.innerHTML = html;
    board.dataset.players = st.playerCount;
    fitBoard();
  }

  function fitBoard() {
    if (!ui.state) return;
    const g = geometry(ui.state.playerCount);
    const area = $('board-area');
    const scaler = $('board-scaler');
    const pad = 12;
    const w = area.clientWidth - pad * 2;
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    const h = narrow ? Infinity : area.clientHeight - pad * 2;
    const s = Math.max(0.2, Math.min(w / g.W, h / g.H, 1.25));
    $('board').style.transform = `scale(${s})`;
    scaler.style.width = g.W * s + 'px';
    scaler.style.height = g.H * s + 'px';
  }

  // --------------------------------------------------------- action panel

  function renderActionPanel() {
    const st = ui.state;
    const el = $('action-panel');
    if (st.phase === 'GAME_OVER') {
      el.innerHTML = `<h2>${esc(t('ui.gameOver'))}</h2>
        <p>${esc(st.outcome.citySuccess ? t('ui.citySuccess', { emissions: st.cityEmissions, threshold: st.threshold })
          : t('ui.cityFailure', { emissions: st.cityEmissions, threshold: st.threshold }))}</p>
        <button type="button" class="btn btn-primary" data-ui="results">${esc(t('ui.showResults'))}</button>`;
      return;
    }
    const a = actor();
    const acts = legal();
    const head = `<div class="ap-head"><span class="ap-year">${esc(t('ui.year'))} ${st.year}</span>
      ${st.activeRole ? `<span class="ap-role">${esc(roleName(st.activeRole))} · ${playerTag(st.roleChooser)}</span>` : ''}</div>`;
    let body = '';
    const privilege = st.roleChooser === a && (st.activeRole === 'urbanista' || st.activeRole === 'lavori')
      ? `<p class="note">${esc(t('ui.privilegeNote'))}</p>` : '';

    if (st.phase === 'ROLE_SELECTION') {
      body = `<p class="prompt">${t('ui.chooseRolePrompt', { player: playerTag(a) })}</p>
        <div class="options">${acts.map(x => `<button type="button" class="opt role-opt" ${actAttr(x)}>
          <span class="opt-title">${esc(roleName(x.role))}${st.roleCredits[x.role] ? ' ' + coin(st.roleCredits[x.role]) : ''}</span>
          <span class="opt-sub"><b>${esc(t('ui.roleAction'))}:</b> ${esc(t(`role.${x.role}.action`))}<br><b>${esc(t('ui.rolePrivilege'))}:</b> ${esc(t(`role.${x.role}.privilege`))}</span>
        </button>`).join('')}</div>`;
    } else if (st.activeRole === 'urbanista') {
      if (ui.selectedDisplay != null && st.infraDisplay[ui.selectedDisplay]) {
        const id = st.infraDisplay[ui.selectedDisplay];
        body = `<p class="prompt">${t('ui.urbanistaSlotPrompt', { player: playerTag(a), tile: `<b>${esc(tileName(id))}</b>`, cost: E.infraCost(st, a, id) })}</p>
          <div class="options">${st.players[a].territorial.map((s, k) => {
            const x = acts.find(y => y.type === 'placeInfra' && y.display === ui.selectedDisplay && y.slot === k);
            return x ? `<button type="button" class="opt" ${actAttr(x)}>${CAT.slotLabels[k]} · ${esc(tileName(s.tileId))} <span class="ico cloud">−${s.emission}</span></button>` : '';
          }).join('')}</div>
          <button type="button" class="btn" data-ui="cancel">${esc(t('ui.cancel'))}</button>`;
      } else {
        const seen = {};
        body = `<p class="prompt">${t('ui.urbanistaPrompt', { player: playerTag(a) })}</p>
          <div class="options">${acts.filter(x => x.type === 'placeInfra' && !seen[x.display] && (seen[x.display] = true)).map(x => {
            const id = st.infraDisplay[x.display];
            return `<button type="button" class="opt" data-select-display="${x.display}">${esc(tileName(id))} · ${esc(t('family.' + CAT.infraById[id].family))} ${coin(E.infraCost(st, a, id))}</button>`;
          }).join('')}</div>`;
      }
      body += privilege;
    } else if (st.activeRole === 'lavori') {
      const p = st.players[a];
      body = `<p class="prompt">${t('ui.lavoriPrompt', { player: playerTag(a) })}</p>
        <div class="options">${acts.filter(x => x.type !== 'pass').map(x => {
          let label;
          if (x.type === 'reconvert') label = t('ui.reconvertOption', { tile: esc(buildingName(p.buildings[x.slot])), cost: coin(E.costFor(st, a, C.reconvertCost)) });
          else if (x.type === 'renew') label = t('ui.renewOption', { network: esc(t(`network.${x.network}.name`)), cost: coin(E.costFor(st, a, C.renewCost)) });
          else label = t('ui.investmentOption', { name: `<b>${esc(t(`tile.${x.id}.name`))}</b>`, cost: coin(E.costFor(st, a, CAT.investmentById[x.id].cost)) });
          return `<button type="button" class="opt" ${actAttr(x)}>${label}</button>`;
        }).join('')}</div>${privilege}
        ${acts.some(x => x.type === 'buyInvestment') ? `<p class="note">${esc(t('ui.investmentNote'))}</p>` : ''}`;
    }
    if (acts.some(x => x.type === 'pass')) {
      body += `<button type="button" class="btn btn-pass" ${actAttr({ type: 'pass' })}>${esc(t('ui.pass'))}</button>`;
    }
    el.innerHTML = head + `<div id="turn-timer" class="turn-timer" hidden></div>` + body;
    el.style.setProperty('--pc', a != null ? color(a) : 'transparent');
    updateTimer(ui.timer);
  }

  // -------------------------------------------------------------- players

  function renderPlayers() {
    const st = ui.state;
    const a = actor();
    $('players').innerHTML = st.players.map((p, i) => {
      const e = E.computeEmissions(st, i);
      return `<div class="player ${a === i ? 'current' : ''}" style="--pc:${color(i)}">
        <div class="p-head"><span class="p-name">${esc(p.name)}</span>
          <span class="p-mun">${esc(t(`municipio.${p.municipio}.short`))}</span>
          ${st.keyHolder === i ? `<img class="flag" src="${asset(`token_chiave`)}" alt="${esc(t('ui.keyHolder'))}" title="${esc(t('ui.keyHolder'))}">` : ''}
          ${investmentFlags(i)}
          ${a === i ? `<span class="p-turn">${esc(t('ui.current'))}</span>` : ''}</div>
        <dl class="p-stats">
          <div><dt>${esc(t('ui.credits'))}</dt><dd><span class="ico coin">${p.credits}</span></dd></div>
          <div><dt>${esc(t('ui.emissions'))}</dt><dd><span class="ico cloud">${e}</span></dd></div>
          <div><dt>${esc(t('ui.points'))}</dt><dd><span class="ico leaf">${p.score}</span></dd></div>
          <div><dt>${esc(t('ui.income'))}</dt><dd><span class="ico income">${E.incomeOf(p)}</span></dd></div>
        </dl>
        ${p.timePenalty ? `<p class="p-penalty">${esc(t('ui.timePenalty'))}: −${p.timePenalty}</p>` : ''}
        <div class="em-bar" title="${esc(t('ui.emissionsTrack', { value: e }))}"><div style="width:${(100 * e / C.baseEmissions).toFixed(1)}%"></div></div>
      </div>`;
    }).join('');
  }

  // ------------------------------------------------------------------ log

  function renderLog() {
    const st = ui.state;
    $('log-title').textContent = t('ui.log');
    $('log-toggle').textContent = ui.logAll ? t('ui.logYear') : t('ui.logAll');
    let lastYear = null;
    const items = st.log.filter(e => ui.logAll || e.year === st.year).map(e => {
      let sep = '';
      if (ui.logAll && e.year !== lastYear) { sep = `<li class="log-year">${e.year}</li>`; lastYear = e.year; }
      return `${sep}<li class="log-${e.key.replace('log.', '')}">${logText(e)}</li>`;
    });
    const ol = $('log');
    ol.innerHTML = items.join('');
    ol.scrollTop = ol.scrollHeight;
  }

  // -------------------------------------------------------------- tooltip

  function tipHtml(spec) {
    const st = ui.state;
    const [kind, a, b, c] = spec.split('|');
    let img = '', name = '', text = '', rows = [];
    const row = (k, v) => rows.push(`<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`);
    if (kind === 'grey') {
      const g = CAT.greyById[a];
      img = a; name = t(`tile.${a}.name`); text = t(`tile.${a}.text`);
      row(t('ui.emission'), `<span class="ico cloud">${g.emission}</span>`);
      row(t('ui.reduction'), `−${g.emission}`);
    } else if (kind === 'infra') {
      const fam = CAT.infraById[a].family;
      img = a; name = t(`tile.${a}.name`); text = t(`tile.${a}.text`);
      row(t('ui.family'), esc(t('family.' + fam)));
      row(t('ui.cost'), coin(C.families[fam].cost));
      row(t('ui.income'), `<span class="ico income">${C.families[fam].income}</span>`);
    } else if (kind === 'building') {
      const front = b === 'grigio';
      img = `${a}_${side(front)}`; name = t(`tile.${a}.${side(front)}.name`); text = t(`tile.${a}.${side(front)}.text`);
      row(t('ui.emission'), `<span class="ico cloud">${front ? C.buildingEmission : 0}</span>`);
      if (front) row(t('ui.reconvertCost'), coin(C.reconvertCost));
      else row(t('ui.satellite'), esc(t('ui.countsForSatellite')));
    } else if (kind === 'network') {
      const renewed = b === 'rinnovata';
      img = `rete_${a}_${side(!renewed)}`; name = t(`network.${a}.${side(!renewed)}.name`); text = t(`network.${a}.${side(!renewed)}.text`);
      row(t('ui.owner'), playerTag(+c));
      row(t('ui.emission'), `<span class="ico cloud">${renewed ? 0 : C.networkEmission}</span>`);
      if (!renewed) row(t('ui.renewCost'), coin(C.renewCost));
    } else if (kind === 'municipio') {
      img = `mun_${a}`; name = t(`municipio.${a}.name`); text = t(`municipio.${a}.text`);
      row(t('ui.crest'), esc(t(`municipio.${a}.crest`)));
    } else if (kind === 'role') {
      img = `ruolo_${a}`; name = t(`role.${a}.name`);
      row(t('ui.roleAction'), esc(t(`role.${a}.action`)));
      row(t('ui.rolePrivilege'), esc(t(`role.${a}.privilege`)));
      row(t('ui.credits'), coin(st.roleCredits[a]));
    } else if (kind === 'investment') {
      const owner = st.investmentOwners[a];
      img = a; name = t(`tile.${a}.name`); text = t(`tile.${a}.text`);
      row(t('ui.cost'), coin(CAT.investmentById[a].cost));
      row(t('ui.effect'), esc(t(`tile.${a}.effect`)));
      row(t('ui.owner'), owner != null ? playerTag(owner) : esc(t('ui.available')));
      const who = owner != null ? owner : actor();
      if (who != null) row(t('ui.valueNow', { player: playerName(who) }), esc(t('ui.pointsN', { n: E.investmentPoints(st, who, a) })));
    } else if (kind === 'token') {
      img = `token_rete_${a}`; name = t(`network.${a}.token`);
      text = st.networkCompleted[a] ? t('network.completedNote') : t('network.notCompletedNote');
    }
    const wide = kind === 'network';
    const tall = kind === 'role';
    const overlay = C.ui.tileOverlay && !wide && !tall && kind !== 'municipio' && kind !== 'token';
    return `<div class="tip-img ${wide ? 'wide' : ''} ${tall ? 'tall' : ''}">${img ? tileImg(img, '') : ''}
        ${overlay ? `<span class="tip-band">${esc(name)}</span>` : ''}</div>
      <div class="tip-body"><h3>${esc(name)}</h3>${text ? `<p class="printed">${esc(text)}</p>` : ''}
        ${rows.length ? `<dl>${rows.join('')}</dl>` : ''}</div>`;
  }

  let tipTimer = null, longPressed = false, pressStart = null, lastTouch = 0;

  function showTip(el, x, y) {
    const tipEl = $('tooltip');
    tipEl.innerHTML = tipHtml(el.getAttribute('data-tip'));
    tipEl.hidden = false;
    placeTip(x, y);
  }
  function placeTip(x, y) {
    const tipEl = $('tooltip');
    if (tipEl.hidden) return;
    const r = tipEl.getBoundingClientRect();
    let left = x + 16, top = y + 16;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 16;
    if (top + r.height > window.innerHeight - 8) top = window.innerHeight - r.height - 8;
    tipEl.style.left = Math.max(8, left) + 'px';
    tipEl.style.top = Math.max(8, top) + 'px';
  }
  function hideTip() { $('tooltip').hidden = true; }

  function bindTooltips() {
    document.addEventListener('mouseover', e => {
      const el = e.target.closest('[data-tip]');
      // Touch screens emulate mouseover on tap: tooltips there come from long press.
      if (el && Date.now() - lastTouch > 1000) showTip(el, e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', e => placeTip(e.clientX, e.clientY));
    document.addEventListener('mouseout', e => {
      const el = e.target.closest('[data-tip]');
      if (el && !el.contains(e.relatedTarget)) hideTip();
    });
    // Long press on touch screens.
    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      lastTouch = Date.now();
      hideTip();
      const el = e.target.closest('[data-tip]');
      if (!el) return;
      longPressed = false;
      pressStart = [e.clientX, e.clientY];
      clearTimeout(tipTimer);
      tipTimer = setTimeout(() => { longPressed = true; showTip(el, e.clientX, e.clientY); }, C.ui.longPressMs);
    });
    const cancel = () => clearTimeout(tipTimer);
    document.addEventListener('pointerup', cancel);
    document.addEventListener('pointercancel', cancel);
    document.addEventListener('pointermove', e => {
      if (pressStart && Math.hypot(e.clientX - pressStart[0], e.clientY - pressStart[1]) > 10) cancel();
    });
    // A long press must not also trigger the tap.
    document.addEventListener('click', e => {
      if (longPressed) { longPressed = false; e.stopPropagation(); e.preventDefault(); }
    }, true);
    document.addEventListener('contextmenu', e => { if (e.target.closest('[data-tip]')) e.preventDefault(); });
    window.addEventListener('scroll', hideTip, true);
  }

  // ---------------------------------------------------------- interaction

  function handleActivate(target) {
    const sel = target.closest('[data-select-display]');
    if (sel) {
      const d = +sel.getAttribute('data-select-display');
      ui.selectedDisplay = ui.selectedDisplay === d ? null : d;
      if (ui.selectedDisplay != null) BV.sound.play('take');
      render();
      return true;
    }
    const act = target.closest('[data-act]');
    if (act) {
      hideTip();
      ui.selectedDisplay = null;
      if (ui.onAction) ui.onAction(JSON.parse(act.getAttribute('data-act')));
      return true;
    }
    const u = target.closest('[data-ui]');
    if (u) {
      const what = u.getAttribute('data-ui');
      if (what === 'cancel') { ui.selectedDisplay = null; render(); }
      else if (ui.onUi) ui.onUi(what);
      return true;
    }
    return false;
  }

  function bindInteraction() {
    ['board', 'city-panel', 'roles-side', 'action-panel'].forEach(id => {
      $(id).addEventListener('click', e => handleActivate(e.target));
      $(id).addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
          e.preventDefault();
          handleActivate(e.target);
        }
      });
    });
    $('log-toggle').addEventListener('click', () => { ui.logAll = !ui.logAll; renderLog(); });
    window.addEventListener('resize', fitBoard);
    compactQuery.addEventListener('change', render);
    if (window.ResizeObserver) new ResizeObserver(fitBoard).observe($('board-area'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { hideTip(); if (ui.selectedDisplay != null) { ui.selectedDisplay = null; render(); } } });
  }

  // ------------------------------------------------------------- render

  function render() {
    if (!ui.state) return;
    const st = ui.state;
    if (ui.selectedDisplay != null && !(st.phase === 'ROLE_EXECUTION' && st.activeRole === 'urbanista' &&
        legal().some(a => a.type === 'placeInfra' && a.display === ui.selectedDisplay))) {
      ui.selectedDisplay = null;
    }
    renderBoard();
    renderCityPanel();
    renderActionPanel();
    renderPlayers();
    renderLog();
  }

  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // info: null (no timer) or { limit, elapsed, penalties, next, paused } in seconds.
  function updateTimer(info) {
    ui.timer = info;
    const el = $('turn-timer');
    if (!el) return;
    if (!info) { el.hidden = true; return; }
    const remaining = info.limit - info.elapsed;
    const over = remaining < 0;
    el.hidden = false;
    el.className = 'turn-timer' + (over ? ' over' : remaining <= 20 ? ' warn' : '') + (info.paused ? ' paused' : '');
    el.innerHTML = `<span class="tt-clock" role="timer">${over ? '+' + clock(-remaining) : clock(Math.ceil(remaining))}</span>
      <span class="tt-bar"><span style="width:${(100 * Math.max(0, remaining) / info.limit).toFixed(1)}%"></span></span>
      <span class="tt-note">${esc(over ? t('ui.timerOver', { points: info.penalties, next: Math.ceil(info.next) }) : t('ui.timerLeft'))}</span>`;
  }

  // New state from the same decision (e.g. a time penalty): keeps the selection.
  function update(state) {
    ui.state = state;
    render();
  }

  function setState(state, prev) {
    ui.state = state;
    ui.prev = prev || null;
    ui.selectedDisplay = null;
    render();
    ui.prev = null;   // animate only once
  }

  BV.ui = {
    init(opts) {
      ui.onAction = opts.onAction;
      ui.onUi = opts.onUi;
      bindInteraction();
      bindTooltips();
    },
    setState,
    update,
    updateTimer,
    render,
    fitBoard,
    hideTip,
    esc,
    color,
    playerTag,
    logText,
    get state() { return ui.state; }
  };
})();
