#!/usr/bin/env node
/* Generates the placeholder SVG tiles in assets/tiles/.
 * The images carry no words (only drawings, value icons and numbers): names and
 * printed texts are rendered by the app in the current language. Final
 * illustrations replace these files keeping the same names.
 * Two-sided tiles: _front = initial side (grey / run-down), _back = transformed. */
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'tiles');
fs.mkdirSync(OUT, { recursive: true });

const P = {
  grey: '#8f8b83', greyDark: '#5f5b55', greyLight: '#b9b4aa', ochre: '#a8916a',
  brown: '#6e5a44', haze: '#e3cf7a', smoke: '#3b3835', asphalt: '#55524e',
  green: '#6cbf55', greenDark: '#3d8b3d', grass: '#9fd36f', blue: '#6fb8e0',
  water: '#7fc4e8', wood: '#d9b88a', sun: '#f6c945', cream: '#f4ecd8',
  verde: '#7cc461', mobilita: '#5aa9e6', energia: '#f2c230', white: '#ffffff'
};

function svg(w, h, body, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>\n${body}\n</svg>\n`;
}
function write(name, content) {
  fs.writeFileSync(path.join(OUT, name + '.svg'), content);
}

// ---------------------------------------------------------------- icons
function cloud(x, y, n) {
  return `<g transform="translate(${x},${y})">
  <path d="M6 22 a8 8 0 0 1 2-15 a10 10 0 0 1 18-2 a8 8 0 0 1 8 10 a6 6 0 0 1-2 7z" fill="#3a3a3a" stroke="#fff" stroke-width="1.5"/>
  <text x="19" y="19" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">${n}</text></g>`;
}
function coin(x, y, n, color = '#e0b43a', ring = '#a87f12') {
  return `<g transform="translate(${x},${y})">
  <circle cx="13" cy="13" r="12" fill="${color}" stroke="${ring}" stroke-width="2"/>
  <text x="13" y="18" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle" stroke="${ring}" stroke-width="0.6">${n}</text></g>`;
}
function income(x, y, n) {
  return `<g transform="translate(${x},${y})">
  <circle cx="13" cy="13" r="12" fill="#3f9a4a" stroke="#22652b" stroke-width="2"/>
  <path d="M21 4 l4 0 l0 4 M25 4 l-5 5" stroke="#fff" stroke-width="2" fill="none"/>
  <text x="12" y="18" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">${n}</text></g>`;
}
function leaf(x, y, label) {
  return `<g transform="translate(${x},${y})">
  <path d="M4 26 C4 8 18 2 34 2 C34 18 26 30 8 30 Z" fill="#4caf50" stroke="#1f6b2a" stroke-width="1.5"/>
  <text x="19" y="21" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11" fill="#fff" text-anchor="middle">${label}</text></g>`;
}
function crossedCloud(x, y) {
  return `<g transform="translate(${x},${y})">${cloud(0, 0, '−1')}<line x1="2" y1="26" x2="34" y2="2" stroke="#e53935" stroke-width="3"/></g>`;
}
function puff(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${P.smoke}" opacity="0.75">
  <circle cx="0" cy="0" r="5"/><circle cx="6" cy="-5" r="6"/><circle cx="13" cy="-11" r="7"/></g>`;
}
function haze() {
  return `<defs><radialGradient id="hz" cx="0.9" cy="0.05" r="0.8"><stop offset="0" stop-color="${P.haze}" stop-opacity="0.75"/><stop offset="1" stop-color="${P.haze}" stop-opacity="0"/></radialGradient></defs>
  <rect width="120" height="120" fill="url(#hz)"/>`;
}
function sky() {
  return `<defs><radialGradient id="sk" cx="0.9" cy="0.05" r="0.7"><stop offset="0" stop-color="#fff6c8" stop-opacity="0.8"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs>
  <rect width="120" height="120" fill="url(#sk)"/>`;
}
// Bottom band reserved for the name (filled by the app or by the final art).
function band(color) {
  return `<rect x="0" y="96" width="120" height="24" fill="${color}"/><rect x="0" y="96" width="120" height="1.5" fill="#000" opacity="0.25"/>`;
}
function frame() {
  return `<rect x="1" y="1" width="118" height="118" rx="6" fill="none" stroke="#2b2b2b" stroke-width="2"/>`;
}

// ------------------------------------------------------------- pictures
function car(x, y, c) {
  return `<g transform="translate(${x},${y})"><rect width="14" height="8" rx="2" fill="${c}" stroke="#333" stroke-width="0.8"/><rect x="3" y="1.5" width="8" height="5" rx="1" fill="#cfd8dc" opacity="0.7"/></g>`;
}
function tree(x, y, r, c = P.greenDark) {
  return `<g><ellipse cx="${x + 2}" cy="${y + 3}" rx="${r}" ry="${r * 0.6}" fill="#000" opacity="0.15"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 2.2}" fill="#fff" opacity="0.18"/></g>`;
}
function person(x, y, c = '#455a64') {
  return `<g><circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/><rect x="${x - 1.8}" y="${y + 2}" width="3.6" height="5" rx="1.5" fill="${c}"/></g>`;
}

