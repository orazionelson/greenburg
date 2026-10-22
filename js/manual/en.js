/* Greenburg – players' rules (English).
 * Rules for players; artwork briefs and technical notes are in docs/regolamento.md. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};
  BV.MANUAL = BV.MANUAL || {};

  BV.MANUAL.en = {
    title: 'Greenburg rules',
    sections: [
      {
        id: 'premessa',
        title: 'Goal of the game',
        html: `
<p>Greenburg is a game for 3 or 4 players, aged 10 and up, lasting at most 20 minutes. Each player governs a <b>district</b> of a city that starts out polluted, paved over and linked by run-down roads and railways.</p>
<p>Over six years of play, from 2025 to 2030, you transform the districts: polluting surfaces and plants give way to green spaces, sustainable mobility and renewable energy, buildings are retrofitted and transport networks renewed.</p>
<p>The game works by subtraction. Every district starts at <b>14 emissions</b> and every intervention removes a source. At the end of each year every player scores points equal to the reduction already achieved: an intervention made in 2025 scores for six years, the same one made in 2029 for two.</p>
<p>There are two goals:</p>
<ul>
  <li><b>Cooperative:</b> bring the emissions of the whole city down to the threshold (10 with 3 players, 13 with 4) by the end of 2030. If the city fails, everyone's score is halved.</li>
  <li><b>Competitive:</b> collect more impact points than the others.</li>
</ul>`
      },
      {
        id: 'tabellone',
        title: 'The board',
        html: `
<p>The districts form a ring: <b>Castle</b>, <b>Bridge</b>, <b>Market</b> and <b>Station</b>, clockwise (with 3 players the first three are used, in a triangle). Between one district and the next run two network sections: the <b>road</b> on the outside and the <b>railway</b> on the inside. Each player owns the two sections linking their district to the next one clockwise.</p>
<p>Each district has a 3 × 3 grid:</p>
<ul>
  <li>six land spaces (T1-T6) holding the <b>grey tiles</b>: four emit 1 (degraded surfaces such as car parks, squares, concrete courtyards, polluted ponds, neglected woodland, scrapyards, abandoned building sites, concreted streams) and two emit 2 (direct sources such as petrol stations, diesel bus depots, landfills, brick kilns). The pictures change from game to game, the values do not;</li>
  <li>two building spaces (E1, E2) holding the <b>buildings</b>, which emit 2 on their grey side;</li>
  <li>the crest in the middle.</li>
</ul>
<p>Each run-down network section emits 1. In total: 8 from land tiles, 4 from buildings and 2 from networks, that is 14.</p>
<p>Next to the board is the common area: current year, city emissions with the threshold, investment cards and network tokens, the face-up infrastructure tiles (the display) and the five role cards.</p>`
      },
      {
        id: 'preparazione',
        title: 'Setup',
        html: `
<p>The app sets the game up for you:</p>
<ul>
  <li>each district draws four grey tiles worth 1 and two worth 2 at random, laid out at random; each district gets two random buildings, grey side up;</li>
  <li>all roads and railways start run-down;</li>
  <li>every player has 3 credits and 0 points;</li>
  <li>as many infrastructure tiles as players plus one are revealed;</li>
  <li>the Key to the City, marking the first player, goes to a random player.</li>
</ul>
<p>On the start screen you choose the number and names of the players and the time limit per move (see <a href="#m-tempo">Time per move</a>).</p>`
      },
      {
        id: 'anno',
        title: 'Playing a year',
        html: `
<p>Each year has two phases.</p>
<h4>Phase A: choosing roles</h4>
<p>Starting with the holder of the Key to the City and going clockwise, each player chooses a role card not yet chosen this year and takes the credits accumulated on it. The role is carried out at once: <b>everyone</b> performs its action, one at a time, starting with whoever chose the role, who also applies the <b>privilege</b>. Then the next player chooses.</p>
<p>The phase ends when every player has chosen a role: two roles stay unchosen with 3 players, one with 4.</p>
<h4>Phase B: end of the year</h4>
<ol>
  <li><b>Accumulation:</b> each unchosen role gets 1 credit, which stays on the card.</li>
  <li><b>Emissions:</b> the emissions of every district and of the city are calculated.</li>
  <li><b>Points:</b> each player scores 14 minus their district's emissions.</li>
  <li><b>End?</b> If the city is at or below the threshold, or 2030 has just ended, the game is over.</li>
  <li><b>New year:</b> the tiles left in the display are discarded and new ones revealed. If nobody chose the Mayor, the Key passes to the player on the left.</li>
</ol>`
      },
      {
        id: 'ruoli',
        title: 'The roles',
        html: `
<dl class="manual-roles">
  <dt>Urban Planner</dt>
  <dd>Each player may take a tile from the display, pay its cost and place it on one of their own grey land tiles, which is removed. Whoever chose the role pays 1 less (minimum 0). The display is not refilled during the year.</dd>
  <dt>Public Works Councillor</dt>
  <dd>Each player may do one of these: retrofit one of their buildings (4 credits, the tile flips to its decarbonised side); renew one of their network sections (2 credits, the tile flips); buy one of the investment cards on the table not yet taken. Whoever chose the role pays 1 less.</dd>
  <dt>Budget Councillor</dt>
  <dd>Each player collects the income of their infrastructure. Whoever chose the role collects 1 extra credit.</dd>
  <dt>EU Grant Writer</dt>
  <dd>Whoever chooses it collects 2 credits. The others do nothing.</dd>
  <dt>Mayor</dt>
  <dd>Whoever chooses it collects 1 credit and takes the Key to the City: they choose first next year.</dd>
</dl>
<p>You may always pass. A player with no possible move (no credits, no grey tiles, empty display) passes automatically.</p>`
      },
      {
        id: 'tessere',
        title: 'Infrastructure, buildings and networks',
        html: `
<p>Infrastructure tiles come in three families. Any infrastructure can be placed on any grey tile: <b>the reduction depends on the grey tile removed</b>, the income on the infrastructure placed.</p>
<table class="manual-table">
  <thead><tr><th>Family</th><th>Cost</th><th>Income</th></tr></thead>
  <tbody>
    <tr><td>Green (park, community garden, woodland, rain garden)</td><td>1</td><td>0</td></tr>
    <tr><td>Mobility (bike station, electric bus, pedestrian zone, shared mobility)</td><td>2</td><td>1</td></tr>
    <tr><td>Energy (solar farm, micro-wind, community storage)</td><td>3</td><td>2</td></tr>
  </tbody>
</table>
<p><b>Buildings:</b> the grey side emits 2, the decarbonised side 0. Decarbonised buildings count for Satellite monitoring.</p>
<p><b>Networks:</b> a run-down section emits 1, a renewed one 0. When <b>every</b> section of a network (road or railway) is renewed, the network is completed and every district emits 1 less for the rest of the game.</p>
<p><b>Investment cards:</b> at the start, as many as the players plus one are revealed at random. They are bought with the Public Works Councillor; each card exists once and each player may own at most 2. They score at the end of the game:</p>
<table class="manual-table">
  <thead><tr><th>Investment</th><th>Cost</th><th>Points at the end</th></tr></thead>
  <tbody>
    <tr><td>Satellite monitoring</td><td>5</td><td>4 per decarbonised building (8 max)</td></tr>
    <tr><td>Civic participation</td><td>5</td><td>2 per Green infrastructure (8 max)</td></tr>
    <tr><td>Health and education</td><td>5</td><td>7 minus your district's emissions</td></tr>
    <tr><td>Circular economy</td><td>5</td><td>3 per area worth 2 turned into Mobility or Energy (6 max)</td></tr>
    <tr><td>Covenant of Mayors</td><td>4</td><td>if the city reaches the threshold: 4, plus 2 per year ahead of 2030 (8 max)</td></tr>
    <tr><td>Digital city and open data</td><td>5</td><td>2 per kind of intervention: Green, Mobility, Energy, building, network (10 max)</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'emissioni',
        title: 'Calculating emissions',
        html: `
<p>A district's emissions are the sum of:</p>
<ul>
  <li>the value of each grey land tile still in place (1 or 2);</li>
  <li>2 for each building still on its grey side;</li>
  <li>1 for each of its own network sections still run-down;</li>
</ul>
<p>minus 1 for each completed network. The result never goes below 0. The city's emissions are the sum of all districts.</p>
<p>A player who does not renew their section keeps paying its emission and denies everyone the network bonus: the delay costs them more than anyone else.</p>`
      },
      {
        id: 'tempo',
        title: 'Time per move',
        html: `
<p>Every time a player has to decide (choose a role, or take their Urban Planner or Public Works action) their timer starts. The time limit is set at the start of the game: usually <b>2 minutes</b>, or 0 to play without a limit.</p>
<p>Once over the limit, the player loses <b>1 impact point every 10 seconds</b> until they make their move. The penalty comes straight off the score, appears in the log and in the player's panel, and does not change emissions or the city threshold.</p>
<p>The timer stops while a window is open (year summary, rules) and starts again from zero at every new decision.</p>`
      },
      {
        id: 'punteggio',
        title: 'Scoring and end of the game',
        html: `
<ul>
  <li><b>At the end of each year</b> each player scores 14 minus their district's emissions: from 0 (no intervention) to 14 (zero-emission district).</li>
  <li><b>At the end of the game</b> each player adds the points of their investment cards.</li>
  <li>Time penalties are subtracted from the total.</li>
</ul>
<p><b>City success:</b> if at the end of a year the city's emissions are at or below the threshold, the game ends at once, even before 2030, and scores stay whole.</p>
<p><b>Failure:</b> if the city is above the threshold at the end of 2030, every player's total is halved (rounded down).</p>
<p><b>Winner:</b> the highest final score. Ties go to the lowest emissions, then to the most credits; otherwise the victory is shared. An individual victory in a city that failed is only a partial result.</p>`
      },
      {
        id: 'consigli',
        title: 'Tips',
        html: `
<ul>
  <li><b>Time matters:</b> an intervention is worth more the earlier it is made. In the first years, spend everything on reductions.</li>
  <li><b>Where to build:</b> a 1-credit Green tile on a Petrol station cuts 2. Pricier infrastructure only pays back through income, that is if the Budget Councillor is chosen again.</li>
  <li><b>Choosing roles:</b> every role helps everyone, but whoever chooses it gets the privilege and decides when it happens. The Urban Planner when the others are out of credits is almost all yours; ignored roles build up credits and grow more tempting.</li>
  <li><b>Networks:</b> renewing your section scores 1 point a year right away and brings the bonus closer for all. Holding back to deny the bonus costs you more than the others.</li>
  <li><b>Investments</b> are usually worth 4–7 points: buy one when the card rewards something you are already doing, or can still do in the years left. The Covenant of Mayors only pays if the city succeeds: a bet on cooperation.</li>
  <li><b>Cooperate and compete:</b> the leader wants to end the game early by reaching the threshold; those behind can only catch up by cutting their own emissions faster.</li>
</ul>`
      },
      {
        id: 'app',
        title: 'Using the app',
        html: `
<ul>
  <li>Possible moves flash yellow: play them by clicking the board or with the buttons in the right-hand panel.</li>
  <li>For the Urban Planner, first pick a tile from the display, then the grey tile to build on.</li>
  <li>Hover over a tile, or long-press it on a touch screen, to see its name, text and values.</li>
  <li>The game saves itself in the browser and can be resumed from the start screen.</li>
</ul>`
      }
    ]
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
