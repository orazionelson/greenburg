/* Borgo Verde – game engine.
 * Pure logic, no DOM. The state is plain JSON; applyAction returns a new state
 * and never mutates its input. Log entries are { year, key, params } and are
 * translated by the UI. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};
  var C = BV.CONFIG;
  var CAT = BV.CATALOG;
  var R = BV.rng;

  // Bump when the catalogue or the state shape changes: older saves are ignored.
  var STATE_VERSION = 2;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function fail(msg) { throw new Error(msg); }

  function nextPlayer(state, i) { return (i + 1) % state.playerCount; }

  // Indices starting from `start`, clockwise.
  function clockwiseFrom(state, start) {
    var out = [];
    for (var k = 0; k < state.playerCount; k++) out.push((start + k) % state.playerCount);
    return out;
  }

  function log(state, key, params) {
    state.log.push({ year: state.year, key: key, params: params || {} });
  }

  // ---------------------------------------------------------------- setup

  function fullInfraDeck() {
    var deck = [];
    CAT.infra.forEach(function (t) {
      for (var k = 0; k < t.copies; k++) deck.push(t.id);
    });
    return deck;
  }

  function fullBuildingBag() {
    var bag = [];
    CAT.buildings.forEach(function (b) {
      for (var k = 0; k < b.copies; k++) bag.push(b.id);
    });
    return bag;
  }

  // Removes one instance of each id in `ids` from `pool`; throws if missing.
  function takeFrom(pool, ids, what) {
    ids.forEach(function (id) {
      var k = pool.indexOf(id);
      if (k < 0) fail('Not enough copies of ' + id + ' for forced ' + what);
      pool.splice(k, 1);
    });
  }

  function greySlot(id) {
    var g = CAT.greyById[id];
    if (!g) fail('Unknown grey tile ' + id);
    return { kind: 'grigia', tileId: id, emission: g.emission };
  }

  /* opts: {
   *   playerCount: 3|4, names?: string[], seed?: number, keyHolder?: number,
   *   autoPass?: boolean,
   *   forced?: {
   *     territorial?: (string[6]|null)[]   grey tile ids per player, T1..T6
   *     buildings?: (string[2]|null)[]     building ids per player, E1..E2
   *     deck?: string[]                    infra ids on top of the deck, in order
   *   }
   * } */
  function createGame(opts) {
    opts = opts || {};
    var n = opts.playerCount;
    if (C.playerCounts.indexOf(n) < 0) fail('Invalid player count ' + n);
    var seed = opts.seed != null ? (opts.seed >>> 0)
      : ((Date.now() ^ Math.floor(Math.random() * 4294967296)) >>> 0);
    var forced = opts.forced || {};

    var roleCredits = {};
    C.roles.forEach(function (r) { roleCredits[r] = 0; });

    var state = {
      version: STATE_VERSION,
      seed: seed,
      rng: seed,
      autoPass: opts.autoPass !== false,
      playerCount: n,
      threshold: C.threshold[n],
      year: C.firstYear,
      phase: 'SETUP',
      keyHolder: 0,
      chooserIndex: 0,
      activeRole: null,
      roleChooser: null,
      executionQueue: [],
      rolesChosenThisYear: [],
      roleCredits: roleCredits,
      infraDeck: [],
      infraDisplay: [],
      infraDiscard: [],
      satelliteOwner: null,
      networkCompleted: { strada: false, ferrovia: false },
      cityEmissions: 0,
      cityHistory: [],
      players: [],
      log: [],
      outcome: null
    };

    // Buildings: forced ones first, the rest drawn from the shuffled bag.
    var bag = fullBuildingBag();
    var forcedB = forced.buildings || [];
    for (var i = 0; i < n; i++) if (forcedB[i]) takeFrom(bag, forcedB[i], 'buildings');
    bag = R.shuffle(state, bag);

    for (i = 0; i < n; i++) {
      var terr = forced.territorial && forced.territorial[i]
        ? forced.territorial[i].slice()
        : R.shuffle(state, CAT.grey.map(function (g) { return g.id; }));
      if (terr.length !== 6) fail('Territorial layout must have 6 tiles');
      var blds = forcedB[i] ? forcedB[i].slice() : [bag.shift(), bag.shift()];

      state.players.push({
        name: (opts.names && opts.names[i]) || ('P' + (i + 1)),
        municipio: C.municipi[i],
        credits: C.startingCredits,
        score: 0,
        emissions: C.baseEmissions,
        territorial: terr.map(greySlot),
        buildings: blds.map(function (id) {
          return { kind: 'edificio', tileId: id, side: 'grigio' };
        }),
        network: { strada: 'dissestata', ferrovia: 'dissestata' },
        yearPoints: [],
        emissionsHistory: []
      });
    }

    // Infrastructure deck: forced prefix, then the rest shuffled.
    var pool = fullInfraDeck();
    var prefix = forced.deck || [];
    takeFrom(pool, prefix, 'deck');
    state.infraDeck = prefix.concat(R.shuffle(state, pool));

    state.keyHolder = opts.keyHolder != null ? opts.keyHolder : R.int(state, n);
    state.players.forEach(function (p, k) { p.emissions = computeEmissions(state, k); });
    state.cityEmissions = cityEmissions(state);

    log(state, 'log.setup', { players: n, seed: seed, threshold: state.threshold });
    startYear(state);
    return state;
  }

  function revealDisplay(state) {
    var want = state.playerCount + C.displayExtra;
    while (state.infraDisplay.length < want) {
      if (!state.infraDeck.length) {
        if (!state.infraDiscard.length) break;
        state.infraDeck = R.shuffle(state, state.infraDiscard);
        state.infraDiscard = [];
        log(state, 'log.reshuffle', {});
      }
      state.infraDisplay.push(state.infraDeck.shift());
    }
  }

  function startYear(state) {
    revealDisplay(state);
    state.rolesChosenThisYear = [];
    state.activeRole = null;
    state.roleChooser = null;
    state.executionQueue = [];
    state.chooserIndex = state.keyHolder;
    state.phase = 'ROLE_SELECTION';
    log(state, 'log.yearStart', { player: state.keyHolder });
  }

  // -------------------------------------------------------------- scoring

  function computeEmissions(state, i) {
    var p = state.players[i];
    var e = 0;
    p.territorial.forEach(function (s) { if (s.kind === 'grigia') e += s.emission; });
    p.buildings.forEach(function (b) { if (b.side === 'grigio') e += C.buildingEmission; });
    C.networks.forEach(function (net) {
      if (p.network[net] === 'dissestata') e += C.networkEmission;
    });
    C.networks.forEach(function (net) {
      if (state.networkCompleted[net]) e -= C.networkBonus;
    });
    return Math.max(0, e);
  }

  function cityEmissions(state) {
    var sum = 0;
    for (var i = 0; i < state.playerCount; i++) sum += computeEmissions(state, i);
    return sum;
  }

  function incomeOf(player) {
    var inc = 0;
    player.territorial.forEach(function (s) {
      if (s.kind === 'infrastruttura') inc += C.families[s.family].income;
    });
    return inc;
  }

  function decarbonizedCount(player) {
    return player.buildings.filter(function (b) { return b.side === 'decarbonizzato'; }).length;
  }

  /* Final scores and ranking (sections 7-8).
   * input: { citySuccess, satelliteOwner, players: [{ score, emissions, credits, decarbonized }] }
   * Ranking: score desc, then emissions asc, then credits desc; full ties share the rank. */
  function computeOutcome(input) {
    var players = input.players;
    var bonus = players.map(function (p, i) {
      return input.satelliteOwner === i ? C.satellitePointsPerBuilding * p.decarbonized : 0;
    });
    var beforeHalving = players.map(function (p, i) { return p.score + bonus[i]; });
    var finalScores = beforeHalving.map(function (s) {
      return input.citySuccess ? s : Math.floor(s * C.failureFactor);
    });

    function cmp(a, b) {
      if (finalScores[a] !== finalScores[b]) return finalScores[b] - finalScores[a];
      if (players[a].emissions !== players[b].emissions) return players[a].emissions - players[b].emissions;
      return players[b].credits - players[a].credits;
    }
    var order = players.map(function (_, i) { return i; }).sort(function (a, b) {
      return cmp(a, b) || a - b;
    });
    var ranking = [];
    order.forEach(function (idx, pos) {
      var rank = pos + 1;
      if (pos > 0 && cmp(order[pos - 1], idx) === 0) rank = ranking[pos - 1].rank;
      ranking.push({ player: idx, rank: rank, score: finalScores[idx] });
    });

    return {
      citySuccess: !!input.citySuccess,
      satelliteBonus: bonus,
      scoresBeforeHalving: beforeHalving,
      finalScores: finalScores,
      ranking: ranking,
      winners: ranking.filter(function (r) { return r.rank === 1; }).map(function (r) { return r.player; })
    };
  }

  // ------------------------------------------------------------- legality

  function currentActor(state) {
    if (state.phase === 'ROLE_SELECTION') return state.chooserIndex;
    if (state.phase === 'ROLE_EXECUTION') return state.executionQueue[0];
    return null;
  }

  function costFor(state, playerIndex, base) {
    if (playerIndex === state.roleChooser) return Math.max(0, base - C.privilegeDiscount);
    return base;
  }

  function infraCost(state, playerIndex, tileId) {
    return costFor(state, playerIndex, C.families[CAT.infraById[tileId].family].cost);
  }

  function legalActions(state) {
    var actor = currentActor(state);
    if (actor == null) return [];
    var p = state.players[actor];
    var out = [];

    if (state.phase === 'ROLE_SELECTION') {
      C.roles.forEach(function (r) {
        if (state.rolesChosenThisYear.indexOf(r) < 0) out.push({ type: 'chooseRole', role: r });
      });
      return out;
    }

    if (state.activeRole === 'urbanista') {
      state.infraDisplay.forEach(function (tileId, d) {
        if (infraCost(state, actor, tileId) > p.credits) return;
        p.territorial.forEach(function (s, k) {
          if (s.kind === 'grigia') out.push({ type: 'placeInfra', display: d, slot: k });
        });
      });
    } else if (state.activeRole === 'lavori') {
      var rc = costFor(state, actor, C.reconvertCost);
      p.buildings.forEach(function (b, k) {
        if (b.side === 'grigio' && rc <= p.credits) out.push({ type: 'reconvert', slot: k });
      });
      var nc = costFor(state, actor, C.renewCost);
      C.networks.forEach(function (net) {
        if (p.network[net] === 'dissestata' && nc <= p.credits) out.push({ type: 'renew', network: net });
      });
      if (state.satelliteOwner == null && costFor(state, actor, C.satelliteCost) <= p.credits) {
        out.push({ type: 'buySatellite' });
      }
    }
    out.push({ type: 'pass' });
    return out;
  }

  function sameAction(a, b) {
    return a.type === b.type && a.role === b.role && a.display === b.display &&
      a.slot === b.slot && a.network === b.network;
  }

  function isLegal(state, action) {
    return legalActions(state).some(function (a) { return sameAction(a, action); });
  }

  // -------------------------------------------------------------- actions

  function pay(p, amount) {
    if (amount > p.credits) fail('Not enough credits');
    p.credits -= amount;
  }

  function chooseRole(state, actor, role) {
    var p = state.players[actor];
    var taken = state.roleCredits[role];
    p.credits += taken;
    state.roleCredits[role] = 0;
    state.rolesChosenThisYear.push(role);
    state.activeRole = role;
    state.roleChooser = actor;
    log(state, 'log.chooseRole', { player: actor, role: role, credits: taken });

    if (role === 'urbanista' || role === 'lavori') {
      state.executionQueue = clockwiseFrom(state, actor);
      state.phase = 'ROLE_EXECUTION';
      return;
    }
    if (role === 'bilancio') {
      clockwiseFrom(state, actor).forEach(function (i) {
        var q = state.players[i];
        var inc = incomeOf(q);
        var extra = i === actor ? C.bilancioBonus : 0;
        q.credits += inc + extra;
        log(state, 'log.income', { player: i, income: inc, bonus: extra });
      });
    } else if (role === 'progettista') {
      p.credits += C.progettistaCredits;
      log(state, 'log.progettista', { player: actor, credits: C.progettistaCredits });
    } else if (role === 'sindaco') {
      p.credits += C.sindacoCredits;
      state.keyHolder = actor;
      log(state, 'log.sindaco', { player: actor, credits: C.sindacoCredits });
    }
    endRole(state);
  }

  function checkNetwork(state, net) {
    if (state.networkCompleted[net]) return;
    var all = state.players.every(function (q) { return q.network[net] === 'rinnovata'; });
    if (all) {
      state.networkCompleted[net] = true;
      log(state, 'log.networkCompleted', { network: net });
    }
  }

  function execute(state, actor, action) {
    var p = state.players[actor];
    var cost;
    switch (action.type) {
      case 'placeInfra': {
        var tileId = state.infraDisplay[action.display];
        cost = infraCost(state, actor, tileId);
        pay(p, cost);
        var removed = p.territorial[action.slot];
        state.infraDisplay.splice(action.display, 1);
        p.territorial[action.slot] = {
          kind: 'infrastruttura', tileId: tileId,
          family: CAT.infraById[tileId].family, replaced: removed.tileId
        };
        log(state, 'log.placeInfra', {
          player: actor, tile: tileId, grey: removed.tileId,
          slot: CAT.slotLabels[action.slot], cost: cost, reduction: removed.emission
        });
        break;
      }
      case 'reconvert':
        cost = costFor(state, actor, C.reconvertCost);
        pay(p, cost);
        p.buildings[action.slot].side = 'decarbonizzato';
        log(state, 'log.reconvert', { player: actor, tile: p.buildings[action.slot].tileId, cost: cost });
        break;
      case 'renew':
        cost = costFor(state, actor, C.renewCost);
        pay(p, cost);
        p.network[action.network] = 'rinnovata';
        log(state, 'log.renew', { player: actor, network: action.network, cost: cost });
        checkNetwork(state, action.network);
        break;
      case 'buySatellite':
        cost = costFor(state, actor, C.satelliteCost);
        pay(p, cost);
        state.satelliteOwner = actor;
        log(state, 'log.buySatellite', { player: actor, cost: cost });
        break;
      case 'pass':
        log(state, 'log.pass', { player: actor, role: state.activeRole });
        break;
      default:
        fail('Unknown action ' + action.type);
    }
  }

  // Skips players who can only pass, then closes the role when the queue empties.
  function advance(state) {
    while (state.phase === 'ROLE_EXECUTION') {
      if (!state.executionQueue.length) { endRole(state); return; }
      if (!state.autoPass) return;
      var only = legalActions(state);
      if (only.length > 1) return;
      var actor = state.executionQueue.shift();
      log(state, 'log.autoPass', { player: actor, role: state.activeRole });
    }
  }

  function endRole(state) {
    state.executionQueue = [];
    if (state.rolesChosenThisYear.length >= state.playerCount) {
      yearEnd(state);
    } else {
      state.chooserIndex = nextPlayer(state, state.roleChooser);
      state.activeRole = null;
      state.roleChooser = null;
      state.phase = 'ROLE_SELECTION';
    }
  }

  function yearEnd(state) {
    state.phase = 'YEAR_END';
    state.activeRole = null;
    state.roleChooser = null;

    // 1. Accumulation on unchosen roles.
    C.roles.forEach(function (r) {
      if (state.rolesChosenThisYear.indexOf(r) < 0) state.roleCredits[r] += C.roleAccumulation;
    });
    // 2. Emissions.
    state.players.forEach(function (p, i) {
      p.emissions = computeEmissions(state, i);
      p.emissionsHistory.push(p.emissions);
    });
    state.cityEmissions = cityEmissions(state);
    state.cityHistory.push(state.cityEmissions);
    // 3. Points.
    state.players.forEach(function (p, i) {
      var pts = Math.max(0, C.baseEmissions - p.emissions);
      p.yearPoints.push(pts);
      p.score += pts;
      log(state, 'log.yearPoints', { player: i, emissions: p.emissions, points: pts, total: p.score });
    });
    log(state, 'log.cityEmissions', { emissions: state.cityEmissions, threshold: state.threshold });

    // 4. End check.
    var success = state.cityEmissions <= state.threshold;
    if (success || state.year >= C.lastYear) {
      gameOver(state, success);
      return;
    }

    // 5. Next year.
    state.infraDiscard = state.infraDiscard.concat(state.infraDisplay);
    state.infraDisplay = [];
    if (state.rolesChosenThisYear.indexOf('sindaco') < 0) {
      state.keyHolder = nextPlayer(state, state.keyHolder);
      log(state, 'log.keyPasses', { player: state.keyHolder });
    }
    state.year += 1;
    startYear(state);
  }

  function gameOver(state, success) {
    state.outcome = computeOutcome({
      citySuccess: success,
      satelliteOwner: state.satelliteOwner,
      players: state.players.map(function (p) {
        return { score: p.score, emissions: p.emissions, credits: p.credits, decarbonized: decarbonizedCount(p) };
      })
    });
    state.outcome.cityEmissions = state.cityEmissions;
    state.outcome.year = state.year;
    state.phase = 'GAME_OVER';
    log(state, success ? 'log.citySuccess' : 'log.cityFailure', { emissions: state.cityEmissions });
  }

  function applyAction(stateIn, action) {
    if (!isLegal(stateIn, action)) fail('Illegal action ' + JSON.stringify(action));
    var state = clone(stateIn);
    var actor = currentActor(state);
    if (action.type === 'chooseRole') {
      chooseRole(state, actor, action.role);
    } else {
      execute(state, actor, action);
      state.executionQueue.shift();
    }
    advance(state);
    return state;
  }

  BV.engine = {
    STATE_VERSION: STATE_VERSION,
    createGame: createGame,
    applyAction: applyAction,
    legalActions: legalActions,
    isLegal: isLegal,
    currentActor: currentActor,
    computeEmissions: computeEmissions,
    cityEmissions: cityEmissions,
    computeOutcome: computeOutcome,
    incomeOf: incomeOf,
    decarbonizedCount: decarbonizedCount,
    costFor: costFor,
    infraCost: infraCost,
    advance: advance,
    clone: clone
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