const GREY_ART = {
  gr_parcheggio: () => `<rect x="8" y="22" width="104" height="70" fill="${P.asphalt}"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${14 + i * 16}" y1="24" x2="${14 + i * 16}" y2="40" stroke="#ddd" stroke-dasharray="3 2" stroke-width="1.2" opacity="0.7"/><line x1="${14 + i * 16}" y1="72" x2="${14 + i * 16}" y2="90" stroke="#ddd" stroke-dasharray="3 2" stroke-width="1.2" opacity="0.7"/>`).join('')}
    ${car(16, 28, '#9e9e9e')}${car(32, 28, '#c8b99a')}${car(64, 28, '#a0524c')}${car(80, 28, '#9e9e9e')}
    ${car(16, 78, '#c8b99a')}${car(48, 78, '#7d7d7d')}${car(80, 78, '#a0524c')}
    <ellipse cx="60" cy="56" rx="12" ry="5" fill="#6d7f8f" opacity="0.6"/><path d="M50 56 q10 -4 20 0" stroke="#b39ddb" stroke-width="1" fill="none" opacity="0.8"/>
    <path d="M14 50 q4 -3 8 0 t8 0 M84 52 q4 -3 8 0 t8 0" stroke="#e8c27a" stroke-width="1.2" fill="none"/>
    <rect x="100" y="48" width="10" height="10" fill="#9e9e9e"/>${tree(105, 47, 4, '#b5a642')}`,
  gr_piazzale: () => `<rect x="6" y="18" width="108" height="76" fill="#8a8680"/>
    <g fill="#a7a7a7" stroke="#6d6d6d">${[0, 1, 2].map(i => `<rect x="${12 + i * 6}" y="${26 + i * 3}" width="22" height="6"/>`).join('')}</g>
    <rect x="70" y="70" width="22" height="5" fill="#bdbdbd" stroke="#757575"/>
    <path d="M50 50 l6 -4 l4 6 z" fill="#eeeeee" opacity="0.8"/>
    <line x1="100" y1="30" x2="100" y2="52" stroke="#555" stroke-width="2"/><circle cx="101" cy="30" r="6" fill="#d32f2f" stroke="#fff" stroke-width="1.5" transform="rotate(12 101 30)"/>
    <path d="M10 88 l10 0 M30 86 l6 2" stroke="#d7ccc8" stroke-width="2"/>`,
  gr_cortile: () => `<rect x="6" y="14" width="108" height="80" fill="#9a958c"/>
    <rect x="6" y="14" width="108" height="16" fill="#b8a98f"/><rect x="6" y="14" width="16" height="80" fill="#b8a98f"/><rect x="98" y="14" width="16" height="80" fill="#b8a98f"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 17}" y="18" width="9" height="8" fill="#6d5e4b"/>`).join('')}
    <rect x="54" y="56" width="12" height="12" fill="#444" stroke="#222"/><path d="M60 68 q4 10 -2 22" stroke="#7fa7c4" stroke-width="3" fill="none"/>
    <rect x="76" y="70" width="16" height="12" fill="#4e5b4f"/><rect x="76" y="56" width="16" height="12" fill="#5d4f3f"/>
    <circle cx="34" cy="60" r="6" fill="#7a7a7a" opacity="0.4"/><circle cx="42" cy="78" r="9" fill="#7a7a7a" opacity="0.35"/>`,
  gr_terreno: () => `<rect x="6" y="14" width="108" height="80" fill="#8c7458"/>
    <path d="M8 16 l104 0 l0 76 l-104 0 z" fill="none" stroke="#9e9e9e" stroke-width="2" stroke-dasharray="6 4"/>
    <circle cx="30" cy="40" r="7" fill="none" stroke="#222" stroke-width="4"/><circle cx="42" cy="46" r="7" fill="none" stroke="#222" stroke-width="4"/>
    <rect x="62" y="30" width="30" height="16" rx="3" fill="#cfc4b0" transform="rotate(-8 77 38)"/>
    <ellipse cx="78" cy="72" rx="14" ry="7" fill="#5d4a36"/><circle cx="30" cy="74" r="5" fill="#212121"/><circle cx="38" cy="78" r="5" fill="#212121"/>
    <path d="M96 60 l2 -8 M100 62 l3 -7 M18 58 l1 -7" stroke="#b8a46a" stroke-width="1.5"/>`,
  gr_distributore: () => `<rect x="6" y="18" width="108" height="76" fill="${P.asphalt}"/>
    <rect x="22" y="30" width="76" height="24" fill="#bdbdbd" stroke="#757575"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 17}" y="58" width="7" height="12" fill="#e0e0e0" stroke="#616161"/>`).join('')}
    ${car(10, 78, '#9e9e9e')}${car(28, 78, '#c8b99a')}${car(46, 78, '#a0524c')}
    ${puff(14, 80, 0.7)}${puff(32, 80, 0.7)}
    <rect x="70" y="74" width="36" height="12" rx="4" fill="#d6d6d6" stroke="#757575"/><ellipse cx="60" cy="66" rx="7" ry="3" fill="#3a3a3a" opacity="0.6"/>`,
  gr_deposito: () => `<rect x="6" y="18" width="108" height="76" fill="#7c776f"/>
    <rect x="12" y="24" width="64" height="44" fill="#9ea3a8" stroke="#5f6368"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${12 + i * 9}" y1="24" x2="${12 + i * 9}" y2="68" stroke="#7d8287"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="${16 + i * 20}" y="72" width="14" height="20" rx="2" fill="#d4b94a" stroke="#6d5f1f"/>`).join('')}
    ${puff(22, 94, 0.6)}${puff(42, 94, 0.6)}${puff(62, 94, 0.6)}
    <circle cx="96" cy="44" r="12" fill="#b0b0b0" stroke="#666"/><circle cx="96" cy="44" r="5" fill="#8a8a8a"/>
    <circle cx="94" cy="76" r="5" fill="none" stroke="#222" stroke-width="3"/><circle cx="104" cy="80" r="5" fill="none" stroke="#222" stroke-width="3"/>`
};

const INFRA_ART = {
  inf_parco: () => `<rect width="120" height="96" fill="${P.grass}"/><path d="M0 70 C30 50 60 80 120 40" stroke="#efe3c2" stroke-width="8" fill="none"/>
    ${tree(26, 30, 14)}${tree(86, 66, 13)}${tree(92, 22, 11, '#4f9d45')}<rect x="44" y="62" width="14" height="4" fill="${P.wood}"/><circle cx="66" cy="38" r="4" fill="${P.water}"/>${person(56, 50)}${person(36, 68, '#8d6e63')}`,
  inf_orto: () => `<rect width="120" height="96" fill="#a8d47f"/>
    ${[0, 1, 2].map(r => [0, 1].map(c => `<rect x="${10 + c * 50}" y="${10 + r * 27}" width="42" height="20" fill="#7a5a3a" stroke="${P.wood}" stroke-width="2"/>${[0, 1, 2, 3].map(k => `<circle cx="${17 + c * 50 + k * 9}" cy="${20 + r * 27}" r="3.5" fill="${['#e53935', '#66bb6a', '#ffa726', '#43a047'][(k + r) % 4]}"/>`).join('')}`).join('')).join('')}
    ${person(54, 86, '#5d4037')}`,
  inf_bosco: () => `<rect width="120" height="96" fill="#7fb35f"/>${[[20, 22, 13], [48, 16, 12], [78, 24, 14], [102, 18, 10], [30, 56, 14], [62, 50, 12], [92, 60, 13], [16, 82, 9], [52, 82, 11], [84, 86, 9]].map(([x, y, r], i) => tree(x, y, r, i % 2 ? '#2f7d32' : '#3e8e41')).join('')}
    <path d="M0 70 q30 -10 60 2 t60 -6" stroke="${P.wood}" stroke-width="3" fill="none" stroke-dasharray="5 3"/>`,
  inf_giardino: () => `<rect width="120" height="96" fill="#a5d27a"/><ellipse cx="60" cy="50" rx="44" ry="28" fill="#6aa65a"/><ellipse cx="60" cy="52" rx="30" ry="16" fill="${P.water}"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${22 + i * 11}" cy="${i % 2 ? 26 : 76}" r="4" fill="${i % 3 ? '#8e7cc3' : '#2e7d32'}"/>`).join('')}
    <rect x="104" y="4" width="6" height="40" fill="#90a4ae"/><path d="M107 44 q-10 4 -18 8" stroke="${P.water}" stroke-width="3" fill="none"/>`,
  inf_ciclostazione: () => `<rect width="120" height="96" fill="#cfe3ef"/><rect x="10" y="12" width="100" height="40" fill="${P.wood}" opacity="0.6" stroke="#8d6e4a"/>
    ${[0, 1, 2, 3, 4].map(i => `<g transform="translate(${16 + i * 19},20)"><circle cx="3" cy="14" r="5" fill="none" stroke="${['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa'][i]}" stroke-width="2"/><circle cx="13" cy="14" r="5" fill="none" stroke="${['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa'][i]}" stroke-width="2"/><path d="M3 14 l5 -7 l5 7" stroke="#555" fill="none"/></g>`).join('')}
    <rect x="20" y="64" width="8" height="18" fill="#26a69a"/><rect x="34" y="64" width="8" height="18" fill="#26a69a"/>${person(80, 70)}`,
  inf_bus: () => `<rect width="120" height="96" fill="#cfd8dc"/><rect x="0" y="54" width="120" height="30" fill="#c0504d" opacity="0.7"/>
    <rect x="14" y="58" width="76" height="22" rx="4" fill="#fff" stroke="#2e7d32" stroke-width="2"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${20 + i * 13}" y="62" width="9" height="7" fill="#90caf9"/>`).join('')}<rect x="14" y="74" width="76" height="3" fill="#43a047"/>
    <rect x="16" y="12" width="70" height="30" fill="#8fd16e" stroke="#558b2f"/><rect x="62" y="16" width="20" height="10" fill="#263238"/><rect x="65" y="19" width="14" height="2" fill="#ffca28"/>${person(30, 44)}${person(42, 44, '#6d4c41')}`,
  inf_pedonale: () => `<rect width="120" height="96" fill="#ece3d0"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="0" y1="${i * 16}" x2="120" y2="${i * 16}" stroke="#d8ccb2"/>`).join('')}
    ${tree(14, 20, 9)}${tree(14, 70, 9)}${tree(106, 20, 9)}${tree(106, 70, 9)}
    <circle cx="60" cy="30" r="10" fill="#ef5350" opacity="0.85"/><circle cx="60" cy="30" r="3" fill="#fff"/><circle cx="76" cy="62" r="10" fill="#42a5f5" opacity="0.85"/><circle cx="76" cy="62" r="3" fill="#fff"/>
    ${person(40, 52)}${person(48, 74, '#8d6e63')}${person(92, 44, '#5e35b1')}`,
  inf_condivisa: () => `<rect width="120" height="96" fill="#d6dee3"/>${[0, 1, 2, 3].map(i => `<g transform="translate(${10 + i * 26},14)"><rect width="18" height="28" rx="5" fill="${['#26c6da', '#ab47bc', '#ffca28', '#66bb6a'][i]}" stroke="#37474f"/><rect x="3" y="6" width="12" height="7" rx="2" fill="#e3f2fd"/></g><rect x="${16 + i * 26}" y="46" width="6" height="10" fill="#37474f"/>`).join('')}
    <g transform="translate(20,66)"><circle cx="0" cy="10" r="5" fill="none" stroke="#e53935" stroke-width="2"/><circle cx="12" cy="10" r="5" fill="none" stroke="#e53935" stroke-width="2"/></g>${person(80, 72)}<rect x="84" y="72" width="4" height="6" fill="#212121"/>`,
  inf_fotovoltaico: () => `<rect width="120" height="96" fill="#b5dc8a"/>${[0, 1, 2, 3].map(r => `<rect x="8" y="${8 + r * 20}" width="86" height="12" fill="#1f3c88" stroke="#90caf9" stroke-width="1"/>${[1, 2, 3, 4, 5].map(c => `<line x1="${8 + c * 14.3}" y1="${8 + r * 20}" x2="${8 + c * 14.3}" y2="${20 + r * 20}" stroke="#90caf9" stroke-width="0.6"/>`).join('')}`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${12 + i * 12}" cy="${24 + (i % 4) * 20}" r="1.6" fill="${i % 2 ? '#f48fb1' : '#fff59d'}"/>`).join('')}
    <rect x="100" y="70" width="14" height="18" fill="#fff" stroke="#999"/><ellipse cx="104" cy="30" rx="6" ry="4" fill="#fff"/>`,
  inf_eolico: () => `<rect width="120" height="96" fill="#b9e08f"/>${[[28, 30], [60, 22], [92, 32]].map(([x, y]) => `<line x1="${x}" y1="${y + 10}" x2="${x}" y2="${y + 44}" stroke="#9e9e9e" stroke-width="3"/><path d="M${x - 8} ${y - 8} C${x + 10} ${y - 2} ${x - 10} ${y + 6} ${x + 8} ${y + 12} M${x + 8} ${y - 8} C${x - 10} ${y - 2} ${x + 10} ${y + 6} ${x - 8} ${y + 12}" stroke="#fff" stroke-width="3" fill="none"/><path d="M${x - 14} ${y} a14 14 0 0 1 6 -10" stroke="#fff" stroke-width="1" fill="none" opacity="0.7"/>`).join('')}
    <path d="M0 86 q60 -12 120 0" stroke="${P.wood}" stroke-width="4" fill="none"/>${person(70, 76)}`,
  inf_accumulo: () => `<rect width="120" height="96" fill="#c9e3a5"/>${[0, 1].map(i => `<g transform="translate(${12 + i * 52},26)"><rect width="44" height="26" fill="#fafafa" stroke="#607d8b" stroke-width="2"/><rect x="14" y="7" width="14" height="12" rx="1" fill="none" stroke="#43a047" stroke-width="2"/><rect x="28" y="10" width="3" height="6" fill="#43a047"/><rect x="16" y="9" width="10" height="8" fill="#66bb6a"/><circle cx="38" cy="5" r="2" fill="#00e676"/></g>`).join('')}
    <path d="M34 26 L34 10 L100 10 M86 26 L86 10" stroke="#455a64" stroke-width="1.5" fill="none"/><rect x="88" y="4" width="22" height="8" fill="#1f3c88"/><rect x="6" y="4" width="22" height="8" fill="#1f3c88"/><path d="M28 8 L34 8" stroke="#455a64"/>
    ${person(60, 68)}<rect x="66" y="64" width="12" height="10" fill="#37474f"/>`
};

// Buildings: front (grey) and back (decarbonised).
const BUILDINGS = {
  ed_condominio: (g) => `<rect x="24" y="${g ? 10 : 10}" width="72" height="80" fill="${g ? '#9a958c' : '#f1dfc0'}" stroke="${g ? '#5f5b55' : '#b5723f'}" stroke-width="2"/>
    ${[0, 1, 2, 3, 4, 5].map(r => [0, 1, 2, 3].map(c => `<rect x="${30 + c * 16}" y="${16 + r * 12}" width="10" height="7" fill="${g ? '#6f7a80' : '#90caf9'}" stroke="${g ? '#4a4a4a' : '#b5723f'}" stroke-width="0.6"/>${g ? '' : (c % 2 ? '' : `<rect x="${30 + c * 16}" y="${23 + r * 12}" width="10" height="2" fill="#66bb6a"/>`)}`).join('')).join('')}
    ${g ? `<rect x="80" y="2" width="8" height="10" fill="#555"/>${puff(84, 0, 0.8)}<path d="M28 30 l0 20 M60 18 l0 30" stroke="#6b665e" stroke-width="2" opacity="0.6"/>`
        : `${[0, 1, 2, 3].map(i => `<rect x="${28 + i * 17}" y="4" width="14" height="6" fill="#1f3c88" stroke="#90caf9" stroke-width="0.6"/>`).join('')}${person(84, 40, '#2e7d32')}`}`,
  ed_scuola: (g) => `<rect x="10" y="12" width="100" height="40" fill="${g ? '#a39d92' : '#f3e2c4'}" stroke="${g ? '#5f5b55' : '#9c6b3c'}" stroke-width="2"/>
    ${g ? '' : `<rect x="10" y="8" width="100" height="6" fill="#6abf4b"/>`}
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${16 + i * 13}" y="24" width="10" height="12" fill="${g ? '#6f7a80' : '#90caf9'}"/>${g ? '' : `<line x1="${16 + i * 13}" y1="24" x2="${16 + i * 13}" y2="36" stroke="${P.wood}" stroke-width="2"/>`}`).join('')}
    <circle cx="60" cy="18" r="4" fill="#fff" stroke="#333"/>
    <rect x="10" y="56" width="100" height="36" fill="${g ? P.asphalt : '#a5d27a'}"/>
    ${g ? `<rect x="90" y="60" width="3" height="16" fill="#ddd"/><circle cx="91" cy="60" r="4" fill="none" stroke="#e65100" stroke-width="1.5"/>${puff(104, 14, 0.7)}`
        : `${[0, 1, 2].map(i => `<rect x="${18 + i * 28}" y="64" width="20" height="10" fill="#7a5a3a" stroke="${P.wood}"/>`).join('')}${tree(98, 76, 8)}${person(40, 80)}${person(56, 82, '#e91e63')}`}`,
  ed_uffici: (g) => `<rect x="28" y="6" width="64" height="86" fill="${g ? '#4b5763' : '#e8dcc6'}" stroke="${g ? '#2b333b' : '#8d6e4a'}" stroke-width="2"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(r => [0, 1, 2, 3, 4].map(c => `<rect x="${32 + c * 12}" y="${12 + r * 10}" width="8" height="6" fill="${g ? '#ffe082' : ((r + c) % 3 ? '#90caf9' : '#ffe082')}"/>`).join('')).join('')}
    ${g ? `${[0, 1, 2].map(i => `<rect x="${34 + i * 18}" y="0" width="12" height="6" fill="#9e9e9e"/>`).join('')}<path d="M36 -2 q3 -4 6 0 M54 -2 q3 -4 6 0" stroke="#e8c27a" fill="none"/>`
        : `${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<line x1="${31 + i * 6.4}" y1="8" x2="${31 + i * 6.4}" y2="90" stroke="${P.wood}" stroke-width="1.6"/>`).join('')}<rect x="28" y="2" width="64" height="6" fill="#6abf4b"/>`}`,
  ed_capannone: (g) => `<rect x="8" y="14" width="92" height="56" fill="${g ? '#8d939a' : '#1f3c88'}" stroke="${g ? '#5f6368' : '#0d2257'}" stroke-width="2"/>
    ${[0, 1, 2, 3].map(i => `<path d="M${8 + i * 23} 14 l23 0 l0 56" fill="none" stroke="${g ? '#70757a' : '#90caf9'}" stroke-width="1.2"/>`).join('')}
    <rect x="40" y="56" width="26" height="14" fill="#5d5d5d"/>
    ${g ? `<rect x="88" y="4" width="6" height="12" fill="#666"/>${puff(92, 2, 0.7)}<rect x="70" y="76" width="26" height="14" rx="2" fill="#bdbdbd" stroke="#666"/>${puff(68, 86, 0.5)}`
        : `<rect x="64" y="76" width="26" height="14" rx="2" fill="#fff" stroke="#2e7d32"/><rect x="94" y="76" width="6" height="14" fill="#26a69a"/><path d="M100 40 C108 40 110 60 114 70" stroke="#ffca28" stroke-width="2" fill="none" stroke-dasharray="3 2"/><rect x="104" y="70" width="12" height="10" fill="#f1dfc0" stroke="#9c6b3c"/>`}`
};

