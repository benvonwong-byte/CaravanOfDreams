// "June 2036" scenario worksheets: one US Letter sheet per scenario, the
// scenario above a fold line and the same questions below it. Black on white
// so it photocopies cleanly.
//   node flyer/scenarios/build.mjs      -> flyer/scenarios/out/
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { HERE as FLYER, FONT_FACES, esc, chrome, rose } from '../lib.mjs';

const HERE = path.join(FLYER, 'scenarios');
const OUT = path.join(HERE, 'out');

const COMMON_A = 'Despite all of this, within New York, there are pockets where people are taking care of each other, and where the impact of these external shocks are limited. Further, within these pockets people are thriving and finding new ways of living. Unlike the pockets of billionaires around the country who have built large-scale bunkers and estates enabling them to migrate in response to weather patterns, these pockets in New York are thriving across socioeconomic strata and other common lines of division.';
const COMMON_B = 'Despite all of this, within New York, there are pockets where people are taking care of each other, and where the impact of these external shocks are limited. Further, within these pockets people are thriving and finding new ways of living. Unlike the pockets of billionaires around the country in whose hands wealth is increasingly concentrated, and who have built their own separate infrastructure for survival, these pockets in New York are thriving across socioeconomic strata and other common lines of division.';

const SCENARIOS = [
  ['It’s June 2036. People across the country have faced food insecurity, due to rolling heat waves destroying entire crop yields last summer. Since then food has become more scarce and far more expensive. Inflation overall is high, and the average wages have contracted significantly over the past ten years, with wealth increasingly concentrated in the hands of a small number of companies who are increasingly not regulated. The weather forecasters are saying this June will be the hottest yet, and New York is already in the midst of its first heat wave of the summer, with temperatures outside rising to deadly highs.', COMMON_A],
  ['It’s June 2036. Across the United States, people live with an ongoing awareness of constant surveillance - through the technology they’ve come to depend on in their day-to-day lives, as well as the networks of cameras that constantly capture comings and goings. Everyone knows that if they cross the government in any way, the data that’s been captured can be used - and rumors are, even doctored - to come after them. Just last week, rumors of a new disease emerging in New York City started to spread. People are saying that the standing water left behind from May’s massive flooding became a breeding ground for mosquitos, who are now spreading a mutated malaria virus. The rumors appear to be correct, with more people beginning to fall ill. It’s unclear how much the government-provided information can be relied upon.', COMMON_B],
  ['It’s June 2036. Over the past ten years, technological advances and oligarchic policies have shifted the economic landscape. The wealth inequalities of the early ‘20s seem paltry compared to current disparities, with wages decreasing and wealth increasingly concentrated in the hands of a small number of companies and regulations consistently in their favor. Investment in technological infrastructure at the expense of human wellbeing - in terms of health, jobs, resource allocation (including water, viable agricultural land, and housing) - has reached an all-time high, with social services nearly non-existent. Private capital has purchased mass quantities of land and housing across the United States, driving up housing costs and leading to a system in which people work at companies in return for housing and for small wages. Meanwhile, as wildfires rage across Canada, the air in New York is unbreathable with a record-breaking AQI.', COMMON_B],
  ['It’s June 2036. People are living under high levels of political oppression, with targeted prosecutions for speaking out. For the most part, people, companies, and the media have self-censored. Even reporting about the weather increasingly follows official lines - for example, recent reporting called major floods a “light rain.” Meanwhile, food and supply shortages have become widespread and normalized. Global supply chains have severely broken down, causing the costs of goods and services to soar to unprecedented levels as weather patterns become increasingly unpredictable. The U.S. is increasingly geopolitically isolated and has no access to new arctic trade routes controlled by Canada, Russia, and China. The news media frames the U.S. as a victim and official government narratives continuously blame China for every economic breakdown and shortage. It’s hard to know what is true anymore.', COMMON_A],
];


const FOLD = 6; // inches from the top edge to the fold line

