// Dream Room prices as a widescreen poster, 16:9, for the room's TVs or a
// wide print. Same content as build.mjs (prices, food, how to pay, QR), laid
// out for landscape. Numbers mirror priceOf in DearCrisis functions/dreamRoom.js
// and the rate card: change prices there first, then here.
//   node flyer/ratecard/poster.mjs   -> flyer/ratecard/out-poster/
//     dream-room-poster-1080p.png (1920x1080), -4k.png (3840x2160), .pdf (20 x 11.25 in)
//   node flyer/ratecard/poster.mjs --bw   -> flyer/ratecard/out-poster-bw/ (black and white)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { HERE as FLYER, FONT_FACES, TOKENS, sky as skySvg, esc, chrome } from '../lib.mjs';

const require = createRequire(path.join(path.resolve(FLYER, '../../DearCrisis'), 'package.json'));
const QRCode = require('qrcode');

const BW = process.argv.includes('--bw');
const OUT = path.join(FLYER, 'ratecard', BW ? 'out-poster-bw' : 'out-poster');
const NAME = BW ? 'dream-room-poster-bw' : 'dream-room-poster';
const W = 1920, H = 1080;

const BOOK_URL = 'https://dearcrisis.com/dreamroom';
const ZELLE = 'reservations@caravanofdreams.net';
const VENMO = '@caravanofdreams';

const extraCost = (first, hours) => {
  let t = 0;
  for (let i = 0; i < hours - 3; i++) t += Math.max(first - 10 * i, 0);
  return t;
};
const HOURS = [3, 4, 5, 6, 7, 8];
const LADDER = [
  { label: 'Free or $100 + 30%', cells: HOURS.map((h) => (h === 3 ? '–' : `+$${extraCost(75, h)}`)) },
  { label: '$300 flat plan', cells: HOURS.map((h) => `$${300 + extraCost(75, h)}`), cls: 'g' },
  { label: 'Private hire', cells: HOURS.map((h) => `$${400 + extraCost(100, h)}`), cls: 'k' },
];
const BOXES = [
  { price: 'Free', unit: '15+ guests, $600 food minimum', note: 'Free room when guests spend $600 on food.' },
  { price: '$100', unit: 'plus 30% of tickets', note: 'We share the risk with you.' },
  { price: '$300', unit: 'flat', note: 'One price. You keep all ticket sales.' },
  { price: '$400', unit: 'any day of the week', note: 'Your guests only.', priv: true },
];
const FOOD = [
  ['Finger foods', 'Bites for standing events. Gluten-free options.', 'Ask for a quote'],
  ['Prix fixe dinner', 'Seated dinner from our kitchen.', '$45 per person, all in'],
  ['Tea & water', 'For everyone.', 'On the house'],
];

const qrSvg = (await QRCode.toString(BOOK_URL, {
  type: 'svg', errorCorrectionLevel: 'Q', margin: 0, color: { dark: BW ? '#000000' : '#0B1733', light: '#0000' },
})).replace('<svg', '<svg class="qr" aria-label="QR code to book the Dream Room"');

const boxes = BOXES.map((b) => `<div class="opt${b.priv ? ' priv' : ''}">
  <p class="pr">${esc(b.price)}<span>${esc(b.unit)}</span></p>
  <p class="ds">${esc(b.note)}</p>
</div>`).join('');