// ---------------------------------------------------------------- tiles
const GREY = { gr_parcheggio: 1, gr_piazzale: 1, gr_cortile: 1, gr_terreno: 1, gr_distributore: 2, gr_deposito: 2 };
for (const [id, e] of Object.entries(GREY)) {
  const smoke = e === 2 ? puff(96, 30, 1) + puff(80, 22, 0.8) : '';
  write(id, svg(120, 120, `<rect width="120" height="120" fill="${P.grey}"/>
  ${GREY_ART[id]()}
  ${haze()}${smoke}
  ${band('#d9d2c3')}
  ${cloud(4, 2, e)}
  ${frame()}`));
}

const FAMILY = {
  inf_parco: 'verde', inf_orto: 'verde', inf_bosco: 'verde', inf_giardino: 'verde',
  inf_ciclostazione: 'mobilita', inf_bus: 'mobilita', inf_pedonale: 'mobilita', inf_condivisa: 'mobilita',
  inf_fotovoltaico: 'energia', inf_eolico: 'energia', inf_accumulo: 'energia'
};
const FAM_VALUES = { verde: [1, 0], mobilita: [2, 1], energia: [3, 2] };
for (const [id, fam] of Object.entries(FAMILY)) {
  const [c, r] = FAM_VALUES[fam];
  write(id, svg(120, 120, `<rect width="120" height="120" fill="#e8f5e9"/>
  ${INFRA_ART[id]()}
  ${sky()}
  ${band(P[fam])}
  ${coin(4, 4, c)}${income(91, 4, r)}
  ${frame()}`));
}

