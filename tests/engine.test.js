/* Engine tests: rulebook section 10 examples (section 11.7) plus invariants. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/config.js');
require('../js/catalog.js');
require('../js/rng.js');
require('../js/engine.js');
const BV = globalThis.BV;
const E = BV.engine;

const ANNA = 0, BRUNO = 1, CARLA = 2;
// Slot indices of the forced layout below (Anna's layout from 10.1, reused for all).
const LAYOUT = ['gr_distributore', 'gr_parcheggio', 'gr_terreno', 'gr_deposito', 'gr_piazzale', 'gr_cortile'];
const T = { distributore: 0, parcheggio: 1, terreno: 2, deposito: 3, piazzale: 4, cortile: 5 };

function act(state, action) { return E.applyAction(state, action); }
function role(state, r) { return act(state, { type: 'chooseRole', role: r }); }
function place(state, tileId, slot) {
  const d = state.infraDisplay.indexOf(tileId);
  assert.ok(d >= 0, tileId + ' not in display ' + state.infraDisplay);
  return act(state, { type: 'placeInfra', display: d, slot });
}
function col(state, key) { return state.players.map(p => p[key]); }
function lastYearPoints(state) { return state.players.map(p => p.yearPoints[p.yearPoints.length - 1]); }

function exampleGame() {
  return E.createGame({
    playerCount: 3,
    names: ['Anna', 'Bruno', 'Carla'],
    seed: 42,
    keyHolder: ANNA,
    forced: {
      territorial: [LAYOUT, LAYOUT, LAYOUT],
      buildings: [['ed_condominio', 'ed_scuola'], null, null],
      deck: ['inf_parco', 'inf_orto', 'inf_bus', 'inf_fotovoltaico',
        'inf_bosco', 'inf_giardino', 'inf_ciclostazione', 'inf_eolico']
    }
  });
}

function play2025(s) {
  s = role(s, 'urbanista');                     // Anna
  s = place(s, 'inf_bus', T.distributore);      // Anna, 1 credit with privilege
  s = place(s, 'inf_parco', T.deposito);        // Bruno
  s = place(s, 'inf_orto', T.parcheggio);       // Carla
  s = role(s, 'lavori');                        // Bruno
  s = act(s, { type: 'renew', network: 'strada' });   // Bruno, 1 credit
  s = act(s, { type: 'renew', network: 'ferrovia' }); // Carla
  s = act(s, { type: 'renew', network: 'strada' });   // Anna
  s = role(s, 'progettista');                   // Carla
  return s;
}

function play2026(s) {
  s = role(s, 'bilancio');                      // Bruno
  s = role(s, 'sindaco');                       // Carla
  s = role(s, 'urbanista');                     // Anna
  s = place(s, 'inf_bosco', T.piazzale);        // Anna, 0 credits
  s = place(s, 'inf_ciclostazione', T.distributore); // Bruno
  s = place(s, 'inf_giardino', T.deposito);     // Carla
  return s;
}

test('10.1 setup: 14 emissions each, 3 credits, city 42, threshold 10', () => {
  const s = exampleGame();
  assert.deepEqual(col(s, 'emissions'), [14, 14, 14]);
  assert.deepEqual(col(s, 'credits'), [3, 3, 3]);
  assert.equal(s.cityEmissions, 42);
  assert.equal(s.threshold, 10);
  assert.equal(s.keyHolder, ANNA);
  assert.deepEqual(s.infraDisplay, ['inf_parco', 'inf_orto', 'inf_bus', 'inf_fotovoltaico']);
  assert.equal(s.infraDeck.length, 36 - 4);
  assert.deepEqual(s.players[ANNA].buildings.map(b => b.tileId), ['ed_condominio', 'ed_scuola']);
  // Every Municipio has one grey tile of each type and two buildings; 6 buildings used.
  assert.equal(s.players.flatMap(p => p.buildings).length, 6);
});

test('4-player setup: city 56, threshold 13, 5 tiles revealed, 8 buildings', () => {
  const s = E.createGame({ playerCount: 4, seed: 7 });
  assert.equal(s.cityEmissions, 56);
  assert.equal(s.threshold, 13);
  assert.equal(s.infraDisplay.length, 5);
  const blds = s.players.flatMap(p => p.buildings.map(b => b.tileId)).sort();
  assert.equal(blds.length, 8);
  ['ed_capannone', 'ed_condominio', 'ed_scuola', 'ed_uffici'].forEach(id =>
    assert.equal(blds.filter(b => b === id).length, 2));
  s.players.forEach(p => assert.deepEqual(
    p.territorial.map(t => t.tileId).sort(), LAYOUT.slice().sort()));
});

test('10.2 year 2025 matches the end-of-year table', () => {
  let s = exampleGame();
  s = role(s, 'urbanista');
  s = place(s, 'inf_bus', T.distributore);
  s = place(s, 'inf_parco', T.deposito);
  s = place(s, 'inf_orto', T.parcheggio);
  assert.deepEqual(col(s, 'credits'), [2, 2, 2]);
  assert.deepEqual(s.infraDisplay, ['inf_fotovoltaico']);
  assert.equal(s.chooserIndex, BRUNO);

  s = role(s, 'lavori');
  assert.deepEqual(s.executionQueue, [BRUNO, CARLA, ANNA]);
  s = act(s, { type: 'renew', network: 'strada' });
  s = act(s, { type: 'renew', network: 'ferrovia' });
  s = act(s, { type: 'renew', network: 'strada' });
  assert.deepEqual(col(s, 'credits'), [0, 1, 0]);
  assert.deepEqual(s.networkCompleted, { strada: false, ferrovia: false });

  s = role(s, 'progettista');
  assert.deepEqual(col(s, 'credits'), [0, 1, 2]);
  assert.deepEqual(col(s, 'emissions'), [11, 11, 12]);
  assert.deepEqual(lastYearPoints(s), [3, 3, 2]);
  assert.deepEqual(col(s, 'score'), [3, 3, 2]);
  assert.equal(s.cityEmissions, 34);
  assert.equal(s.phase, 'ROLE_SELECTION');
  assert.equal(s.year, 2026);
  assert.deepEqual(s.roleCredits, { urbanista: 0, lavori: 0, bilancio: 1, progettista: 0, sindaco: 1 });
  assert.ok(s.infraDiscard.includes('inf_fotovoltaico'));
  assert.equal(s.keyHolder, BRUNO);
  assert.equal(s.chooserIndex, BRUNO);
  assert.deepEqual(s.infraDisplay, ['inf_bosco', 'inf_giardino', 'inf_ciclostazione', 'inf_eolico']);
});

test('10.3 year 2026 matches the end-of-year table', () => {
  let s = play2025(exampleGame());
  s = role(s, 'bilancio');
  assert.deepEqual(col(s, 'credits'), [1, 3, 2]);
  s = role(s, 'sindaco');
  assert.equal(s.players[CARLA].credits, 4);
  assert.equal(s.keyHolder, CARLA);
  s = role(s, 'urbanista');
  assert.deepEqual(s.executionQueue, [ANNA, BRUNO, CARLA]);
  s = place(s, 'inf_bosco', T.piazzale);
  s = place(s, 'inf_ciclostazione', T.distributore);
  s = place(s, 'inf_giardino', T.deposito);

  assert.equal(s.year, 2027);
  assert.deepEqual(col(s, 'credits'), [1, 1, 3]);
  assert.deepEqual(s.players.map(p => p.emissionsHistory[1]), [10, 9, 10]);
  assert.deepEqual(lastYearPoints(s), [4, 5, 4]);
  assert.deepEqual(col(s, 'score'), [7, 8, 6]);
  assert.equal(s.cityHistory[1], 29);
  assert.equal(s.keyHolder, CARLA);
  assert.deepEqual(s.roleCredits, { urbanista: 0, lavori: 1, bilancio: 0, progettista: 1, sindaco: 0 });
  assert.ok(s.infraDiscard.includes('inf_eolico'));
});

// 10.4: state at the start of 2028 built by hand, then the year is played.
function start2028() {
  const s = exampleGame();
  const grey = id => ({ kind: 'grigia', tileId: id, emission: BV.CATALOG.greyById[id].emission });
  const infra = id => ({ kind: 'infrastruttura', tileId: id, family: BV.CATALOG.infraById[id].family });
  const V = infra('inf_parco');
  s.year = 2028;
  s.log = [];
  // Anna 7: two 1-tiles + buildings 4 + ferrovia 1.
  s.players[ANNA].territorial = [infra('inf_bus'), grey('gr_parcheggio'), V, V, V, grey('gr_cortile')];
  s.players[ANNA].network = { strada: 'rinnovata', ferrovia: 'dissestata' };
  // Bruno 7: cortile + terreno + buildings 4 + ferrovia 1.
  s.players[BRUNO].territorial = [infra('inf_ciclostazione'), V, grey('gr_terreno'), V, V, grey('gr_cortile')];
  s.players[BRUNO].network = { strada: 'rinnovata', ferrovia: 'dissestata' };
  // Carla 8: piazzale + distributore + buildings 4 + strada 1.
  s.players[CARLA].territorial = [grey('gr_distributore'), V, V, V, grey('gr_piazzale'), V];
  s.players[CARLA].network = { strada: 'dissestata', ferrovia: 'rinnovata' };
  s.players[ANNA].credits = 2;
  s.players[BRUNO].credits = 2;
  s.players[CARLA].credits = 1;
  s.players.forEach(p => { p.yearPoints = []; p.emissionsHistory = []; p.score = 0; });
  s.cityHistory = [];
  s.infraDisplay = ['inf_parco', 'inf_orto', 'inf_bosco', 'inf_giardino'];
  s.keyHolder = BRUNO;
  s.chooserIndex = BRUNO;
  assert.deepEqual([0, 1, 2].map(i => E.computeEmissions(s, i)), [7, 7, 8]);
  return s;
}

function play2028(s, brunoRenews) {
  s = role(s, 'urbanista');                     // Bruno
  s = place(s, 'inf_parco', T.cortile);         // Bruno, privilege: 0 credits
  s = place(s, 'inf_orto', T.piazzale);         // Carla, last credit
  s = act(s, { type: 'pass' });                 // Anna
  s = role(s, 'lavori');                        // Carla: no credits, auto-pass
  assert.equal(s.log.filter(l => l.key === 'log.autoPass').length, 1);
  s = act(s, { type: 'renew', network: 'ferrovia' }); // Anna
  assert.equal(s.networkCompleted.ferrovia, false);
  s = act(s, brunoRenews ? { type: 'renew', network: 'ferrovia' } : { type: 'pass' }); // Bruno, last
  s = role(s, 'progettista');                   // Anna
  return s;
}

test('10.4 completing the railway network in 2028', () => {
  const s = play2028(start2028(), true);
  assert.equal(s.networkCompleted.ferrovia, true);
  assert.equal(s.networkCompleted.strada, false);
  assert.deepEqual(col(s, 'emissions'), [5, 4, 6]);
  assert.equal(s.cityEmissions, 15);
  assert.deepEqual(lastYearPoints(s), [9, 10, 8]);
});

test('10.4 variant: Bruno does not renew his railway', () => {
  const s = play2028(start2028(), false);
  assert.equal(s.networkCompleted.ferrovia, false);
  assert.deepEqual(col(s, 'emissions'), [6, 6, 7]);
  assert.deepEqual(lastYearPoints(s), [8, 8, 7]);
});

test('10.5 final scoring: satellite bonus, city success', () => {
  const years = [[3, 4, 7, 9, 11, 12], [3, 5, 7, 10, 11, 11], [2, 4, 6, 8, 9, 10]];
  const sum = a => a.reduce((x, y) => x + y, 0);
  const o = E.computeOutcome({
    citySuccess: true,
    satelliteOwner: CARLA,
    players: [
      { score: sum(years[0]), emissions: 2, credits: 0, decarbonized: 0 },
      { score: sum(years[1]), emissions: 3, credits: 0, decarbonized: 0 },
      { score: sum(years[2]), emissions: 4, credits: 0, decarbonized: 2 }
    ]
  });
  assert.deepEqual(o.satelliteBonus, [0, 0, 6]);
  assert.deepEqual(o.finalScores, [46, 47, 45]);
  assert.deepEqual(o.ranking.map(r => r.player), [BRUNO, ANNA, CARLA]);
  assert.deepEqual(o.winners, [BRUNO]);
});

test('10.5 variant: city failure halves scores, tie broken by emissions', () => {
  const o = E.computeOutcome({
    citySuccess: false,
    satelliteOwner: CARLA,
    players: [
      { score: 44, emissions: 3, credits: 0, decarbonized: 0 },
      { score: 45, emissions: 4, credits: 0, decarbonized: 0 },
      { score: 37, emissions: 5, credits: 0, decarbonized: 2 }
    ]
  });
  assert.deepEqual(o.scoresBeforeHalving, [44, 45, 43]);
  assert.deepEqual(o.finalScores, [22, 22, 21]);
  assert.deepEqual(o.ranking.map(r => [r.player, r.rank]), [[ANNA, 1], [BRUNO, 2], [CARLA, 3]]);
  assert.deepEqual(o.winners, [ANNA]);
});

test('ties: credits break, full ties share the victory', () => {
  const base = { score: 10, emissions: 3, decarbonized: 0 };
  let o = E.computeOutcome({ citySuccess: true, satelliteOwner: null,
    players: [{ ...base, credits: 1 }, { ...base, credits: 2 }, { ...base, credits: 0 }] });
  assert.deepEqual(o.ranking.map(r => r.player), [1, 0, 2]);
  o = E.computeOutcome({ citySuccess: true, satelliteOwner: null,
    players: [{ ...base, credits: 2 }, { ...base, credits: 2 }, { ...base, credits: 0 }] });
  assert.deepEqual(o.winners, [0, 1]);
  assert.deepEqual(o.ranking.map(r => r.rank), [1, 1, 3]);
});

test('illegal actions are rejected and state is not mutated', () => {
  const s = exampleGame();
  const before = JSON.stringify(s);
  assert.throws(() => E.applyAction(s, { type: 'placeInfra', display: 0, slot: 0 }));
  const s2 = role(s, 'urbanista');
  assert.equal(JSON.stringify(s), before);
  assert.throws(() => role(s2, 'lavori'));
  // Fotovoltaico costs 3 - 1 = 2 for Anna: affordable; then a chosen role is not selectable.
  assert.ok(E.isLegal(s2, { type: 'placeInfra', display: 3, slot: 0 }));
  let s3 = place(s2, 'inf_bus', 0);
  s3 = place(s3, 'inf_parco', 3);
  s3 = place(s3, 'inf_orto', 1);
  assert.equal(E.isLegal(s3, { type: 'chooseRole', role: 'urbanista' }), false);
});

test('satellite: only one owner, privilege discount applies', () => {
  let s = exampleGame();
  s.players.forEach(p => { p.credits = 5; });
  s = role(s, 'lavori');                        // Anna chooses
  s = act(s, { type: 'buySatellite' });         // 4 with privilege
  assert.equal(s.satelliteOwner, ANNA);
  assert.equal(s.players[ANNA].credits, 1);
  assert.equal(E.isLegal(s, { type: 'buySatellite' }), false);
  s = act(s, { type: 'reconvert', slot: 0 });   // Bruno pays 4
  assert.equal(s.players[BRUNO].credits, 1);
  assert.equal(s.players[BRUNO].buildings[0].side, 'decarbonizzato');
});

test('deck reshuffles the discard pile when exhausted', () => {
  const s = exampleGame();
  s.infraDiscard = s.infraDeck.slice(2);
  s.infraDeck = s.infraDeck.slice(0, 2);
  // Pass every role cheaply through a year: progettista, sindaco, bilancio.
  let t = role(s, 'progettista');
  t = role(t, 'sindaco');
  t = role(t, 'bilancio');
  assert.equal(t.infraDisplay.length, 4);
  assert.ok(t.log.some(l => l.key === 'log.reshuffle'));
  const total = t.infraDeck.length + t.infraDisplay.length + t.infraDiscard.length;
  assert.equal(total, 36);
});

test('random full games respect the invariants', () => {
  for (let seed = 1; seed <= 300; seed++) {
    let s = E.createGame({ playerCount: seed % 2 ? 3 : 4, seed });
    const pick = { rng: seed * 7919 };
    let steps = 0;
    while (s.phase !== 'GAME_OVER') {
      const acts = E.legalActions(s);
      assert.ok(acts.length > 0, 'no legal actions in phase ' + s.phase);
      // Prefer doing something over passing, so games progress.
      const nonPass = acts.filter(a => a.type !== 'pass');
      const pool = nonPass.length && BV.rng.random(pick) < 0.85 ? nonPass : acts;
      s = E.applyAction(s, pool[BV.rng.int(pick, pool.length)]);
      s.players.forEach((p, i) => {
        assert.ok(p.credits >= 0);
        const e = E.computeEmissions(s, i);
        assert.ok(e >= 0 && e <= 14);
      });
      assert.ok(++steps < 500);
    }
    assert.ok(s.year <= 2030);
    const o = s.outcome;
    assert.equal(o.citySuccess, s.cityEmissions <= s.threshold);
    if (!o.citySuccess) assert.equal(s.year, 2030);
    s.players.forEach((p, i) => {
      assert.equal(p.score, p.yearPoints.reduce((a, b) => a + b, 0));
      assert.equal(p.yearPoints.length, s.year - 2024);
      assert.ok(o.finalScores[i] >= 0);
    });
    const tiles = s.infraDeck.length + s.infraDisplay.length + s.infraDiscard.length +
      s.players.reduce((n, p) => n + p.territorial.filter(t => t.kind === 'infrastruttura').length, 0);
    assert.equal(tiles, 36);
  }
});