const table = `<table class="lad">
  <thead><tr><th>Hours in the room</th>${HOURS.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${LADDER.map((r) => `<tr class="${r.cls || ''}"><td>${esc(r.label)}</td>${r.cells.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
</table>`;

const food = FOOD.map(([t, d, p]) => `<div class="fi"><b>${esc(t)}</b><em>${esc(p)}</em><span>${esc(d)}</span></div>`).join('');

const body = `
<div class="top">
  <div>
    <p class="eyebrow">The back room at Caravan of Dreams</p>
    <h1>The Dream Room <span>&middot; prices</span></h1>
    <p class="lede">Prices are for 3 hours: a 2-hour event plus setup and cleanup.</p>
  </div>
  <div class="book">
    <div class="bookt">
      <p class="sec">To book</p>
      <p class="scan">Pick your hours at<br><b>dearcrisis.com/dreamroom</b></p>
      <p class="addr">Caravan of Dreams &middot; 405 E 6th St, East Village</p>
    </div>
    <div class="qrwrap">${qrSvg}</div>
  </div>
</div>

<div class="labels">
  <p class="sec">Public events <i>Talks and workshops. Open to anyone.</i></p>
  <p class="sec">Private hire <i>Parties &amp; dinners.</i></p>
</div>
<div class="opts">${boxes}</div>
<p class="why">Public events cost less.</p>

<div class="lower">
  <div>
    <p class="sec">Longer bookings <i>Each extra hour costs $10 less than the last.</i></p>
    ${table}
  </div>
  <div>
    <p class="sec">Food &amp; drink</p>
    <div class="food">${food}</div>
  </div>
</div>

<div class="pay">
  <p class="sec">How to pay</p>
  <p class="pl"><b>Venmo</b> ${esc(VENMO)} &middot; <b>Zelle</b> ${esc(ZELLE)} &middot; <b>cash</b>
  <span>&middot; Cards add 3%.</span></p>
</div>`;

const css = `${FONT_FACES}${TOKENS}
:root{--pane:rgba(8,15,36,.74)}
@page{size:20in 11.25in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper)}
body{font-family:var(--sans);color:var(--body);-webkit-font-smoothing:antialiased;
     -webkit-print-color-adjust:exact;print-color-adjust:exact}
/* Drawn at 1920x1080; the PDF scales the same page onto 20 x 11.25 in. */
.page{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:var(--paper)}
@media print{.page{zoom:${(20 * 96 / W).toFixed(4)}}}
.sky{position:absolute;inset:0;width:100%;height:100%;display:block}
.scrim{position:absolute;inset:0;z-index:1;
       background:radial-gradient(ellipse 70% 64% at 50% 52%,rgba(11,23,51,.72),rgba(11,23,51,.4) 70%,rgba(11,23,51,.05))}
.frame{position:absolute;inset:22px;border:1.5px solid rgba(224,188,100,.42);z-index:5;pointer-events:none}
.frame::after{content:'';position:absolute;inset:7px;border:1px solid rgba(224,188,100,.2)}
.card{position:absolute;inset:0;z-index:2;padding:62px 86px 56px;display:flex;flex-direction:column}
h1,p{text-shadow:0 0 3px var(--paper),0 0 6px var(--paper),0 0 12px var(--paper)}

.sec{font-size:15px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);margin:0}
.sec i{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:0;text-transform:none;
       color:var(--ink);font-size:19px;margin-left:14px}

