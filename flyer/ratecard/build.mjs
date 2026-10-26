// Dream Room rate card, 8.5x11: prices and food only, in the printed flyer's
// house style (lapis sky, gold double frame, Lora + Inter, QR to booking).
//   node flyer/ratecard/build.mjs        -> flyer/ratecard/out/
//   node flyer/ratecard/build.mjs --bw   -> flyer/ratecard/out-bw/ (black and white)
// The room itself lives on dearcrisis.com/dreamroom; this card answers
// "what does it cost". Numbers mirror priceOf in DearCrisis
// functions/dreamRoom.js: change prices there first, then here.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { HERE as FLYER, FONT_FACES, TOKENS, sky as skySvg, esc, chrome } from '../lib.mjs';

const require = createRequire(path.join(path.resolve(FLYER, '../../DearCrisis'), 'package.json'));
const QRCode = require('qrcode');

const HERE = path.join(FLYER, 'ratecard');
const BW = process.argv.includes('--bw');
const OUT = path.join(HERE, BW ? 'out-bw' : 'out');
const NAME = BW ? 'dream-room-rate-card-bw' : 'dream-room-rate-card';
const TW = 8.5, TH = 11;

// ---------------------------------------------------------------- CONFIG ----
const CONFIG = {
  bookUrl: 'https://dearcrisis.com/dreamroom',
  bookShort: 'dearcrisis.com/dreamroom',
  zelle: 'reservations@caravanofdreams.net',
  venmo: '@caravanofdreams',
  // Never print the Wi-Fi password on this card.
};

// Base prices cover three hours in the room; each hour after costs $10 less
// than the one before, from $75 public and $100 private.
const extraCost = (first, hours) => {
  let t = 0;
  for (let i = 0; i < hours - 3; i++) t += Math.max(first - 10 * i, 0);
  return t;
};
const HOURS = [3, 4, 5, 6, 7, 8];
const LADDER = [
  { label: 'Free or $100 + 30%', cells: HOURS.map((h) => (h === 3 ? '–' : `+$${extraCost(75, h)}`)) },
  { label: '$300 flat plan', cells: HOURS.map((h) => `$${300 + extraCost(75, h)}`), gold: true },
  { label: 'Private hire', cells: HOURS.map((h) => `$${400 + extraCost(100, h)}`), ink: true },
];

const PUBLIC = [
  { price: 'Free', unit: '15+ guests, $600 food minimum', note: 'Free room when guests spend $600 on food.' },
  { price: '$100', unit: 'plus 30% of tickets', note: 'We share the risk with you.' },
  { price: '$300', unit: 'flat', note: 'One price. You keep all ticket sales.' },
];
// -----------------------------------------------------------------------------

const qr = async () => {
  const svg = await QRCode.toString(CONFIG.bookUrl, {
    type: 'svg', errorCorrectionLevel: 'Q', margin: 0,
    color: { dark: BW ? '#000000' : '#0B1733', light: '#0000' },
  });
  return svg.replace('<svg', '<svg class="qr" aria-label="QR code to book the Dream Room"');
};

const publicCards = PUBLIC.map((o) => `<div class="opt">
  <p class="pr">${esc(o.price)}<span>${esc(o.unit)}</span></p>
  <p class="ds">${esc(o.note)}</p>
</div>`).join('');

