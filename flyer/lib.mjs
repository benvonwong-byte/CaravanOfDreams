// Shared pieces for the Climate Week print flyer and the social cuts:
// design tokens from dearcrisis.com/climateweek, the vector starfield and
// compass rose, embedded fonts, the QR code, and the schedule data.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
const DC = path.resolve(HERE, '../../DearCrisis');
const require = createRequire(path.join(DC, 'package.json'));
const QRCode = require('qrcode');
const FONTS = path.join(DC, 'public/climateweek/fonts');
export const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const URL = 'https://dearcrisis.com/climateweek';

export const font = f => 'data:font/woff2;base64,' + readFileSync(path.join(FONTS, f)).toString('base64');
export const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

export const FONT_FACES = `
@font-face{font-family:'Lora';font-style:normal;font-weight:400 700;src:url(${font('lora-normal-6b102ab3.woff2')})format('woff2')}
@font-face{font-family:'Lora';font-style:italic;font-weight:400 700;src:url(${font('lora-italic-3d536d49.woff2')})format('woff2')}
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;src:url(${font('inter-normal-c9407645.woff2')})format('woff2')}`;

export const TOKENS = `
:root{
  --ink:#F2E7C8;--body:#C3CADF;--paper:#0B1733;--blue:#E0BC64;--olive:#C9A227;--grey:#8B93B4;--teal:#B8C4E8;--sky:#8FD0E8;
  --hairline:rgba(224,188,100,.28);
  --serif:'Lora',Georgia,serif;--sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
}`;

// deterministic PRNG so every build prints the same sky
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

// same three layers as the site's canvas sky, drawn as vector so it prints crisp
export function starfield(W, H, seed, scale = 1){
  const rnd = mulberry32(seed), r = (a,b)=>a+rnd()*(b-a);
  const area = (W*H)/(1440*900)/(scale*scale);
  const layers = [
    {n:Math.max(24,Math.round(85*area*3.2)), sz:[.4,1.0]},
    {n:Math.max(16,Math.round(52*area*3.2)), sz:[.6,1.5]},
    {n:Math.max(10,Math.round(26*area*3.2)), sz:[.8,2.0]},
  ];
  let out = '', mid = [];
  layers.forEach((L,li)=>{
    for (let i=0;i<L.n;i++){
      const x=+(rnd()*W).toFixed(1), y=+(rnd()*H).toFixed(1), rad=+(r(L.sz[0],L.sz[1])*scale).toFixed(2);
      const a=+r(.35,.9).toFixed(2), gold=rnd()<.38, c=gold?'#E9CC79':'#EDF1FD';
      out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${c}" opacity="${a}"/>`;
      if (rad>1.55*scale){ const g=+(rad*4.2).toFixed(1);
        out += `<path d="M${x-g} ${y}H${x+g}M${x} ${y-g}V${y+g}" stroke="${c}" stroke-width="${(.7*scale).toFixed(2)}" opacity="${(a*.55).toFixed(2)}"/>`; }
      if (li===1) mid.push([x,y]);
    }
  });
  const R2 = 8100*scale*scale;
  for (let i=0;i<mid.length;i++) for (let j=i+1;j<mid.length;j++){
    const dx=mid[i][0]-mid[j][0], dy=mid[i][1]-mid[j][1], d2=dx*dx+dy*dy;
    if (d2<R2) out += `<line x1="${mid[i][0]}" y1="${mid[i][1]}" x2="${mid[j][0]}" y2="${mid[j][1]}" stroke="#C7AE6B" stroke-width="${(.6*scale).toFixed(2)}" opacity="${((1-d2/R2)*.08).toFixed(3)}"/>`;
  }
  return out;
}
export function sky(W, H, scale = 1, seed = 20260921){
  return `<svg class="sky" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1531"/><stop offset="1" stop-color="#14244E"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>${starfield(W, H, seed, scale)}</svg>`;
}

