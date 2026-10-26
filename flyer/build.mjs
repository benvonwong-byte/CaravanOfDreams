// Builds the 5x7 Climate Week flyers from the live dearcrisis.com/climateweek
// design tokens: lapis sky, gold double frame, compass rose, starfield,
// Lora + Inter, and a QR code to the page.
//   node flyer/build.mjs            5x7 (default) -> flyer/out/
//   node flyer/build.mjs 5.5x8.5    other trim sizes -> flyer/out-5.5x8.5/
//   node flyer/build.mjs 5.5x8.5 front-1-dream   only the named front(s)
//   node flyer/build.mjs 12x18 back --public      schedule-only poster; --public lists private events like public ones
// The layout is designed at 5x7; other sizes scale the card to fit the width
// and let the flex layout absorb the extra height.
// Fronts: four headline variants. Back: the full schedule from events.json
// (live Luma feed, /api/climateweek-events) + prices.json (/events.json).
// Refresh those two files with `curl` before a reprint. Requires the
// `qrcode` package, resolved from the DearCrisis repo.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { HERE, FONT_FACES, TOKENS, sky as skySvg, rose, qr, esc, scheduleDays, chrome } from './lib.mjs';

const [TW, TH] = (process.argv[2] || '5x7').split('x').map(Number); // trim size, inches
const Z = Math.min(TW/5, TH/7);                                         // content scale vs the 5x7 design
const FLAGS = process.argv.slice(3).filter(a => a.startsWith('--'));
const ONLY = process.argv.slice(3).filter(a => !a.startsWith('--'));     // optional: build only these fronts ('back' = schedule only)
const PUBLIC = FLAGS.includes('--public');
const OUT = path.join(HERE, TW === 5 && TH === 7 && !PUBLIC ? 'out' : `out-${TW}x${TH}${PUBLIC ? '-public' : ''}`);

const ORN = '<div class="orn" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>';
const TOP = '<p class="top">Caravan of Dreams <span class="with">with</span> Dear Crisis</p>';
const PLACE = '<p class="place">New York\u2019s oldest organic vegan restaurant &middot; 405 E 6th St, East Village</p>';
const WHEN = `<p class="when">September 21&ndash;27 &middot; Open daily 11 AM to 11 PM</p>
    <p class="when2">Free to drop in. Some events need a ticket.</p>`;
const SCAN = (label, addr=false) => `<div class="scan">
    <span class="lbl">${label}</span>
    <div class="qrwrap">__QR__</div>
    <span class="url">dearcrisis.com/climateweek</span>
  </div>${addr ? '<p class="addr">405 E 6th St, East Village, New York</p>' : ''}`;