const table = `<table class="lad">
  <thead><tr><th>Hours in the room</th>${HOURS.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${LADDER.map((r) => `<tr class="${r.gold ? 'g' : r.ink ? 'k' : ''}"><td>${esc(r.label)}</td>${r.cells.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
</table>`;

const body = `
<p class="eyebrow">The back room at Caravan of Dreams</p>
<h1>The Dream Room <span>&middot; prices</span></h1>
<p class="lede">Prices are for 3 hours: a 2-hour event plus setup and cleanup.</p>

<div class="two">
  <div class="col">
    <p class="sec">Public events</p>
    <p class="sub">Talks and workshops. Open to anyone.</p>
    <div class="opts">${publicCards}</div>
  </div>
  <div class="col party">
    <p class="sec">Private hire</p>
    <p class="sub">Parties &amp; dinners.</p>
    <div class="opt solo">
      <p class="pr">$400<span>any day of the week</span></p>
      <p class="ds">Your guests only.</p>
    </div>
  </div>
</div>
<p class="why">Public events cost less.</p>

<p class="sec mid">Longer bookings</p>
<p class="subc">Each extra hour costs $10 less than the last.</p>
${table}

<p class="sec mid">Food &amp; drink</p>
<div class="food">
  <div class="fi"><b>Finger foods</b><span>Bites for standing events. Gluten-free options.</span><em>Ask for a quote</em></div>
  <div class="fi"><b>Prix fixe dinner</b><span>Seated dinner from our kitchen.</span><em>$45 per person, all in</em></div>
  <div class="fi"><b>Tea &amp; water</b><span>For everyone.</span><em>On the house</em></div>
</div>

<div class="pay">
  <p class="sec">How to pay</p>
  <p class="pl"><b>Venmo</b> ${esc(CONFIG.venmo)} &middot; <b>Zelle</b> ${esc(CONFIG.zelle)} &middot; <b>cash</b>
  <span>&middot; Cards add 3%.</span></p>
</div>

<div class="foot">
  <div class="bookwrap">
    <p class="sec bk">To book</p>
    <p class="scan">Pick your hours at <b>${esc(CONFIG.bookShort)}</b>, or scan the code.</p>
    <p class="addr">Caravan of Dreams &middot; 405 E 6th St, East Village, New York</p>
  </div>
  <div class="qrwrap">__QR__</div>
</div>`;

const css = B => `${FONT_FACES}${TOKENS}
:root{--bleed:${B}in;--pane:rgba(8,15,36,.72)}
@page{size:${TW + 2 * B}in ${TH + 2 * B}in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper)}
body{font-family:var(--sans);color:var(--body);-webkit-font-smoothing:antialiased;
     -webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:${TW + 2 * B}in;height:${TH + 2 * B}in;overflow:hidden;background:var(--paper)}
.sky{position:absolute;inset:0;width:100%;height:100%;display:block}
.scrim{position:absolute;inset:var(--bleed);z-index:1;
       background:radial-gradient(ellipse 62% 58% at 50% 50%,rgba(11,23,51,.7),rgba(11,23,51,.38) 70%,rgba(11,23,51,0))}
.frame{position:absolute;inset:calc(var(--bleed) + .2in);border:1px solid rgba(224,188,100,.42);pointer-events:none;z-index:5}
.frame::after{content:'';position:absolute;inset:.06in;border:1px solid rgba(224,188,100,.2)}
.card{position:absolute;inset:var(--bleed);display:flex;flex-direction:column;align-items:center;
      text-align:center;padding:.5in .68in .42in;z-index:2}
h1,p{text-shadow:0 0 2px var(--paper),0 0 4px var(--paper),0 0 8px var(--paper)}

.eyebrow{font-size:7.6pt;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--teal);margin:0}
h1{font-family:var(--serif);font-weight:500;font-size:36pt;line-height:1.04;color:var(--ink);margin:.06in 0 0;letter-spacing:-.012em}
h1 span{font-style:italic;font-weight:400;color:var(--blue);font-size:.62em}
.lede{font-family:var(--serif);font-style:italic;font-size:10.6pt;line-height:1.4;color:#E2DCC2;margin:.08in 0 0}

.sec{font-size:7.8pt;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:var(--blue);margin:0}
.sec.mid{margin-top:.24in}
.sub{font-family:var(--serif);font-size:11pt;color:var(--ink);margin:.05in 0 0}
.subc{font-size:8.6pt;color:var(--grey);margin:.04in 0 0}

.two{display:grid;grid-template-columns:1.9fr 1fr;gap:.3in;width:100%;max-width:7in;margin-top:.28in;text-align:left;align-items:stretch}
.party{border-left:1px solid var(--hairline);padding-left:.28in}
.opts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.12in;margin-top:.12in}
.opt{border:1px solid var(--hairline);border-radius:.07in;padding:.12in .1in .13in;background:var(--pane)}
.opt .pr{font-family:var(--serif);font-size:21pt;color:var(--blue);margin:0;line-height:1.05}
.opt .pr span{display:block;font-family:var(--sans);font-size:6.8pt;font-weight:600;letter-spacing:.08em;
              text-transform:uppercase;color:var(--grey);margin-top:.04in}