// the page's compass rose, verbatim geometry
export function rose(){
  const CX=200, CY=200, G='#E0BC64'; let s='';
  [188,179,122,64,16].forEach((r,i)=>{ s+=`<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="${G}" stroke-width="${i===1?.5:1}"/>`; });
  s+=`<circle cx="${CX}" cy="${CY}" r="150" fill="none" stroke="${G}" stroke-width=".5" stroke-dasharray="1 6"/>`;
  for (let d=0;d<360;d+=15){ const a=d*Math.PI/180, long=d%45===0, r1=20, r2=long?176:118;
    s+=`<line x1="${CX+Math.sin(a)*r1}" y1="${CY-Math.cos(a)*r1}" x2="${CX+Math.sin(a)*r2}" y2="${CY-Math.cos(a)*r2}" stroke="${G}" stroke-width="${long?.9:.5}" opacity="${long?.9:.55}"/>`; }
  for (let d=0;d<360;d+=90){ const a=d*Math.PI/180, tip=186, base=116, w=9, pa=a+Math.PI/2;
    const tx=CX+Math.sin(a)*tip, ty=CY-Math.cos(a)*tip, bx=CX+Math.sin(a)*base, by=CY-Math.cos(a)*base;
    s+=`<polygon points="${tx},${ty} ${bx+Math.sin(pa)*w},${by-Math.cos(pa)*w} ${bx-Math.sin(pa)*w},${by+Math.cos(pa)*w}" fill="none" stroke="${G}" stroke-width=".9"/>`; }
  for (let d=0;d<360;d+=5){ if (d%15===0) continue; const a=d*Math.PI/180;
    s+=`<line x1="${CX+Math.sin(a)*179}" y1="${CY-Math.cos(a)*179}" x2="${CX+Math.sin(a)*184}" y2="${CY-Math.cos(a)*184}" stroke="${G}" stroke-width=".5" opacity=".6"/>`; }
  return `<svg class="rose" viewBox="0 0 400 400" aria-hidden="true">${s}</svg>`;
}

export async function qr(){
  // lapis modules on parchment: dark-on-light scans on every phone camera
  const svg = await QRCode.toString(URL, {type:'svg', errorCorrectionLevel:'Q', margin:0, color:{dark:'#0B1733', light:'#0000'}});
  return svg.replace('<svg', '<svg class="qr" aria-label="QR code to dearcrisis.com/climateweek"');
}

// ---------- schedule data: live Luma feed + price snapshot ----------
const SHORT = {
  'The Science - and Art - of Regenerative Economics: Revolutionary Thinking for a World in Crisis': 'Regenerative Economics with John Fullerton',
  "We Already Have the Solutions. So Why Aren't We Using Them? Live Podcast with Dr. Ayana Elizabeth Johnson": 'Live Podcast with Dr. Ayana Elizabeth Johnson',
  'Exploring systemic change with the Denizen and DearCrisis communities.': 'Opening Night: Exploring Systemic Change',
  'Our Crises Call for Re-enchantment: a Panel and Portal': 'Our Crises Call for Re-enchantment',
  'Imaginarium: An intimate working dinner ft. Nate Hagens': 'Imaginarium: Dinner with Nate Hagens',
  'What to Do as the World Falls Apart With Nate Hagens - Metacrisis Salon #15': 'What to Do as the World Falls Apart',
  'Collaboration Infrastructure for Coordinated Impact': 'Collaboration Infrastructure for Impact',
  'Mapping the Climate Ecosystem: Infrastructure for Coordinated Impact': 'Mapping the Climate Ecosystem',
  'Aligning AI Safety with Earth: Salon': 'Aligning AI Safety with Earth',
  'Krill Baby Krill: Piloting an Activist Investment Trust for the Antarctic': 'Krill Baby Krill: Activist Investing',
  'Biodiversity Love And Law: How Stories, Art, And Law Come Together For Biodiversity Protection': 'Biodiversity, Love and Law',
  'Dreaming a World that Works for All – ft. Ecocivilization Coalition': 'Dreaming a World that Works for All',
  'Regen Speakeasy...shhh': 'Regen Speakeasy',
  'Apocamate: Find Your Person Before the End of the World': 'Apocamate: Find Your Person',
  'Apocamate: Find Your Person/People Before the End of the World': 'Apocamate: Find Your Person',
  'The Money Game w/MC.Lai': 'The Money Game with MC Lai',
};
const TAG = {'interview':'Talk','workshop':'Workshop','field trips':'Field trip','social':'Social','metacrisis salon':'Salon'};
// tags and prices for events the snapshot does not cover (read off Luma 2026-09-11)
const EXTRA = {
  'dear-gx0x': {price:'$15', tag:'Gathering'},
  'dear-ox3x': {price:'$20+', tag:'Workshop'},
  'dear-33eb': {price:'$10+', tag:'Ritual'},
  'dear-46yq': {tag:'Talk'},
  'climateengagementlab': {tag:'Workshop'},
  'dear-1jr6': {tag:'Field trip', price:'$5–18'},   // tiers confirmed on luma.com/dear-1jr6 2026-09-17; the site feed dropped it
  'ab2vr3eh': {tag:'Talk'},
  'dear-s6mc': {tag:'Workshop'},
};
// events Von has confirmed as live before Luma shows them public (name match)
const LIVE = { 'Apocamate': {tag:'Social', price:'$20', url:'https://luma.com/dear-quf8'},
               'We interrupt this doom': {tag:'Workshop', price:'$10+'} };   // sliding scale from $10 per the Luma description