for (const [id, draw] of Object.entries(BUILDINGS)) {
  write(id + '_front', svg(120, 120, `<rect width="120" height="120" fill="${P.greyLight}"/>
  ${draw(true)}${haze()}
  ${band('#d9d2c3')}
  ${cloud(4, 2, 2)}${coin(91, 4, 4)}
  ${frame()}`));
  write(id + '_back', svg(120, 120, `<rect width="120" height="120" fill="#d7ecc6"/>
  ${draw(false)}${sky()}
  ${band('#a9dc8c')}
  ${cloud(4, 2, 0)}
  ${frame()}`));
}

// Network tiles: 3:1, road outside / railway inside the ring.
function road(renewed) {
  if (!renewed) {
    return `<rect width="360" height="120" fill="#8b857b"/><rect y="20" width="360" height="80" fill="${P.asphalt}"/>
    <line x1="0" y1="60" x2="360" y2="60" stroke="#ddd" stroke-width="3" stroke-dasharray="20 30" opacity="0.4"/>
    ${[40, 130, 250, 310].map(x => `<path d="M${x} 30 l8 10 l-4 8 l10 12" stroke="#2f2d2a" stroke-width="2" fill="none"/>`).join('')}
    ${[70, 200].map(x => `<ellipse cx="${x}" cy="82" rx="10" ry="5" fill="#6d5d4b"/>`).join('')}
    ${[100, 122, 144, 166, 188].map((x, i) => car(x, i % 2 ? 66 : 38, ['#9e9e9e', '#c8b99a', '#a0524c'][i % 3])).join('')}
    ${puff(104, 40, 0.6)}${puff(148, 40, 0.6)}${puff(192, 40, 0.6)}
    <defs><linearGradient id="smog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.haze}" stop-opacity="0.7"/><stop offset="1" stop-color="${P.haze}" stop-opacity="0"/></linearGradient></defs><rect width="360" height="70" fill="url(#smog)"/>
    ${cloud(6, 4, 1)}`;
  }
  return `<rect width="360" height="120" fill="#a5d27a"/><rect y="14" width="360" height="92" fill="#dfe6e9"/>
    <rect y="22" width="360" height="26" fill="#3e4247"/><rect y="48" width="360" height="26" fill="#a0524c" opacity="0.85"/><rect y="78" width="360" height="18" fill="#5fae4e"/>
    <line x1="0" y1="35" x2="360" y2="35" stroke="#fff" stroke-width="2" stroke-dasharray="16 16"/>
    <g transform="translate(140,51)"><rect width="70" height="20" rx="4" fill="#fff" stroke="#2e7d32" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<rect x="${6 + i * 15}" y="4" width="10" height="7" fill="#90caf9"/>`).join('')}</g>
    ${[60, 250].map(x => `<g transform="translate(${x},80)"><circle cx="0" cy="8" r="5" fill="none" stroke="#1e88e5" stroke-width="2"/><circle cx="12" cy="8" r="5" fill="none" stroke="#1e88e5" stroke-width="2"/></g>`).join('')}
    ${[20, 90, 160, 230, 300].map(x => tree(x, 10, 7) + tree(x + 30, 110, 7)).join('')}
    ${cloud(6, 4, 0)}`;
}
function rail(renewed) {
  if (!renewed) {
    return `<rect width="360" height="120" fill="#8c7c63"/><rect y="30" width="360" height="60" fill="#7a6b58"/>
    ${Array.from({ length: 30 }, (_, i) => i % 5 === 3 ? '' : `<rect x="${i * 12 + 2}" y="42" width="6" height="36" fill="#5a4632" transform="rotate(${(i * 7) % 9 - 4} ${i * 12 + 5} 60)"/>`).join('')}
    <line x1="0" y1="50" x2="360" y2="50" stroke="#8d4b2b" stroke-width="4"/><line x1="0" y1="70" x2="360" y2="70" stroke="#8d4b2b" stroke-width="4"/>
    <g transform="translate(150,44)"><rect width="40" height="32" rx="3" fill="#a0524c" stroke="#5d2a26"/><rect x="44" width="46" height="32" rx="3" fill="#9e9a8f"/><rect x="94" width="46" height="32" rx="3" fill="#9e9a8f"/></g>
    ${puff(140, 50, 1)}${puff(122, 40, 1.2)}
    ${[30, 80, 260, 320].map(x => `<path d="M${x} 96 l3 -8 M${x + 6} 98 l2 -9" stroke="#9e8f4a" stroke-width="2"/>`).join('')}
    ${cloud(6, 4, 1)}`;
  }
  return `<rect width="360" height="120" fill="#a5d27a"/><rect y="24" width="360" height="72" fill="#b0aaa0"/>
    ${Array.from({ length: 36 }, (_, i) => `<rect x="${i * 10 + 2}" y="28" width="5" height="64" fill="#6d6d6d"/>`).join('')}
    ${[36, 52, 68, 84].map(y => `<line x1="0" y1="${y}" x2="360" y2="${y}" stroke="#cfd8dc" stroke-width="3"/>`).join('')}
    ${[30, 120, 210, 300].map(x => `<line x1="${x}" y1="20" x2="${x}" y2="100" stroke="#455a64" stroke-width="2"/>`).join('')}<line x1="0" y1="22" x2="360" y2="22" stroke="#455a64" stroke-width="1"/>
    <g transform="translate(130,30)"><rect width="120" height="26" rx="10" fill="#fff" stroke="#2e7d32" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${12 + i * 17}" y="6" width="11" height="9" fill="#90caf9"/>`).join('')}<rect y="18" width="120" height="3" fill="#43a047"/></g>
    <rect x="270" y="98" width="50" height="14" fill="${P.wood}"/>${person(286, 100)}${person(300, 100, '#8d6e63')}
    <path d="M0 110 L360 110" stroke="#5fae4e" stroke-width="6"/>
    ${cloud(6, 4, 0)}`;
}
write('rete_strada_front', svg(360, 120, road(false) + `<rect x="1" y="1" width="358" height="118" fill="none" stroke="#2b2b2b" stroke-width="2"/>`));
write('rete_strada_back', svg(360, 120, road(true) + `<rect x="1" y="1" width="358" height="118" fill="none" stroke="#2b2b2b" stroke-width="2"/>`));
write('rete_ferrovia_front', svg(360, 120, rail(false) + `<rect x="1" y="1" width="358" height="118" fill="none" stroke="#2b2b2b" stroke-width="2"/>`));
write('rete_ferrovia_back', svg(360, 120, rail(true) + `<rect x="1" y="1" width="358" height="118" fill="none" stroke="#2b2b2b" stroke-width="2"/>`));

// Municipi: 3x3 board, crest in the centre, coloured border.
const MUN = {
  castello: ['#a5452f', `<path d="M-14 16 L-14 -10 L-10 -10 L-10 -16 L-5 -16 L-5 -10 L0 -10 L0 -16 L5 -16 L5 -10 L10 -10 L10 -16 L14 -16 L14 16 Z" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M-4 16 L-4 4 a4 4 0 0 1 8 0 L4 16" fill="none" stroke="#fff" stroke-width="2.5"/>`],
  ponte: ['#3a7fb8', `<path d="M-20 6 L20 6 M-20 6 a6.6 7 0 0 1 13.3 0 a6.6 7 0 0 1 13.3 0 a6.6 7 0 0 1 13.3 0" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M-20 6 L-20 -4 L20 -4 L20 6" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M-18 14 q4 -3 8 0 t8 0 t8 0 t8 0" stroke="#9fd3f5" stroke-width="2" fill="none"/>`],
  mercato: ['#c79a2b', `<path d="M0 -16 L0 14 M-10 16 L10 16 M-18 -10 L18 -10 M-18 -10 L-24 4 L-12 4 Z M18 -10 L12 4 L24 4 Z" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`],
  stazione: ['#1f5b3f', `<circle r="10" fill="none" stroke="#fff" stroke-width="2.5"/><circle r="2.5" fill="#fff"/>${[0, 45, 90, 135].map(a => `<line x1="-10" y1="0" x2="10" y2="0" stroke="#fff" stroke-width="1.5" transform="rotate(${a})"/>`).join('')}<path d="M10 -2 q10 -10 18 -4 q-6 0 -8 4 q6 -2 8 2 q-8 0 -10 4 M-10 -2 q-10 -10 -18 -4 q6 0 8 4 q-6 -2 -8 2 q8 0 10 4" fill="#fff"/>`]
};
for (const [id, [color, figure]] of Object.entries(MUN)) {
  const labels = [['T1', 0, 0], ['T2', 1, 0], ['T3', 2, 0], ['E1', 0, 1], ['E2', 2, 1], ['T4', 0, 2], ['T5', 1, 2], ['T6', 2, 2]];
  write('mun_' + id, svg(360, 360, `<rect width="360" height="360" fill="#efe4c8"/>
  <g stroke="#cdbb92" stroke-width="3" fill="none">
    <path d="M0 120 L360 120 M0 240 L360 240 M120 0 L120 360 M240 0 L240 360"/>
    <path d="M0 60 L40 60 M320 300 L360 300 M60 0 L60 30 M300 330 L300 360" stroke-width="2"/>
  </g>
  ${labels.map(([l, cx, cy]) => `<rect x="${cx * 120 + 6}" y="${cy * 120 + 6}" width="108" height="108" rx="4" fill="#f7f0de" stroke="#b9a77d" stroke-width="1.5"/><text x="${cx * 120 + 12}" y="${cy * 120 + 22}" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#9b8a63">${l}</text>`).join('')}
  <g transform="translate(180,170)">
    <path d="M-34 -38 L34 -38 L34 4 C34 28 0 42 0 42 C0 42 -34 28 -34 4 Z" fill="#3f8f3a" stroke="#fff" stroke-width="3"/>
    <path d="M0 -38 L34 -38 L34 4 C34 28 0 42 0 42 Z" fill="#fff" opacity="0.18"/>
    <g transform="translate(0,-2)">${figure}</g>
  </g>
  <path d="M132 218 L228 218 L222 232 L228 246 L132 246 L138 232 Z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
  <rect x="4" y="4" width="352" height="352" rx="10" fill="none" stroke="${color}" stroke-width="8"/>`));
}

// Satellite.
write('sat_monitoraggio', svg(120, 120, `<rect width="120" height="120" fill="#13234a"/>
  ${[[14, 40], [30, 12], [100, 44], [70, 8], [50, 30], [110, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('')}
  <g transform="translate(60,28)"><rect x="-7" y="-8" width="14" height="16" fill="#cfd8dc" stroke="#607d8b"/><rect x="-36" y="-5" width="26" height="10" fill="#1e88e5" stroke="#bbdefb"/><rect x="10" y="-5" width="26" height="10" fill="#1e88e5" stroke="#bbdefb"/><rect x="-3" y="8" width="6" height="6" fill="#90a4ae"/></g>
  <path d="M57 42 L36 64 L84 64 L63 42 Z" fill="#fffde7" opacity="0.25"/>
  <rect x="0" y="62" width="120" height="34" fill="#9ccc65"/>
  <path d="M0 96 L120 62 L120 96 Z" fill="#e53935"/><path d="M60 79 L120 62 L120 79 Z" fill="#ffb300"/><path d="M0 96 L40 85 L50 96 Z" fill="#1e88e5"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${8 + i * 28}" y="${68 + (i % 2) * 10}" width="14" height="10" fill="#fff" opacity="0.35"/>`).join('')}
  ${band('#c5cae9')}
  ${coin(4, 4, 5)}${leaf(80, 2, '3×')}
  ${frame()}`));

// Role cards: illustration on top, the app writes the texts below.
const ROLE_ART = {
  urbanista: `<rect x="20" y="64" width="120" height="50" fill="${P.wood}"/><rect x="28" y="58" width="80" height="44" fill="#fff" stroke="#90a4ae"/>${[0, 1, 2].map(i => `<line x1="${36 + i * 22}" y1="62" x2="${36 + i * 22}" y2="98" stroke="#90caf9"/>`).join('')}<path d="M30 80 L106 80" stroke="#90caf9"/>${tree(118, 74, 6)}${tree(128, 84, 5)}${person(80, 30, '#5d4037')}<path d="M74 44 L66 60" stroke="#5d4037" stroke-width="3"/>`,
  lavori: `<rect x="0" y="94" width="160" height="26" fill="#bcaaa4"/><path d="M100 20 L100 94 M100 20 L150 20 M140 20 L140 40" stroke="#fbc02d" stroke-width="4" fill="none"/><rect x="134" y="40" width="12" height="8" fill="#795548"/>${person(50, 54, '#ff9800')}<circle cx="50" cy="52" r="4" fill="#fff"/><rect x="58" y="62" width="18" height="5" fill="#e3f2fd" stroke="#90a4ae"/>`,
  bilancio: `<rect x="10" y="80" width="140" height="34" fill="#8d6e63"/><rect x="24" y="66" width="44" height="18" fill="#fff" stroke="#795548"/><rect x="76" y="68" width="20" height="16" fill="#455a64"/>${[0, 1, 2].map(i => `<g>${[0, 1, 2, 3].map(k => `<ellipse cx="${110 + i * 12}" cy="${82 - k * 4}" rx="5" ry="2" fill="#e0b43a" stroke="#a87f12" stroke-width="0.6"/>`).join('')}</g>`).join('')}<rect x="30" y="12" width="100" height="40" fill="#fff" stroke="#90a4ae"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${40 + i * 18}" y="${44 - i * 6}" width="10" height="${6 + i * 6}" fill="#43a047"/>`).join('')}`,
  progettista: `<rect x="10" y="80" width="140" height="34" fill="#90a4ae"/><rect x="50" y="62" width="44" height="22" fill="#263238"/><rect x="54" y="64" width="36" height="16" fill="#4fc3f7"/>${person(72, 40, '#3949ab')}<circle cx="128" cy="62" r="12" fill="#4fc3f7" stroke="#1565c0"/><path d="M118 58 q10 4 20 0 M120 68 q8 -4 16 0" stroke="#43a047" stroke-width="2" fill="none"/><rect x="14" y="14" width="34" height="34" fill="#fff" stroke="#90a4ae"/><circle cx="34" cy="34" r="6" fill="none" stroke="#e53935" stroke-width="2"/>${[0, 1, 2].map(i => `<rect x="${16 + i * 8}" y="60" width="8" height="20" fill="${['#ffca28', '#ef5350', '#42a5f5'][i]}"/>`).join('')}`,
  sindaco: `<rect x="20" y="20" width="120" height="74" fill="#f3e2c4" stroke="#9c6b3c"/><path d="M14 22 L80 2 L146 22 Z" fill="#c9a26b"/>${[0, 1, 2, 3].map(i => `<rect x="${32 + i * 28}" y="34" width="12" height="40" fill="#e9d5b0" stroke="#9c6b3c"/>`).join('')}${person(80, 76, '#37474f')}<path d="M77 80 L83 86" stroke="#43a047" stroke-width="2"/><path d="M78 82 L84 88" stroke="#fff" stroke-width="2"/><path d="M79 84 L85 90" stroke="#e53935" stroke-width="2"/><g transform="translate(96,78) rotate(-30)"><circle r="5" fill="none" stroke="#e0b43a" stroke-width="3"/><path d="M5 0 L22 0 M16 0 L16 5 M20 0 L20 4" stroke="#e0b43a" stroke-width="3"/></g>`
};
for (const [id, art] of Object.entries(ROLE_ART)) {
  write('ruolo_' + id, svg(160, 220, `<rect width="160" height="220" rx="10" fill="#fbf6ea"/>
  <rect x="6" y="6" width="148" height="114" rx="6" fill="#dbeedd"/>
  <g transform="translate(0,4)">${art}</g>
  <rect x="2" y="2" width="156" height="216" rx="9" fill="none" stroke="#2e7d32" stroke-width="3"/>`));
}

// Tokens.
function tokenNet(kind) {
  const mini = kind === 'strada'
    ? `<rect x="14" y="40" width="72" height="20" fill="#3e4247"/><rect x="14" y="60" width="72" height="6" fill="#5fae4e"/><line x1="14" y1="50" x2="86" y2="50" stroke="#fff" stroke-dasharray="6 6"/>`
    : `<rect x="14" y="40" width="72" height="24" fill="#b0aaa0"/><line x1="14" y1="46" x2="86" y2="46" stroke="#eceff1" stroke-width="2"/><line x1="14" y1="58" x2="86" y2="58" stroke="#eceff1" stroke-width="2"/><rect x="34" y="42" width="30" height="14" rx="4" fill="#fff" stroke="#2e7d32"/>`;
  return svg(100, 100, `<circle cx="50" cy="50" r="47" fill="#43a047" stroke="#1b5e20" stroke-width="4"/>
  <clipPath id="c"><circle cx="50" cy="50" r="40"/></clipPath><g clip-path="url(#c)">${mini}</g>
  ${crossedCloud(32, 10)}`);
}
write('token_rete_strada', tokenNet('strada'));
write('token_rete_ferrovia', tokenNet('ferrovia'));
write('token_chiave', svg(100, 100, `<circle cx="50" cy="50" r="47" fill="#fff8e1" stroke="#c9a227" stroke-width="3"/>
  <g transform="translate(50,50) rotate(-35)" stroke="#c9a227" stroke-width="7" fill="none" stroke-linecap="round">
  <circle cx="-20" cy="0" r="12"/><path d="M-8 0 L30 0 M20 0 L20 10 M28 0 L28 8"/></g>`));

console.log('Placeholders written to', path.relative(process.cwd(), OUT), '(' + fs.readdirSync(OUT).length + ' files)');