.opt .ds{font-size:8.3pt;line-height:1.4;color:var(--body);margin:.08in 0 0}
/* The private price boxed like the public ones, level with them and as tall. */
.col{display:flex;flex-direction:column}
.opt.solo{flex:1;margin-top:.12in}
.why{font-family:var(--serif);font-style:italic;font-size:10pt;color:#E2DCC2;margin:.16in 0 0}

.lad{width:100%;max-width:7in;border-collapse:collapse;margin-top:.1in;font-variant-numeric:tabular-nums;
     background:var(--pane);border:1px solid var(--hairline);border-radius:.07in}
.lad th{font-size:7pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);
        padding:.07in .1in;text-align:right;border-bottom:1px solid var(--hairline)}
.lad th:first-child,.lad td:first-child{text-align:left}
.lad td{font-size:10.4pt;color:var(--body);padding:.1in .1in;text-align:right;border-top:1px solid rgba(224,188,100,.12)}
.lad td:first-child{font-family:var(--serif);font-size:10.4pt;color:var(--ink)}
.lad tr.g td:not(:first-child){color:var(--blue);font-weight:600}
.lad tr.k td:not(:first-child){color:var(--ink);font-weight:600}

.food{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.12in;width:100%;max-width:7in;margin-top:.1in;text-align:left}
.fi{border:1px solid var(--hairline);border-radius:.07in;padding:.11in .12in .12in;background:var(--pane);display:flex;flex-direction:column}
.fi b{font-family:var(--serif);font-weight:500;font-size:12pt;color:var(--ink)}
.fi span{font-size:8.3pt;line-height:1.4;color:var(--body);margin-top:.05in;flex:1}
.fi em{font-style:normal;font-size:8.6pt;font-weight:600;color:var(--blue);margin-top:.07in}

.pay{width:100%;max-width:7in;margin-top:.2in;padding:.1in .14in;border:1px solid rgba(224,188,100,.45);
     border-radius:.07in;background:var(--pane);text-align:left;display:flex;align-items:baseline;gap:.16in}
.pay .sec{flex:none}
.pl{font-size:8.8pt;line-height:1.4;color:var(--ink);margin:0}
.pl b{color:var(--blue);font-weight:600}
.pl span{color:var(--grey)}

.foot{display:flex;align-items:center;gap:.3in;width:100%;max-width:7in;margin-top:auto;
      padding-top:.12in;border-top:1px solid var(--hairline);text-align:left}
.bookwrap{flex:1}
.sec.bk{margin-bottom:.06in}
.scan{font-family:var(--serif);font-style:italic;font-size:11pt;color:var(--ink);margin:0}
.scan b{font-style:normal;font-weight:500;color:var(--blue)}
.addr{font-size:8.4pt;color:var(--grey);margin:.08in 0 0;letter-spacing:.02em}
.qrwrap{flex:none;padding:.07in;background:var(--ink);border:1px solid var(--olive);border-radius:.08in;
        box-shadow:0 0 0 .045in var(--paper),0 0 0 calc(.045in + 1px) rgba(224,188,100,.35)}
.qr{width:.95in;height:.95in;display:block}
`;

const page = B => `<div class="page">${BW ? '' : skySvg((TW + 2 * B) * 96, (TH + 2 * B) * 96)}` +
  `<div class="scrim" aria-hidden="true"></div><div class="frame" aria-hidden="true"></div>` +
  `<div class="card">${body}</div></div>`;

const doc = B => `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
  `<title>The Dream Room &middot; prices</title><style>${css(B)}${BW ? BW_CSS : ''}</style></head>` +
  `<body>${page(B)}</body></html>`;

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

const qrSvg = await qr();
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Chrome rasterises text-shadow into tiles that macOS Preview draws as opaque
// boxes, so the PDF prints from a glow-free copy; the PNG keeps the halo.
const NO_GLOW = '<style>*{text-shadow:none!important}</style></head>';

const build = (B, name) => {
  const html = doc(B).replaceAll('__QR__', qrSvg);
  const f = path.join(OUT, name + '.html');
  writeFileSync(f, html);
  const pf = path.join(OUT, name + '.pdf.html');
  writeFileSync(pf, html.replace('</head>', NO_GLOW));
  chrome(['--no-pdf-header-footer', '--print-to-pdf=' + path.join(OUT, name + '.pdf'), 'file://' + pf]);
  rmSync(pf);
  return f;
};

const f = build(0, NAME);
chrome([`--window-size=${TW * 96},${TH * 96}`, '--force-device-scale-factor=3.125',
  '--screenshot=' + path.join(OUT, NAME + '.png'), 'file://' + f]);
build(0.125, NAME + '-bleed');
console.log(`built ${NAME} (pdf, png, bleed pdf)`);