// events left off the flyer and social cuts entirely (name prefix match)
const HIDE = ['Elder Circle'];
const slug = u => { const m = String(u||'').match(/luma\.com\/([^\/?#]+)/); return m ? m[1].toLowerCase() : ''; };
const nyDate = iso => new Date(new Date(iso).getTime() - 4*3600*1000); // feed is UTC; the week is EDT
function fmt(d){ let h=d.getUTCHours(), m=d.getUTCMinutes(); const ap=h>=12?'PM':'AM'; h=h%12||12; return h + (m?':'+String(m).padStart(2,'0'):'') + ' ' + ap; }
const DN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/** [{label:'Monday, September 21', short:'Mon 21', rows:[{time,name,tag,price,priv}]}] */
// allPublic: show private events like any other (real tag + price) instead of 'Invite only'
export function scheduleDays({ allPublic = false } = {}){
  const ev = JSON.parse(readFileSync(path.join(HERE,'events.json'),'utf8')).events;
  const pr = {}; JSON.parse(readFileSync(path.join(HERE,'prices.json'),'utf8')).events.forEach(e=>{ pr[slug(e.url)] = e; });
  const days = {};
  ev.sort((a,b)=>a.start_at.localeCompare(b.start_at)).forEach(e=>{
    if (HIDE.some(h => e.name.startsWith(h))) return;
    const s = nyDate(e.start_at), t = nyDate(e.end_at), key = s.toISOString().slice(0,10);
    const p = pr[slug(e.url)] || {}, x = EXTRA[slug(e.url)] || {};
    let name = SHORT[e.name] || e.name.replace(/\s*\[Field Trip\]\s*/,'');
    let tag = x.tag || TAG[(p.tags||[])[0]] || '', price = x.price || p.price || '', priv = false;
    const live = Object.keys(LIVE).find(k => e.name.startsWith(k));
    if (live){ tag = LIVE[live].tag; price = LIVE[live].price; }
    else if (e.visibility === 'private' && !allPublic){ tag = 'Invite only'; price = ''; priv = true; }
    if (/Money Game/.test(e.name)){ price = price || 'Free'; tag = 'Workshop'; }
    const a = fmt(s), b = fmt(t);
    const time = a.replace(/ (AM|PM)$/, (m,ap)=> ap === b.slice(-2) ? '' : ' '+ap) + '–' + b;
    if (!days[key]) days[key] = {label:`${DN[s.getUTCDay()]}, September ${s.getUTCDate()}`, short:`${DS[s.getUTCDay()]} ${s.getUTCDate()}`, rows:[]};
    days[key].rows.push({time, name, tag, price, priv});
  });
  return Object.keys(days).sort().map(k=>days[k]);
}

export function chrome(args){ execFileSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars', ...args], {stdio:'pipe'}); }