.top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.eyebrow{font-size:15px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:var(--teal);margin:0}
h1{font-family:var(--serif);font-weight:500;font-size:84px;line-height:1;color:var(--ink);margin:10px 0 0;letter-spacing:-.012em}
h1 span{font-style:italic;font-weight:400;color:var(--blue);font-size:.55em}
.lede{font-family:var(--serif);font-style:italic;font-size:22px;color:#E2DCC2;margin:12px 0 0}
.book{display:flex;align-items:center;gap:22px}
.bookt{text-align:right}
.scan{font-family:var(--serif);font-style:italic;font-size:21px;line-height:1.35;color:var(--ink);margin:8px 0 0}
.scan b{font-style:normal;font-weight:500;color:var(--blue)}
.qrwrap{flex:none;padding:10px;background:var(--ink);border:1px solid var(--olive);border-radius:12px;
        box-shadow:0 0 0 6px var(--paper),0 0 0 7px rgba(224,188,100,.35)}
.qr{width:128px;height:128px;display:block}

.labels{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:44px}
.labels .sec:first-child{grid-column:span 3}
.opts{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:14px}
.opt{border:1px solid var(--hairline);border-radius:12px;padding:20px 22px 22px;background:var(--pane)}
.opt.priv{border-color:rgba(224,188,100,.6);box-shadow:inset 0 0 0 1px rgba(224,188,100,.15)}
.opt .pr{font-family:var(--serif);font-size:52px;color:var(--blue);margin:0;line-height:1}
.opt .pr span{display:block;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:.08em;
              text-transform:uppercase;color:var(--grey);margin-top:8px}
.opt .ds{font-size:17px;line-height:1.4;color:var(--body);margin:12px 0 0}
.why{font-family:var(--serif);font-style:italic;font-size:20px;color:#E2DCC2;margin:18px 0 0;text-align:center}

.lower{display:grid;grid-template-columns:1.25fr 1fr;gap:40px;margin-top:34px}
.lad{width:100%;border-collapse:collapse;margin-top:12px;font-variant-numeric:tabular-nums;
     background:var(--pane);border:1px solid var(--hairline)}
.lad th{font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);
        padding:10px 14px;text-align:right;border-bottom:1px solid var(--hairline)}
.lad th:first-child,.lad td:first-child{text-align:left}
.lad td{font-size:22px;color:var(--body);padding:26px 14px;text-align:right;border-top:1px solid rgba(224,188,100,.12)}
.lad td:first-child{font-family:var(--serif);font-size:20px;color:var(--ink)}
.lad tr.g td:not(:first-child){color:var(--blue);font-weight:600}
.lad tr.k td:not(:first-child){color:var(--ink);font-weight:600}
.food{display:grid;gap:16px;margin-top:12px}
.fi{border:1px solid var(--hairline);border-radius:12px;padding:15px 18px;background:var(--pane);
    display:grid;grid-template-columns:auto 1fr;column-gap:16px;align-items:baseline}
.fi b{font-family:var(--serif);font-weight:500;font-size:22px;color:var(--ink);white-space:nowrap}
.fi em{font-style:normal;font-size:16px;font-weight:600;color:var(--blue);text-align:right}
.fi span{grid-column:1 / -1;font-size:15px;line-height:1.35;color:var(--body);margin-top:3px}

.pay{margin-top:auto;padding:14px 22px;border:1px solid rgba(224,188,100,.45);border-radius:12px;background:var(--pane);
     display:flex;align-items:baseline;gap:22px}
.pay .sec{flex:none}
.pl{font-size:17px;line-height:1.4;color:var(--ink);margin:0;flex:1}
.pl b{color:var(--blue);font-weight:600}
.pl span{color:var(--grey)}
.addr{font-size:14px;color:var(--grey);margin:8px 0 0;white-space:nowrap}
`;

const BW_CSS = `
/* Black and white, for any office printer: white paper, black ink, no sky. */
:root{--ink:#000;--body:#1c1c1c;--paper:#fff;--blue:#000;--olive:#000;--grey:#555;--teal:#333;
      --hairline:rgba(0,0,0,.32);--pane:#fff}
html,body,.page{background:#fff}
h1,p{text-shadow:none!important}
.sky,.scrim{display:none}
.frame{border-color:#000}.frame::after{border-color:rgba(0,0,0,.35)}
.lede,.why{color:#222}
.qrwrap{background:#fff;border-color:#000;box-shadow:none}
.opt.priv{border-color:#000;box-shadow:none}
.lad tr.g td:not(:first-child),.lad tr.k td:not(:first-child){color:#000;font-weight:700}
.pay{border-color:#000}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
  `<title>The Dream Room &middot; prices poster</title><style>${css}${BW ? BW_CSS : ''}</style></head><body>` +
  `<div class="page">${BW ? '' : skySvg(W, H)}<div class="scrim" aria-hidden="true"></div>` +
  `<div class="frame" aria-hidden="true"></div><div class="card">${body}</div></div></body></html>`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const f = path.join(OUT, NAME + '.html');
writeFileSync(f, html);
chrome([`--window-size=${W},${H}`, '--force-device-scale-factor=1', '--screenshot=' + path.join(OUT, NAME + '-1080p.png'), 'file://' + f]);
chrome([`--window-size=${W},${H}`, '--force-device-scale-factor=2', '--screenshot=' + path.join(OUT, NAME + '-4k.png'), 'file://' + f]);
// Preview draws Chrome's text-shadow tiles as boxes, so the PDF prints glow-free.
const pf = path.join(OUT, NAME + '.pdf.html');
writeFileSync(pf, html.replace('</head>', '<style>*{text-shadow:none!important}</style></head>'));
chrome(['--no-pdf-header-footer', '--print-to-pdf=' + path.join(OUT, NAME + '.pdf'), 'file://' + pf]);
rmSync(pf);
console.log(`built ${NAME} (1080p png, 4k png, pdf)`);
