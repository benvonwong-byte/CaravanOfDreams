// Social cuts of the approved Climate Week flyer, one folder per platform:
//   node flyer/social.mjs
// instagram/  4:5 carousel (11 slides) + 2 stories
// linkedin/   the same carousel as a multi-page PDF (document post) + 1200x627 link image
// facebook/   1:1 carousel (11 cards) + 1200x630 link image
// twitter/    4 landscape images (cover, rooms, schedule Mon–Wed, Thu–Sun)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { HERE, FONT_FACES, TOKENS, sky, rose, qr, esc, scheduleDays, chrome } from './lib.mjs';

const OUT = path.join(HERE, 'social');
const qrSvg = await qr();
const DAYS = scheduleDays();

const ORN = '<div class="orn" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>';
const HEAD = `<p class="top">Caravan of Dreams <span class="with">with</span> Dear Crisis</p>
<p class="place">New York&rsquo;s oldest organic vegan restaurant &middot; 405 E 6th St, East Village</p>
<div class="orn a" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>`;
const KEYS = '<p class="keys"><span>Nourish</span><i>&#10022;</i><span>Connect</span><i>&#10022;</i><span>Regenerate</span><i>&#10022;</i><span>Dream</span></p>';
const WHEN = '<p class="when">September 21&ndash;27 &middot; Open daily 11 AM to 11 PM</p>';
const H1 = '<h1>Where Climate Week <span class="gl">Comes to Dream</span></h1>';
const SUB = '<p class="sub">Join us at &ldquo;Caravan of Dreams,&rdquo; a sanctuary in the East Village where amazing humans come together to engage with how we might future-proof ourselves, our communities, and our planet.</p>';
const REFUGE = {chip:'front', room:'Front room', title:'The Urban Refuge', body:'Open to everyone, all week. Coffee, organic food and drinks, live music, and conditions for connection. Come sit, nourish, and have the conversations that matter.', note:'Drop in any time, no ticket needed.'};
const DREAM = {chip:'back', room:'Back room', title:'The Dream Room', body:'Talks, salons, dinners, and workshops every day.', note:'Most need a ticket.'};

// ---------- slide bodies ----------
const cover = (swipe) => `<section class="hero">${rose()}${H1}${SUB}${KEYS}${WHEN}${swipe ? '<p class="swipe">Swipe for the week &rarr;</p>' : ''}</section>`;
const roomSlide = (r) => `<section class="hero roomslide">${rose()}
  <span class="rm ${r.chip}"><i></i>${r.room}</span>
  <h2>${r.title}</h2>
  <p class="big">${r.body}</p>
  <p class="when">${r.note}</p></section>`;
const panel = (r) => `<div class="room ${r.chip}"><span class="rm ${r.chip}"><i></i>${r.room}</span><h3>${r.title}</h3><p>${r.body} ${r.note}</p></div>`;
const roomsSlide = () => `<section class="hero">${rose()}${H1}<div class="rooms">${panel(REFUGE)}${panel(DREAM)}</div>${WHEN}</section>`;
const rows = (d, cls='') => d.rows.map(r => `<div class="row${r.priv?' priv':''} ${cls}"><span class="time">${r.time}</span><span class="name">${esc(r.name)}</span><span class="meta">${esc(r.tag)}${r.price ? ' &middot; ' + esc(r.price) : ''}</span></div>`).join('');
const daySlide = (d, i) => `<section class="dayslide"><p class="lbl">Day ${i+1} of 7</p><h2 class="daylbl">${esc(d.label)}</h2><div class="list">${rows(d)}</div><p class="fine">Most events need a ticket. If a price keeps you out, ask at dearcrisis.com/support.</p></section>`;
const groupSlide = (days) => `<section class="dayslide grp">${days.map(d=>`<p class="lbl daysub">${esc(d.label)}</p><div class="list">${rows(d,'grp')}</div>`).join('')}<p class="fine">Most events need a ticket. If a price keeps you out, ask at dearcrisis.com/support.</p></section>`;
const schedSlide = (days, title) => `<section class="sched"><h2 class="daylbl">${title}</h2><div class="cols c${days.length}">${days.map(d=>`<div class="col"><p class="lbl">${esc(d.label)}</p>${rows(d,'compact')}</div>`).join('')}</div></section>`;
const ctaSlide = () => `<section class="hero cta">${rose()}<p class="lbl">Scan for the schedule and tickets</p><div class="qrwrap">${qrSvg}</div><p class="url">dearcrisis.com/climateweek</p>${WHEN}<p class="addr">Caravan of Dreams &middot; 405 E 6th St, East Village, New York</p></section>`;