// brand pieces, in black line-art so they photocopy crisp
const ROSE = rose().replace(/#E0BC64/g, '#000').replace(/ opacity="[^"]*"/g, '')
  .replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${(parseFloat(w) * 2.4).toFixed(2)}"`);
const ORN = '<div class="orn" aria-hidden="true"><span></span><b>&#10022;</b><span></span></div>';
const BRAND = '<p class="brand">Caravan of Dreams <span class="with">with</span> Dear Crisis</p>';
const KEYS = '<p class="keys"><span>Nourish</span><i>&#10022;</i><span>Connect</span><i>&#10022;</i><span>Regenerate</span><i>&#10022;</i><span>Dream</span></p>';

const css = `${FONT_FACES}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff}
body{font-family:'Lora',Georgia,serif;color:#000;-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:8.5in;height:11in;overflow:hidden;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
/* tarot-card frame: double rule with a star at each corner */
.frame{position:absolute;inset:.32in;border:1.25px solid #000;pointer-events:none}
.frame::after{content:'';position:absolute;inset:.05in;border:.5px solid #000}
.corner{position:absolute;font-size:9pt;line-height:1;background:#fff;padding:.02in;width:.16in;height:.16in;display:flex;align-items:center;justify-content:center}
.corner.tl{left:.24in;top:.24in}.corner.tr{right:.24in;top:.24in}.corner.bl{left:.24in;bottom:.24in}.corner.br{right:.24in;bottom:.24in}
.top{position:absolute;left:0;right:0;top:0;height:${FOLD}in;padding:.58in .8in .3in}
.bottom{position:absolute;left:0;right:0;top:${FOLD}in;bottom:0;padding:.3in .8in .75in}
.brand{text-align:center;font-size:9.5pt;letter-spacing:.02em;margin:0}
.brand .with{font-style:italic;opacity:.6}
.orn{display:flex;align-items:center;gap:.1in;width:2.2in;margin:.08in auto 0}
.orn span{flex:1;height:.75px;background:#000}
.orn b{font-weight:400;font-size:9pt;line-height:1}
.orn.q{margin:.06in auto .14in;width:1.6in}
.head{display:flex;align-items:center;gap:.28in;margin-top:.14in}
.rose{width:.95in;height:.95in;flex:none}
.kicker{font-family:'Inter',Helvetica,Arial,sans-serif;font-size:7pt;font-weight:600;letter-spacing:.26em;text-transform:uppercase;margin:0}
h1{font-weight:500;font-size:26pt;line-height:1.05;margin:.04in 0 0;letter-spacing:-.012em}
.hosts{font-style:italic;font-size:9.5pt;margin:.05in 0 0;opacity:.8}
.rule{width:100%;height:0;border-top:.75px solid #000;margin:.14in 0 .16in;position:relative}
.rule::after{content:'';position:absolute;left:0;right:0;top:.035in;border-top:.5px solid #000}
.scenario p{font-size:10pt;line-height:1.45;margin:0 0 .1in;text-wrap:pretty}
.scenario p:last-child{margin-bottom:0}
/* the shared closing paragraph: set apart in italic, after a small ornament */
.orn.s{width:1.3in;margin:.04in auto .08in}
.scenario p.common{font-style:italic;padding:0 .1in;text-align:center;font-size:10pt;line-height:1.45}
.fold{position:absolute;left:.32in;right:.32in;top:${FOLD}in;height:0;border-top:1px dashed #000}
.fold span{position:absolute;left:50%;transform:translateX(-50%);top:-.085in;background:#fff;padding:0 .12in;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:6.5pt;font-weight:600;letter-spacing:.24em;text-transform:uppercase;white-space:nowrap}
.fold span b{font-family:'Lora',Georgia,serif;font-weight:400;font-size:8pt;letter-spacing:0;margin:0 .06in}
h2{font-weight:500;font-size:19pt;margin:0;text-align:center;letter-spacing:-.01em}
.remind{font-style:italic;font-size:10.4pt;margin:0 0 .14in;line-height:1.45;text-align:center}
.q{font-size:11pt;line-height:1.45;margin:0 0 .26in;position:relative;padding-left:.32in;text-wrap:pretty}
.q.main{padding-left:0;font-weight:700;font-size:11.5pt;text-align:center;margin-bottom:.22in}
.q .arrow{position:absolute;left:.02in;top:.01in;font-size:10pt}
.q:last-child{margin-bottom:0}
.foot{position:absolute;left:.8in;right:.8in;bottom:.5in;text-align:center}
.keys{display:flex;align-items:center;justify-content:center;gap:.09in;margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:6.8pt;font-weight:600;letter-spacing:.24em;text-transform:uppercase}
.keys i{font-style:normal;font-family:'Lora',Georgia,serif;font-size:8pt}
.url{font-family:'Inter',Helvetica,Arial,sans-serif;font-size:6.5pt;letter-spacing:.14em;text-transform:uppercase;margin:.07in 0 0;opacity:.75}
`;

const QUESTIONS = `
<h2>Questions</h2>
${ORN.replace('class="orn"','class="orn q"')}
<p class="remind">Remember &mdash; you are an anthropologist and documentarian! What do you observe?</p>
<p class="q main">What exactly is happening? Describe in detail; tell the story.</p>
<p class="q"><span class="arrow">&#10022;</span>Who is doing it? Who is in relationship? What types of structures, technologies, etc. are in place?</p>
<p class="q"><span class="arrow">&#10022;</span>What deep stories guide these pockets of thriving? What are the deep beliefs and frameworks?</p>
<p class="q"><span class="arrow">&#10022;</span>What made and continues to make these pockets of thriving possible? How did people seize on the resources and assets made available by the collapse? Which resources/opportunities?</p>`;

const page = (n, [a, b]) => `<div class="page">
  <div class="frame" aria-hidden="true"></div>
  <span class="corner tl" aria-hidden="true">&#10022;</span><span class="corner tr" aria-hidden="true">&#10022;</span><span class="corner bl" aria-hidden="true">&#10022;</span><span class="corner br" aria-hidden="true">&#10022;</span>
  <div class="top">
    ${BRAND}${ORN}
    <div class="head">${ROSE}<div><p class="kicker">Imaginarium &middot; An intimate working dinner ft. Nate Hagens</p><h1>Scenario ${n} <span style="font-weight:400;opacity:.45;font-size:.6em">of ${SCENARIOS.length}</span></h1><p class="hosts">Hosted by Benjamin Von Wong and Rachel Brown &middot; June 2036</p></div></div>
    <div class="rule"></div>
    <div class="scenario"><p>${esc(a)}</p>${ORN.replace('class="orn"','class="orn s"')}<p class="common">${esc(b)}</p></div>
  </div>
  <div class="fold"><span><b>&#10022;</b>fold here<b>&#10022;</b></span></div>
  <div class="bottom">${QUESTIONS}</div>
  <div class="foot">${KEYS}<p class="url">dearcrisis.com/climateweek &middot; 405 E 6th St, East Village, New York</p></div>
</div>`;

rmSync(OUT, {recursive:true, force:true}); mkdirSync(OUT);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>June 2036 scenarios</title><style>${css}</style></head><body>${SCENARIOS.map((s,i)=>page(i+1,s)).join('')}</body></html>`;
const f = path.join(OUT, 'scenarios-2036.html'); writeFileSync(f, html);
chrome(['--no-pdf-header-footer','--print-to-pdf='+path.join(OUT,'scenarios-2036.pdf'),'file://'+f]);
console.log('built scenarios-2036.pdf (' + SCENARIOS.length + ' pages)');
// one 300 dpi grayscale PNG per scenario
SCENARIOS.forEach((s,i)=>{
  const pf = path.join(OUT, `scenario-${i+1}.html`); writeFileSync(pf, html.replace(/<body>[\s\S]*<\/body>/, '<body>'+page(i+1,s)+'</body>'));
  const png = path.join(OUT, `scenario-${i+1}.png`);
  chrome(['--window-size=816,1056','--force-device-scale-factor=3.125','--screenshot='+png,'file://'+pf]);
  execFileSync('sips', ['-s','dpiWidth','300','-s','dpiHeight','300', png], {stdio:'pipe'});
  console.log('built scenario-'+(i+1)+'.png');
});