// ---------- the four fronts ----------
const FRONTS = {
  'front-1-dream': `${TOP}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <section class="hero">${rose()}
    <h1>Where Climate Week <span class="gl">Comes to Dream</span></h1>
    <p class="sub short">Join us at &ldquo;Caravan of Dreams,&rdquo; a sanctuary in the East Village where amazing humans come together to engage how we might future-proof ourselves, our communities, and our planet.</p>
    <p class="keys"><span>Nourish</span><i>&#10022;</i><span>Connect</span><i>&#10022;</i><span>Regenerate</span><i>&#10022;</i><span>Dream</span></p>
    <div class="rooms">
      <div class="room front">
        <span class="rm"><i></i>Front room</span>
        <h3>The Urban Refuge</h3>
        <p>Open to everyone, all week. Coffee, organic food and drinks, live music, and conditions for connection. Come sit, nourish, and have the conversations that matter. Drop in any time, no ticket needed.</p>
      </div>
      <div class="room back">
        <span class="rm"><i></i>Back room</span>
        <h3>The Dream Room</h3>
        <p>Talks, salons, dinners, and workshops every day. Most need a ticket. Schedule on the back.</p>
      </div>
    </div>
    <p class="when">September 21&ndash;27 &middot; Open daily 11 AM to 11 PM</p>
  </section>${ORN}${SCAN('Scan for the schedule and tickets', true)}`,

  'front-1-dream-v1': `${TOP}${PLACE}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <section class="hero">${rose()}
    <h1>Where Climate Week <span class="gl">Comes to Dream</span></h1>
    <p class="sub">An urban refuge at the <span class="loc">Caravan of Dreams</span> in <span class="loc">East Village</span> to cohere our dreams into a resilient, regenerative future, with coffee, food, drinks, and amazing humans.</p>
    ${WHEN}
  </section>${ORN}${SCAN('Scan for the schedule and tickets')}`,

  'front-2-urban-refuge': `${TOP}${PLACE}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <section class="hero">${rose()}
    <p class="eyebrow">Climate Week at the Caravan of Dreams</p>
    <h1>The Urban <span class="gl">Refuge</span></h1>
    <p class="sub">Climate Week is hectic. Come slow down, ground, and reconnect with nourishing food and amazing humans.</p>
    <p class="keys"><span>Breathe</span><i>&#10022;</i><span>Ground</span><i>&#10022;</i><span>Nourish</span><i>&#10022;</i><span>Connect</span></p>
    ${WHEN}
  </section>${ORN}${SCAN('Scan for the schedule and tickets')}`,

  'front-3-your-refuge': `${TOP}${PLACE}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <section class="hero">${rose()}
    <h1>Your Refuge for <span class="gl">Climate Week</span></h1>
    <p class="sub">Come slow down, be fed, and connect. A space to replenish your body, mind, and spirit with organic food, cozy vibes, and meaningful connections.</p>
    <p class="feat-lbl">Featuring</p>
    <ul class="feat">
      <li>A Mapping Librarian to help you find your people and find your way through Climate Week</li>
      <li>Organic, vegan food</li>
      <li>Pop-up gatherings through the week</li>
    </ul>
    ${WHEN}
  </section>${ORN}${SCAN('Scan for the schedule and tickets')}`,

  'front-4-food-connection': `${TOP}${PLACE}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <section class="hero">${rose()}
    <h1>Come for the food, <span class="gl">stay for the connection</span></h1>
    <p class="sub">This space is open all week to support you. Come to nourish your body, co-work with your team, meet others, or simply decompress from the rush of Climate Week.</p>
    <p class="sub sub2">The Dream Room in the back hosts events. The front room is open to anyone, all week, with pop&#8209;up gatherings.</p>
    ${WHEN}
  </section>${ORN}${SCAN('Scan for the schedule and tickets')}`,
};

// ---------- the back: full schedule ----------
function schedule(){
  let html = '';
  scheduleDays({allPublic: PUBLIC}).forEach(d=>{
    html += `<div class="day"><span>${esc(d.label)}</span></div>`;
    d.rows.forEach(r=>{
      html += `<div class="row${r.priv?' priv':''}"><span class="time">${r.time}</span><span class="name">${esc(r.name)}</span><span class="tag">${esc(r.tag)}</span><span class="price">${esc(r.price)}</span></div>`;
    });
  });
  return html;
}
const BACK = () => `${TOP}<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>
  <h2>The Week</h2>
  <div class="list">${schedule()}</div>
  <div class="foot">
    <p class="fund">Prices are set by each host and may change. If a ticket price keeps you out, ask for support at dearcrisis.com/support and pay what you can.</p>
    <div class="qrwrap sm">__QR__</div>
  </div>
  <p class="addr">dearcrisis.com/climateweek &middot; 405 E 6th St, East Village, New York</p>`;