const CAROUSEL = [
  ['01-cover', cover(true)],
  ['02-urban-refuge', roomSlide(REFUGE)],
  ['03-dream-room', roomSlide(DREAM)],
  ['04-mon-tue', groupSlide(DAYS.slice(0,2))],
  ['05-wed-thu', groupSlide(DAYS.slice(2,4))],
  ['06-fri-sun', groupSlide(DAYS.slice(4))],
  ['07-scan', ctaSlide()],
];
const LANDSCAPE = [
  ['01-cover', cover(false)],
  ['02-rooms', roomsSlide()],
  ['03-schedule-mon-wed', schedSlide(DAYS.slice(0,3), 'The Week, part one')],
  ['04-schedule-thu-sun', schedSlide(DAYS.slice(3), 'The Week, part two')],
];

// ---------- shell ----------
function css(F){ return `${FONT_FACES}${TOKENS}
html{font-size:${F.fs}px}
@page{size:${F.w}px ${F.h}px;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper)}
body{font-family:var(--sans);color:var(--body);-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:${F.w}px;height:${F.h}px;overflow:hidden;background:var(--paper);page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.sky{position:absolute;inset:0;width:100%;height:100%;display:block}
.frame{position:absolute;inset:1.6rem;border:2px solid rgba(224,188,100,.42);pointer-events:none;z-index:5}
.frame::after{content:'';position:absolute;inset:.55rem;border:1.5px solid rgba(224,188,100,.2)}
.card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;text-align:center;padding:4rem 4.2rem 3.4rem;z-index:2}
h1,h2,h3,p,.list,.room,.rm{text-shadow:0 0 .15rem var(--paper),0 0 .3rem var(--paper),0 0 .5rem var(--paper),0 0 .8rem var(--paper)}
.top{font-family:var(--serif);font-size:1.25rem;color:var(--ink);margin:0}
.top .with{color:var(--grey)}
.place{font-size:.95rem;font-weight:600;letter-spacing:.03em;color:var(--teal);margin:.35rem 0 0}
.orn{display:flex;align-items:center;gap:.6rem;width:14rem;color:var(--blue)}
.orn span{flex:1;height:1.5px;background:linear-gradient(to right,transparent,rgba(224,188,100,.55))}
.orn span:last-child{background:linear-gradient(to left,transparent,rgba(224,188,100,.55))}
.orn b{font-weight:400;font-size:1.1rem;line-height:1}
.orn.a{margin:1rem 0 0}
.hero{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%}
.rose{position:absolute;left:50%;top:50%;width:${F.roseW};height:${F.roseW};transform:translate(-50%,-50%);opacity:.11;z-index:0}
.hero > :not(.rose){position:relative;z-index:1}
h1{font-family:var(--serif);font-weight:500;color:var(--ink);margin:0;font-size:${F.h1};line-height:1.1;letter-spacing:-.012em;text-wrap:balance}
h1 .gl{color:var(--blue)}
.sub{font-family:var(--serif);font-style:italic;font-size:${F.sub};line-height:1.45;color:#E2DCC2;margin:1.3rem auto 0;max-width:${F.subW};text-wrap:pretty}
.keys{display:flex;align-items:center;justify-content:center;gap:.7rem;margin:1.4rem 0 0;font-size:.95rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--blue)}
.keys i{font-style:normal;font-size:.75rem;color:var(--grey)}
.when{font-size:1.2rem;font-weight:600;color:var(--blue);margin:1.4rem 0 0;letter-spacing:.01em}
.swipe{margin:2.2rem 0 0;font-size:.9rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--grey)}
.rm{display:inline-flex;align-items:center;gap:.45rem;font-size:.9rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.rm i{width:.6rem;height:.6rem;border-radius:2px}
.rm.front{color:var(--sky)}.rm.front i{background:var(--sky)}
.rm.back{color:var(--blue)}.rm.back i{background:var(--blue)}
.roomslide h2{font-family:var(--serif);font-weight:500;color:var(--ink);font-size:${F.h1};line-height:1.1;margin:1rem 0 0}
.big{font-family:var(--serif);font-style:italic;font-size:${F.big};line-height:1.45;color:#E2DCC2;margin:1.6rem auto 0;max-width:${F.subW}}
.rooms{display:grid;grid-template-columns:1fr 1fr;gap:1rem;width:100%;max-width:${F.roomsW};margin:1.6rem auto 0;text-align:left}
.room{background:rgba(184,196,232,.06);border:1.5px solid rgba(224,188,100,.22);border-radius:1rem;padding:1.1rem 1.2rem 1.2rem}
.room .rm{font-size:.75rem}
.room h3{font-family:var(--serif);font-weight:500;font-size:1.5rem;color:var(--ink);margin:.35rem 0 .4rem;line-height:1.15}
.room p{font-size:1rem;line-height:1.45;color:var(--body);margin:0}
.rooms + .when{margin-top:1.4rem}
/* day slides */
.dayslide{flex:1;display:flex;flex-direction:column;justify-content:center;width:100%;text-align:left;padding:0 0 2rem}
.lbl{font-size:.85rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--teal);margin:0}
.daylbl{font-family:var(--serif);font-weight:500;color:var(--ink);font-size:${F.day};line-height:1.1;margin:.5rem 0 1.2rem}
.list{flex:0 0 auto}
.row{display:grid;grid-template-columns:${F.timeW} 1fr;grid-template-areas:'time name' 'time meta';column-gap:1rem;padding:${F.rowPad || '1.3rem'} 0;border-top:1.5px solid var(--hairline);align-items:baseline}
.row .time{grid-area:time;font-size:1.05rem;font-weight:600;color:var(--blue);font-variant-numeric:tabular-nums;white-space:nowrap}
.row .name{grid-area:name;font-family:var(--serif);font-size:${F.name};color:var(--ink);line-height:1.25}
.row .meta{grid-area:meta;font-size:.85rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--grey);margin-top:.3rem}
.row.priv .name,.row.priv .time{opacity:.62}
.fine{font-family:var(--serif);font-style:italic;font-size:1rem;color:#E2DCC2;margin:0;padding-top:1.2rem;border-top:1.5px solid var(--hairline)}
/* grouped days */
.grp .daysub{color:var(--blue);font-size:.9rem;padding:${F.grpGap || '1.1rem'} 0 .35rem;border-bottom:1.5px solid var(--hairline)}
.grp .daysub:first-child{padding-top:0}
.row.grp{padding:${F.grpPad || '.62rem'} 0;border-top:none;border-bottom:1px solid rgba(224,188,100,.14)}
.row.grp .time{font-size:.95rem}
.row.grp .name{font-size:${F.grpName || '1.3rem'};line-height:1.2}
.row.grp .meta{font-size:.72rem;margin-top:.15rem}
.grp .fine{margin-top:1rem;border-top:none;padding-top:0}
/* landscape schedule */
.sched{flex:1;display:flex;flex-direction:column;width:100%;text-align:left;padding-top:.6rem}
.sched .daylbl{text-align:center;margin:0 0 1rem;font-size:2.1rem}
.cols{display:grid;gap:1.4rem;flex:1}
.cols.c3{grid-template-columns:repeat(3,1fr)}.cols.c4{grid-template-columns:repeat(4,1fr)}
.col .lbl{color:var(--blue);padding-bottom:.35rem;border-bottom:1.5px solid var(--hairline)}
.row.compact{padding:.8rem 0;grid-template-columns:1fr;grid-template-areas:'time' 'name' 'meta';border-top:none;border-bottom:1px solid rgba(224,188,100,.14)}
.row.compact .time{font-size:.9rem}
.row.compact .name{font-size:1.22rem}
.row.compact .meta{font-size:.75rem;margin-top:.2rem}
/* cta */
.cta .lbl{color:var(--blue)}
.qrwrap{margin-top:1.2rem;padding:.7rem;background:var(--ink);border:2px solid var(--olive);border-radius:.8rem;box-shadow:0 0 0 .4rem var(--paper),0 0 0 calc(.4rem + 2px) rgba(224,188,100,.35)}
.qr{width:${F.qr};height:${F.qr};display:block}
.url{font-size:1.5rem;font-weight:600;color:var(--ink);margin:1.6rem 0 0;letter-spacing:.02em}
.cta .when{margin-top:.8rem}
.addr{font-size:.9rem;color:var(--grey);margin:.6rem 0 0}
/* footer */
.foot{position:absolute;left:0;right:0;bottom:2.6rem;text-align:center;font-size:.85rem;font-weight:600;letter-spacing:.06em;color:var(--grey);z-index:3}
.count{position:absolute;right:3rem;bottom:2.55rem;font-size:.8rem;font-weight:600;letter-spacing:.1em;color:var(--grey);font-variant-numeric:tabular-nums;z-index:3}
${F.extra || ''}`; }

