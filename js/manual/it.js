/* Borgo Verde – manuale dei giocatori (italiano).
 * Regole per chi gioca; descrizioni per l'illustratore e note tecniche sono in docs/regolamento.md. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};
  BV.MANUAL = BV.MANUAL || {};

  BV.MANUAL.it = {
    title: 'Manuale di Borgo Verde',
    sections: [
      {
        id: 'premessa',
        title: 'Lo scopo del gioco',
        html: `
<p>Borgo Verde è un gioco per 3 o 4 giocatori, dai 10 anni in su, che dura al massimo 20 minuti. Ogni giocatore governa un <b>Municipio</b> di una città che all'inizio è inquinata, impermeabile e collegata da strade e ferrovie in cattivo stato.</p>
<p>In sei anni di gioco, dal 2025 al 2030, si trasformano i Municipi: si sostituiscono superfici e impianti inquinanti con verde, mobilità sostenibile ed energia rinnovabile, si riqualificano gli edifici e si rinnovano le reti di trasporto.</p>
<p>Il gioco procede per sottrazione. Ogni Municipio parte da <b>14 di emissione</b> e ogni intervento toglie una fonte. A ogni fine anno ogni giocatore guadagna punti pari alla riduzione già ottenuta: un intervento fatto nel 2025 rende per sei anni, lo stesso fatto nel 2029 per due.</p>
<p>Ci sono due obiettivi:</p>
<ul>
  <li><b>Cooperativo:</b> portare le emissioni dell'intera città sotto la soglia (10 con 3 giocatori, 13 con 4) entro la fine del 2030. Se la città fallisce, i punteggi di tutti vengono dimezzati.</li>
  <li><b>Competitivo:</b> accumulare più punti impatto degli altri.</li>
</ul>`
      },
      {
        id: 'tabellone',
        title: 'Il tabellone',
        html: `
<p>I Municipi formano un anello: <b>Castello</b>, <b>Ponte</b>, <b>Mercato</b> e <b>Stazione</b> in senso orario (con 3 giocatori si usano i primi tre, a triangolo). Fra un Municipio e il successivo corrono due tratti di rete: la <b>strada</b> all'esterno e la <b>ferrovia</b> all'interno. Ogni giocatore possiede i due tratti che collegano il proprio Municipio a quello successivo in senso orario.</p>
<p>Ogni Municipio ha una griglia 3 × 3:</p>
<ul>
  <li>sei caselle territoriali (T1-T6) con le <b>tessere grigie</b>: quattro emettono 1 (superfici degradate come parcheggi, piazzali, cortili cementati, laghetti sporchi, boschi abbandonati, sfasciacarrozze, cantieri abbandonati, argini cementati) e due emettono 2 (fonti dirette come distributori, depositi di autobus diesel, discariche, fornaci). I disegni cambiano da partita a partita, i valori no;</li>
  <li>due caselle edilizie (E1, E2) con gli <b>edifici</b>, che sul lato grigio emettono 2;</li>
  <li>al centro lo stemma.</li>
</ul>
<p>Ogni tratto di rete dissestato emette 1. In tutto: 8 dalle tessere territoriali, 4 dagli edifici e 2 dalle reti, cioè 14.</p>
<p>A fianco del tabellone c'è l'area comune: anno in corso, emissioni della città con la soglia, satellite e segnalini delle reti, tessere infrastruttura scoperte (l'esposizione) e le cinque carte ruolo.</p>`
      },
      {
        id: 'preparazione',
        title: 'Preparazione',
        html: `
<p>L'app prepara la partita da sola:</p>
<ul>
  <li>ogni Municipio pesca a caso quattro tessere grigie da 1 e due da 2, disposte a caso; ogni Municipio riceve due edifici pescati a caso, sul lato grigio;</li>
  <li>tutte le strade e le ferrovie partono dissestate;</li>
  <li>ogni giocatore ha 3 crediti e 0 punti;</li>
  <li>si scoprono tante tessere infrastruttura quanti sono i giocatori più uno;</li>
  <li>la Chiave della città, che indica il primo giocatore, va a un giocatore a caso.</li>
</ul>
<p>Nella schermata iniziale si scelgono il numero e i nomi dei giocatori e il tempo massimo per mossa (vedi <a href="#m-tempo">Tempo per mossa</a>).</p>`
      },
      {
        id: 'anno',
        title: 'Svolgimento di un anno',
        html: `
<p>Ogni anno ha due fasi.</p>
<h4>Fase A: scelta dei ruoli</h4>
<p>A partire da chi ha la Chiave della città e poi in senso orario, ogni giocatore sceglie una carta ruolo fra quelle non ancora scelte nell'anno e prende i crediti accumulati sulla carta. Il ruolo si esegue subito: l'<b>azione per tutti</b> la svolgono tutti i giocatori, uno alla volta, a cominciare da chi ha scelto il ruolo; chi l'ha scelto applica anche il <b>privilegio</b>. Poi sceglie il giocatore successivo.</p>
<p>La fase finisce quando ogni giocatore ha scelto un ruolo: restano non scelti due ruoli con 3 giocatori e uno con 4.</p>
<h4>Fase B: chiusura dell'anno</h4>
<ol>
  <li><b>Accumulo:</b> ogni ruolo non scelto riceve 1 credito, che resta sulla carta.</li>
  <li><b>Emissioni:</b> si calcolano le emissioni di ogni Municipio e della città.</li>
  <li><b>Punti:</b> ogni giocatore guadagna 14 meno le emissioni del proprio Municipio.</li>
  <li><b>Fine?</b> Se la città è pari o sotto la soglia, oppure se si è chiuso il 2030, la partita termina.</li>
  <li><b>Anno nuovo:</b> le tessere rimaste nell'esposizione vanno negli scarti e se ne scoprono di nuove. Se nessuno ha scelto il Sindaco, la Chiave passa al giocatore a sinistra.</li>
</ol>`
      },
      {
        id: 'ruoli',
        title: 'I ruoli',
        html: `
<dl class="manual-roles">
  <dt>Urbanista</dt>
  <dd>Ogni giocatore può prendere una tessera dell'esposizione, pagarne il costo e posarla su una propria tessera grigia territoriale, che viene rimossa. Chi ha scelto il ruolo paga 1 in meno (minimo 0). L'esposizione non si ricostituisce durante l'anno.</dd>
  <dt>Assessore ai lavori pubblici</dt>
  <dd>Ogni giocatore può fare una sola di queste azioni: riconvertire un proprio edificio (4 crediti, la tessera si gira sul lato decarbonizzato); rinnovare uno dei propri tratti di rete (2 crediti, la tessera si gira); acquistare il Monitoraggio satellitare (5 crediti, se nessuno lo ha ancora). Chi ha scelto il ruolo paga 1 in meno.</dd>
  <dt>Assessore al bilancio</dt>
  <dd>Ogni giocatore incassa la rendita delle proprie infrastrutture. Chi ha scelto il ruolo incassa 1 credito in più.</dd>
  <dt>Progettista europeo</dt>
  <dd>Chi lo sceglie incassa 2 crediti. Gli altri non fanno nulla.</dd>
  <dt>Sindaco</dt>
  <dd>Chi lo sceglie incassa 1 credito e prende la Chiave della città: sarà il primo a scegliere l'anno successivo.</dd>
</dl>
<p>Si può sempre rinunciare. Chi non ha mosse possibili (niente crediti, niente tessere grigie, esposizione vuota) rinuncia automaticamente.</p>`
      },
      {
        id: 'tessere',
        title: 'Infrastrutture, edifici e reti',
        html: `
<p>Le tessere infrastruttura sono di tre famiglie. Qualunque infrastruttura si può posare su qualunque tessera grigia: <b>la riduzione dipende dalla tessera grigia rimossa</b>, la rendita dall'infrastruttura posata.</p>
<table class="manual-table">
  <thead><tr><th>Famiglia</th><th>Costo</th><th>Rendita</th></tr></thead>
  <tbody>
    <tr><td>Verde (parco, orto, bosco, giardino della pioggia)</td><td>1</td><td>0</td></tr>
    <tr><td>Mobilità (ciclostazione, bus elettrico, zona pedonale, mobilità condivisa)</td><td>2</td><td>1</td></tr>
    <tr><td>Energia (fotovoltaico, minieolico, accumulo)</td><td>3</td><td>2</td></tr>
  </tbody>
</table>
<p><b>Edifici:</b> il lato grigio emette 2, quello decarbonizzato 0. Gli edifici decarbonizzati valgono per il satellite.</p>
<p><b>Reti:</b> un tratto dissestato emette 1, rinnovato 0. Quando <b>tutti</b> i tratti di una rete (strada o ferrovia) sono rinnovati, la rete è completata e ogni Municipio emette 1 in meno per il resto della partita.</p>
<p><b>Monitoraggio satellitare:</b> una sola copia. A fine partita il proprietario guadagna 3 punti per ogni edificio decarbonizzato del proprio Municipio (al massimo 6).</p>`
      },
      {
        id: 'emissioni',
        title: 'Calcolo delle emissioni',
        html: `
<p>Le emissioni di un Municipio sono la somma di:</p>
<ul>
  <li>il valore di ogni tessera grigia territoriale ancora presente (1 o 2);</li>
  <li>2 per ogni edificio ancora sul lato grigio;</li>
  <li>1 per ogni proprio tratto di rete ancora dissestato;</li>
</ul>
<p>meno 1 per ogni rete completata. Il risultato non scende mai sotto 0. Le emissioni della città sono la somma di quelle dei Municipi.</p>
<p>Chi non rinnova il proprio tratto continua a pagarne l'emissione e impedisce a tutti il bonus di rete: il ritardo costa più a lui che agli altri.</p>`
      },
      {
        id: 'tempo',
        title: 'Tempo per mossa',
        html: `
<p>Ogni volta che un giocatore deve decidere (scegliere un ruolo, oppure fare la propria azione da Urbanista o da Lavori pubblici) parte il suo timer. Il tempo massimo si sceglie a inizio partita: di solito <b>2 minuti</b>, oppure 0 per giocare senza limite.</p>
<p>Superato il tempo massimo, il giocatore perde <b>1 punto impatto ogni 10 secondi</b> finché non fa la sua mossa. Il malus si toglie subito dal punteggio, compare nel registro e nel pannello del giocatore, e non cambia le emissioni né la soglia della città.</p>
<p>Il timer si ferma mentre è aperta una finestra (riepilogo dell'anno, manuale) e riparte da zero a ogni nuova decisione.</p>`
      },
      {
        id: 'punteggio',
        title: 'Punteggio e fine della partita',
        html: `
<ul>
  <li><b>A ogni fine anno</b> ogni giocatore guadagna 14 meno le emissioni del proprio Municipio: da 0 (nessun intervento) a 14 (Municipio a emissioni zero).</li>
  <li><b>A fine partita</b> il proprietario del satellite guadagna 3 punti per ogni edificio decarbonizzato.</li>
  <li>I malus di tempo si tolgono dal totale.</li>
</ul>
<p><b>Successo della città:</b> se alla chiusura di un anno le emissioni della città sono pari o sotto la soglia, la partita finisce subito, anche prima del 2030, e i punteggi restano interi.</p>
<p><b>Fallimento:</b> se a fine 2030 la città è sopra la soglia, il totale di ogni giocatore viene dimezzato (arrotondato per difetto).</p>
<p><b>Vincitore:</b> il punteggio finale più alto. In caso di parità vince chi ha le emissioni più basse, poi chi ha più crediti; altrimenti la vittoria è condivisa. Una vittoria individuale in una città che ha fallito vale solo come risultato parziale.</p>`
      },
      {
        id: 'consigli',
        title: 'Consigli di gioco',
        html: `
<ul>
  <li><b>Il tempo conta:</b> un intervento vale tanto di più quanto prima viene fatto. Nei primi anni conviene spendere tutto in riduzioni.</li>
  <li><b>Dove posare:</b> un Verde da 1 credito sopra un Distributore riduce di 2. Le infrastrutture più care si ripagano solo con la rendita, cioè se l'Assessore al bilancio verrà scelto ancora.</li>
  <li><b>Scegliere i ruoli:</b> ogni ruolo aiuta tutti, ma chi lo sceglie ha il privilegio e decide quando succede. L'Urbanista quando gli altri sono senza crediti è quasi tutto per te; i ruoli ignorati accumulano crediti e diventano più appetibili.</li>
  <li><b>Le reti:</b> rinnovare il proprio tratto rende subito 1 punto l'anno e avvicina il bonus per tutti. Ritardare per negare il bonus costa più a te che agli altri.</li>
  <li><b>Il satellite</b> vale fino a 6 punti, ma solo se riconverti i tuoi edifici: è un investimento per chi ha già un'economia avviata.</li>
  <li><b>Cooperare e competere:</b> chi è in testa ha interesse a chiudere presto la partita raggiungendo la soglia; chi insegue recupera solo riducendo le proprie emissioni più in fretta.</li>
</ul>`
      },
      {
        id: 'app',
        title: "Come si usa l'app",
        html: `
<ul>
  <li>Le mosse possibili lampeggiano in giallo: si giocano cliccando sul tabellone o con i pulsanti del pannello a destra.</li>
  <li>Per l'Urbanista si sceglie prima una tessera dell'esposizione, poi la tessera grigia su cui posarla.</li>
  <li>Passa il puntatore su una tessera, oppure tienila premuta su uno schermo tattile, per vederne nome, testo e valori.</li>
  <li>La partita si salva da sola nel browser e si riprende dalla schermata iniziale.</li>
</ul>`
      }
    ]
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