// ---------- page shell ----------
function css(B){ return `${FONT_FACES}${TOKENS}
:root{--bleed:${B}in;--xh:${Math.max(0, TH/Z - 7).toFixed(3)}in} /* --xh: extra design height vs 5x7, absorbed by the back's schedule rows */
@page{size:${TW+2*B}in ${TH+2*B}in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper)}
body{font-family:var(--sans);color:var(--body);-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:${TW+2*B}in;height:${TH+2*B}in;overflow:hidden;background:var(--paper);page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.sky{position:absolute;inset:0;width:100%;height:100%;display:block}
/* tarot-card page frame: double gold rule, inset from the TRIM edge */
.frame{position:absolute;zoom:${Z};inset:calc((var(--bleed) + .14in) / ${Z});border:1px solid rgba(224,188,100,.42);pointer-events:none;z-index:5}
.frame::after{content:'';position:absolute;inset:.05in;border:1px solid rgba(224,188,100,.2)}
.card{position:absolute;zoom:${Z};inset:calc(var(--bleed) / ${Z});display:flex;flex-direction:column;align-items:center;text-align:center;padding:.5in .42in .46in;z-index:2}
/* soft lapis halo so a star behind a word reads as sky, not as a stray glyph */
h1,h2,.sub,.when,.when2,.lbl,.url,.addr,.top,.place,.eyebrow,.keys,.feat,.feat-lbl,.list,.fund,.room{text-shadow:0 0 2px var(--paper),0 0 4px var(--paper),0 0 7px var(--paper),0 0 10px var(--paper)}
.top{font-family:var(--serif);font-size:9.5pt;color:var(--ink);letter-spacing:.01em;margin:0}
.top .with{color:var(--grey)}
.place{font-family:var(--sans);font-size:7.3pt;font-weight:600;letter-spacing:.03em;color:var(--teal);margin:.05in 0 0}
.orn{display:flex;align-items:center;gap:.1in;width:2.2in;color:var(--blue)}
.orn span{flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(224,188,100,.55))}
.orn span:last-child{background:linear-gradient(to left,transparent,rgba(224,188,100,.55))}
.orn b{font-weight:400;font-size:9pt;line-height:1}
.orn.a{margin:.12in 0 0}
.back .orn.a{margin-top:.08in}
.back .top{font-size:8.5pt}
.hero{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%}
.rose{position:absolute;left:50%;top:50%;width:4.9in;height:4.9in;transform:translate(-50%,-50%);opacity:.11;z-index:0}
.hero > :not(.rose){position:relative;z-index:1}
h1{font-family:var(--serif);font-weight:500;color:var(--ink);margin:0;font-size:25pt;line-height:1.12;letter-spacing:-.012em;text-wrap:balance}
h1 .gl{color:var(--blue)}
.eyebrow{font-size:6.8pt;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--teal);margin:0 0 .14in}
.sub{font-family:var(--serif);font-style:italic;font-size:10.6pt;line-height:1.5;color:#E2DCC2;margin:.17in auto 0;max-width:3.55in;text-wrap:pretty}
.sub.sub2{margin-top:.1in;font-size:9.6pt;color:var(--body)}
.sub .loc{color:inherit;white-space:nowrap;text-decoration:underline;text-decoration-color:rgba(224,188,100,.55);text-decoration-thickness:.6px;text-underline-offset:2.5px}
.keys{display:flex;align-items:center;justify-content:center;gap:.09in;margin:.16in 0 0;font-size:7.4pt;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--blue)}
.keys i{font-style:normal;font-size:6pt;color:var(--grey)}
.feat-lbl{font-size:6.8pt;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--blue);margin:.16in 0 0}
.feat{list-style:none;margin:.06in auto 0;padding:0;max-width:3.1in;text-align:left;display:grid;gap:.035in}
.feat li{position:relative;padding-left:.17in;font-size:8.6pt;line-height:1.4;color:var(--body)}
.feat li::before{content:'\\2733';position:absolute;left:0;top:.01in;color:var(--blue);font-size:7pt}
.when{font-family:var(--sans);font-size:9.4pt;font-weight:600;color:var(--blue);margin:.16in 0 0;letter-spacing:.01em}
.when2{font-family:var(--serif);font-style:italic;font-size:9.6pt;color:#E2DCC2;margin:.05in 0 0}
.scan{display:flex;flex-direction:column;align-items:center;gap:.08in;margin-top:.14in}
.lbl{font-size:6.8pt;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--blue)}
.qrwrap{padding:.09in;background:var(--ink);border:1px solid var(--olive);border-radius:.09in;box-shadow:0 0 0 .05in var(--paper),0 0 0 calc(.05in + 1px) rgba(224,188,100,.35)}
.qr{width:1.3in;height:1.3in;display:block}
.url{font-family:var(--sans);font-size:8.6pt;font-weight:600;color:var(--ink);letter-spacing:.02em}
.addr{font-size:7.6pt;color:var(--grey);margin:.08in 0 0;letter-spacing:.02em}
/* two ways in: the site's tinted panels with its room chip colours */
.sub.short{max-width:3.85in;font-size:9.3pt;margin-top:.1in;line-height:1.42}
.lbl.ways{margin:.15in 0 .06in;color:var(--teal)}
.keys + .lbl.ways{margin-top:.13in}
.rooms{display:grid;grid-template-columns:1fr 1fr;gap:.1in;width:100%;text-align:left}
.keys + .rooms{margin-top:.11in}
.room{background:rgba(184,196,232,.06);border:1px solid rgba(224,188,100,.22);border-radius:.1in;padding:.09in .1in .09in}
.room .rm{display:inline-flex;align-items:center;gap:.05in;font-size:6pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.room .rm i{width:.07in;height:.07in;border-radius:1.5px}
.room.front .rm{color:#8FD0E8}.room.front .rm i{background:#8FD0E8}
.room.back .rm{color:var(--blue)}.room.back .rm i{background:var(--blue)}
.room h3{font-family:var(--serif);font-weight:500;font-size:10.5pt;color:var(--ink);margin:.03in 0 .035in;line-height:1.15}
.room p{font-size:7.4pt;line-height:1.4;color:var(--body);margin:0}
.rooms + .when{margin-top:.1in}
/* back */
.back .card{padding:.34in .36in .3in}
h2{font-family:var(--serif);font-weight:500;color:var(--ink);margin:.06in 0 .02in;font-size:13.5pt;line-height:1.1}
.list{width:100%;text-align:left;flex:1}
.day{font-size:6pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--blue);padding:calc(.038in + var(--xh)*.03) 0 .012in;border-bottom:1px solid var(--hairline);margin-bottom:.008in;line-height:1.2}
.row{display:grid;grid-template-columns:.82in 1fr auto .42in;gap:.07in;align-items:baseline;padding:calc(.008in + var(--xh)*.017) 0;line-height:1.22}
.row .time{font-size:6.3pt;font-weight:600;color:var(--blue);font-variant-numeric:tabular-nums;white-space:nowrap}
.row .name{font-family:var(--serif);font-size:7.2pt;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .tag{font-size:5.6pt;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--grey);white-space:nowrap}
.row .price{font-size:6.5pt;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
.row.priv .name,.row.priv .time{opacity:.62}
.foot{display:flex;align-items:center;gap:.16in;width:100%;margin-top:.04in;padding-top:.05in;border-top:1px solid var(--hairline);text-align:left}
.fund{font-family:var(--serif);font-style:italic;font-size:6.9pt;line-height:1.4;color:#E2DCC2;margin:0;flex:1}
.qrwrap.sm{padding:.05in;flex:none}
.qrwrap.sm .qr{width:.5in;height:.5in}
.back .addr{margin-top:.05in;font-size:6.6pt}
/* the Featuring list needs the room the big QR was using */
.tight .qr{width:.95in;height:.95in}
.tight .sub{margin-top:.12in}
.tight .scan{margin-top:.08in}
.tight .when{margin-top:.11in}
`; }