const page = (F, inner, i, n, foot=true) => `<div class="page">${sky(F.w, F.h, F.scale)}<div class="frame" aria-hidden="true"></div><div class="card">${HEAD}${inner}</div>${foot && !/class="hero cta"/.test(inner) ? '<p class="foot">dearcrisis.com/climateweek</p>' : ''}${n>1 ? `<p class="count">${i+1} / ${n}</p>` : ''}</div>`;
const doc = (F, pages, title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css(F)}</style></head><body>${pages.join('')}</body></html>`;

// ---------- formats ----------
const F = {
  portrait: {w:1080, h:1350, fs:20, scale:2.2, roseW:'44rem', h1:'3.5rem', sub:'1.45rem', subW:'40rem', big:'1.9rem', roomsW:'46rem', day:'3rem', name:'1.7rem', timeW:'10rem', qr:'15rem'},
  square:   {w:1080, h:1080, fs:17, scale:2.2, roseW:'44rem', h1:'3.3rem', sub:'1.4rem', subW:'42rem', big:'1.85rem', roomsW:'50rem', day:'2.6rem', name:'1.55rem', timeW:'9.5rem', qr:'15rem', rowPad:'.95rem', grpPad:'.5rem', grpName:'1.22rem', grpGap:'.85rem',
             extra:'.card{padding:3rem 4rem 2.8rem}.grp .fine{font-size:.85rem;margin-top:.7rem}'},
  story:    {w:1080, h:1920, fs:27, scale:2.2, roseW:'44rem', h1:'3.6rem', sub:'1.45rem', subW:'38rem', big:'1.9rem', roomsW:'40rem', day:'2.6rem', name:'1.5rem', timeW:'9.5rem', qr:'17rem',
             extra:'.card{padding:6rem 3.2rem 5rem}.frame{inset:2.4rem}.rooms{grid-template-columns:1fr;max-width:36rem}.room p{font-size:1.05rem}.place{font-size:.82rem}.foot{bottom:4rem}.count{display:none}'},
  twitter:  {w:1600, h:900, fs:17, scale:1.9, roseW:'40rem', h1:'3.2rem', sub:'1.3rem', subW:'46rem', big:'1.7rem', roomsW:'62rem', day:'2rem', name:'1.3rem', timeW:'8rem', qr:'12rem',
             extra:'.card{padding:2.6rem 5rem 2.4rem}.orn.a{margin-top:.6rem}.sub{margin-top:1rem}.keys,.when{margin-top:1rem}.rooms{margin-top:1.1rem}.foot{bottom:1.9rem}.frame{inset:1.3rem}'},
  linkedin: {w:1200, h:627, fs:13, scale:1.5, roseW:'40rem', h1:'3.2rem', sub:'1.3rem', subW:'46rem', big:'1.7rem', roomsW:'62rem', day:'2rem', name:'1.3rem', timeW:'8rem', qr:'12rem',
             extra:'.card{padding:2.4rem 5rem 2.2rem}.orn.a{margin-top:.6rem}.sub{margin-top:1rem}.keys,.when{margin-top:1rem}.foot{bottom:1.6rem}.frame{inset:1.2rem}'},
  facebook: {w:1200, h:630, fs:13, scale:1.5, roseW:'40rem', h1:'3.2rem', sub:'1.3rem', subW:'46rem', big:'1.7rem', roomsW:'62rem', day:'2rem', name:'1.3rem', timeW:'8rem', qr:'12rem',
             extra:'.card{padding:2.4rem 5rem 2.2rem}.orn.a{margin-top:.6rem}.sub{margin-top:1rem}.keys,.when{margin-top:1rem}.foot{bottom:1.6rem}.frame{inset:1.2rem}'},
};

rmSync(OUT, {recursive:true, force:true});
function shoot(dir, F, name, html){
  mkdirSync(dir, {recursive:true});
  const f = path.join(dir, name + '.html'); writeFileSync(f, html);
  chrome([`--window-size=${F.w},${F.h}`, '--force-device-scale-factor=1', '--screenshot=' + path.join(dir, name + '.png'), 'file://' + f]);
}
function pdf(dir, F, name, html){
  mkdirSync(dir, {recursive:true});
  // no text-shadow in the PDF: Chrome rasterises it into tiles that macOS Preview draws as opaque boxes
  const f = path.join(dir, name + '.html'); writeFileSync(f, html.replace('</head>', '<style>*{text-shadow:none!important}</style></head>'));
  chrome(['--no-pdf-header-footer', '--print-to-pdf=' + path.join(dir, name + '.pdf'), 'file://' + f]);
}

// Instagram: 4:5 carousel + stories
CAROUSEL.forEach(([n, inner], i) => shoot(path.join(OUT,'instagram','carousel-4x5'), F.portrait, n, doc(F.portrait, [page(F.portrait, inner, i, CAROUSEL.length)], n)));
shoot(path.join(OUT,'instagram','stories'), F.story, 'story-1-cover', doc(F.story, [page(F.story, roomsSlide(), 0, 1)], 'story'));
shoot(path.join(OUT,'instagram','stories'), F.story, 'story-2-scan', doc(F.story, [page(F.story, ctaSlide(), 0, 1)], 'story'));
console.log('instagram done');
// LinkedIn: document-post PDF of the same carousel + link image
pdf(path.join(OUT,'linkedin'), F.portrait, 'climate-week-carousel', doc(F.portrait, CAROUSEL.map(([n,inner],i)=>page(F.portrait, inner, i, CAROUSEL.length)), 'Where Climate Week Comes to Dream'));
shoot(path.join(OUT,'linkedin'), F.linkedin, 'link-image-1200x627', doc(F.linkedin, [page(F.linkedin, cover(false), 0, 1)], 'cover'));
console.log('linkedin done');
// Facebook: square carousel + link image
CAROUSEL.forEach(([n, inner], i) => shoot(path.join(OUT,'facebook','carousel-1x1'), F.square, n, doc(F.square, [page(F.square, inner, i, CAROUSEL.length)], n)));
shoot(path.join(OUT,'facebook'), F.facebook, 'link-image-1200x630', doc(F.facebook, [page(F.facebook, cover(false), 0, 1)], 'cover'));
console.log('facebook done');
// Twitter: four landscape images
LANDSCAPE.forEach(([n, inner], i) => shoot(path.join(OUT,'twitter'), F.twitter, n, doc(F.twitter, [page(F.twitter, inner, i, LANDSCAPE.length)], n)));
console.log('twitter done');