const sky = B => skySvg((TW+2*B)*96, (TH+2*B)*96);
const page = (inner, B, cls='') => `<div class="page ${cls}">${sky(B)}<div class="frame" aria-hidden="true"></div><div class="card">${inner}</div></div>`;
const doc = (pages, B, title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css(B)}</style></head><body>${pages.join('')}</body></html>`;

// ---------- render ----------
const qrSvg = await qr();
rmSync(OUT, {recursive:true, force:true}); mkdirSync(OUT);
// Chrome bakes text-shadow into raster tiles in PDFs, and macOS Preview/Quick Look composites those tiles as
// opaque boxes over neighbouring text. So the PDF is printed from a copy of the page with the halo stripped;
// the .html/.png keep it.
const NO_GLOW = '<style>*{text-shadow:none!important}</style></head>';
const pdf = (html, name) => { const f=path.join(OUT,name+'.html'); writeFileSync(f, html.replaceAll('__QR__', qrSvg));
  const pf=path.join(OUT,name+'.pdf.html'); writeFileSync(pf, html.replaceAll('__QR__', qrSvg).replace('</head>', NO_GLOW));
  chrome(['--no-pdf-header-footer','--print-to-pdf='+path.join(OUT,name+'.pdf'),'file://'+pf]); rmSync(pf); return f; };
// 300 dpi PNG of a rendered page (B = bleed in inches); tag the file as 300 dpi so print uploaders read the physical size
const png = (f, name, B=0) => { const out = path.join(OUT,name+'.png');
  chrome([`--window-size=${(TW+2*B)*96},${(TH+2*B)*96}`,'--force-device-scale-factor=3.125','--screenshot='+out,'file://'+f]);
  execFileSync('sips', ['-s','dpiWidth','300','-s','dpiHeight','300', out], {stdio:'pipe'}); };

const back = BACK();
const fronts = ONLY.length === 1 && ONLY[0] === 'back' ? [] : Object.entries(FRONTS).filter(([n]) => !ONLY.length || ONLY.includes(n));
for (const [name, inner] of [...fronts, ['back-schedule', back]]){
  const cls = name.startsWith('back') ? 'back' : (name === 'front-3-your-refuge' || name === 'front-1-dream') ? 'tight' : '';
  const f = pdf(doc([page(inner,0,cls)], 0, name), name);
  png(f, name);
  png(pdf(doc([page(inner,.125,cls)], .125, name), name + '-bleed'), name + '-bleed', .125);
  if (cls !== 'back') pdf(doc([page(inner,.125,cls), page(back,.125,'back')], .125, name), name + '-2sided-bleed');
  console.log('built', name);
}
