#!/usr/bin/env python3
# Renders 1920x1080 speaker title slides for the Sept 21 Opening Event deck
# (Denizen x Dear Crisis, "Exploring Systemic Change"), in the Luma card
# house style: navy gradient, starfield, compass ring, cream moon with the
# arched-door emblem, NYC skyline. Fonts are the site's own embedded
# Lora/Inter woff2, pulled from climateweek.html like build_card.py does.
import re, random, math, subprocess, pathlib, html as htmlmod

PAGE = pathlib.Path("/Users/vonwong/Dropbox/ClaudeCode/DearCrisis/public/climateweek.html")
OUT_DIR = pathlib.Path(__file__).parent
W, H = 1920, 1080

# The Sept 9 redesign moved the fonts out of the HTML into files.
FONT_DIR = PAGE.parent / "climateweek" / "fonts"


def face(family, style, weight, pattern):
    matches = sorted(FONT_DIR.glob(pattern))
    assert matches, f"no font file matching {pattern} in {FONT_DIR}"
    return (f"@font-face{{font-family:'{family}';font-style:{style};font-weight:{weight};"
            f"src:url('{matches[0].as_uri()}') format('woff2')}}")


fonts_css = "\n".join([
    face("Lora", "normal", "400 700", "lora-normal-*.woff2"),
    face("Lora", "italic", "400 700", "lora-italic-*.woff2"),
    face("Inter", "normal", "100 900", "inter-normal-*.woff2"),
])

SPEAKERS = [
    ("Rosie von Lila", "Flourish: To Grow and Prosper"),
    ("Jessica Wade", "A vision to rewild NYC and move from ego-systems toward eco-systems."),
    ("Elisa Haggarty", "Moving people from blame to ownership through Conscious Activism."),
    ("Charlotte Binns", "Resilience as a collective practice involving economic strategy and relational infrastructure."),
    ("Carolina Garcia Arbelaez", "Building inner coherence in organizations to embody regeneration."),
    ("Joshua Nussbaum", "Funding the regenerative economy by dismantling the extractive one through activist investment trusts."),
    ("Félix de Rosen", "The money’s already there. We just haven’t agreed how to use it."),
    ("Roxi Shohadaee", "Exploring the role of art and culture in systemic change."),
    ("Douglas Rushkoff", "Where do we go from here?"),
    ("Erin Axelrod", "Next Economy Now"),
]


def starfield(seed):
    rnd = random.Random(seed)
    parts = []
    for _ in range(150):
        x, y = rnd.uniform(20, W - 20), rnd.uniform(20, H - 20)
        r = rnd.uniform(1.0, 2.6)
        o = rnd.uniform(0.2, 0.85)
        parts.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="#F2E7C8" opacity="{o:.2f}"/>')
    for _ in range(8):
        x, y = rnd.uniform(80, W - 80), rnd.uniform(60, 700)
        s = rnd.uniform(7, 12)
        parts.append(f'<path d="M{x:.0f} {y - s:.0f}V{y + s:.0f}M{x - s:.0f} {y}H{x + s:.0f}" stroke="#F2E7C8" stroke-width="1.4" opacity="0.5"/>')
    return "".join(parts)


# Flyer proportions carried to 16:9 — moon bottom stays above the caption
# line, and the skyline clips only the moon's lower third.
CX, CY, RING_R, MOON_R = 960, 815, 260, 195

ticks = []
for i in range(72):
    a = math.radians(i * 5)
    long = i % 6 == 0
    r1 = RING_R - (26 if long else 14)
    x1, y1 = CX + r1 * math.sin(a), CY - r1 * math.cos(a)
    x2, y2 = CX + RING_R * math.sin(a), CY - RING_R * math.cos(a)
    ticks.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#3a4a76" stroke-width="{3 if long else 2}"/>')
ring = "".join(ticks)

# Moon grid + light streaks, clipped to the disc.
grid = []
for gy in range(int(CY - MOON_R) + 30, int(CY + MOON_R), 60):
    grid.append(f'<line x1="{CX - MOON_R}" y1="{gy}" x2="{CX + MOON_R}" y2="{gy}"/>')
for gx in range(int(CX - MOON_R) + 40, int(CX + MOON_R), 60):
    grid.append(f'<line x1="{gx}" y1="{CY - MOON_R}" x2="{gx}" y2="{CY + MOON_R}"/>')
moon_grid = "".join(grid)

# NYC skyline: the card's building rhythm stretched across 1920, windows gridded.
buildings = [(0, 176, 253), (208, 128, 160), (368, 192, 307), (592, 144, 200),
             (768, 160, 273), (960, 192, 290), (1184, 152, 227), (1368, 184, 320),
             (1584, 144, 187), (1752, 168, 267)]
windows = []
for bx, bw, bh in buildings:
    top = H - bh
    lines = []
    x = bx + 12
    while x < bx + bw - 6:
        lines.append(f'<line x1="{x}" y1="{top + 10}" x2="{x}" y2="{H}" stroke="#2b3a6a" stroke-width="1.5"/>')
        x += 16
    y = top + 14
    while y < H - 5:
        lines.append(f'<line x1="{bx + 6}" y1="{y}" x2="{bx + bw - 6}" y2="{y}" stroke="#2b3a6a" stroke-width="1.5"/>')
        y += 18
    windows.append(f'<g><rect x="{bx}" y="{top}" width="{bw}" height="{bh}" fill="#16234a"/>{"".join(lines)}</g>')
skyline = "".join(windows) + '<path d="M1444 760 L1456 760 L1450 675 Z" fill="#16234a"/>'

# The Opening Event flyer's emblem: arched doorway, four-point star, base line.
EX, EY = CX, CY - 75
# Legs and base stop at the skyline's top edge (y=790), so the emblem sinks
# into the buildings the way the flyer's does instead of dangling in a gap.
emblem = f"""
<g stroke="#1a2745" stroke-width="9" fill="none" stroke-linecap="round">
  <path d="M{EX - 62} 790 L{EX - 62} {EY - 10} Q{EX - 62} {EY - 82} {EX} {EY - 82} Q{EX + 62} {EY - 82} {EX + 62} {EY - 10} L{EX + 62} 790"/>
  <line x1="{EX - 92}" y1="790" x2="{EX + 78}" y2="790"/>
</g>
<path d="M{EX} {EY - 40} C {EX + 5} {EY - 16} {EX + 12} {EY - 9} {EX + 34} {EY - 4}
         C {EX + 12} {EY + 1} {EX + 5} {EY + 8} {EX} {EY + 32}
         C {EX - 5} {EY + 8} {EX - 12} {EY + 1} {EX - 34} {EY - 4}
         C {EX - 12} {EY - 9} {EX - 5} {EY - 16} {EX} {EY - 40} Z" fill="#1a2745"/>
"""


DEFAULT_KICKER = "LIGHTNING TALKS &#10035; EXPLORING SYSTEMIC CHANGE"
DEFAULT_CAP = "DENIZEN + DEAR CRISIS &#183; CARAVAN OF DREAMS"


def render(idx, name, line, kicker=DEFAULT_KICKER, cap=DEFAULT_CAP, name_px=None, slug=None):
    seed = 100 + idx
    if name_px is None:
        name_px = 96 if len(name) > 20 else 112
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{fonts_css}
html,body{{margin:0;padding:0;width:{W}px;height:{H}px;overflow:hidden}}
body{{background:linear-gradient(180deg,#132147 0%,#0B1733 55%,#080f24 100%);
     font-family:'Inter',sans-serif;position:relative}}
svg.bg{{position:absolute;inset:0}}
.stack{{position:absolute;top:92px;left:0;right:0;display:flex;flex-direction:column;
       align-items:center;text-align:center}}
.kick{{color:#E0BC64;font-weight:700;font-size:30px;letter-spacing:.34em;text-indent:.34em}}
.name{{color:#F2E7C8;font-family:'Lora',serif;font-weight:600;font-size:{name_px}px;
      line-height:1.08;margin-top:26px}}
.sub{{color:#A9B6E4;font-family:'Lora',serif;font-style:italic;font-size:44px;
     line-height:1.35;max-width:1250px;margin-top:26px;text-wrap:balance}}
.cap{{position:absolute;top:1010px;width:100%;text-align:center;color:#F2E7C8;
     font-weight:600;font-size:24px;letter-spacing:.3em;text-indent:.3em}}
</style></head><body>
<svg class="bg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  {starfield(seed)}
  <g><path d="M{CX} {CY - RING_R - 68} L{CX + 20} {CY - RING_R - 8} L{CX} {CY - RING_R - 18} L{CX - 20} {CY - RING_R - 8} Z" fill="#9aa3b5"/>
     <path d="M{CX - RING_R - 30} {CY} L{CX - RING_R + 40} {CY - 18} L{CX - RING_R + 28} {CY} L{CX - RING_R + 40} {CY + 18} Z" fill="#9aa3b5"/>
     <path d="M{CX + RING_R + 30} {CY} L{CX + RING_R - 40} {CY - 18} L{CX + RING_R - 28} {CY} L{CX + RING_R - 40} {CY + 18} Z" fill="#9aa3b5"/></g>
  <circle cx="{CX}" cy="{CY}" r="{RING_R}" fill="none" stroke="#2b3a63" stroke-width="2.5"/>
  {ring}
  <defs><clipPath id="moon"><circle cx="{CX}" cy="{CY}" r="{MOON_R}"/></clipPath></defs>
  <circle cx="{CX}" cy="{CY}" r="{MOON_R}" fill="#F5EBCB"/>
  <g clip-path="url(#moon)">
    <g stroke="#e7dcb6" stroke-width="1.2">{moon_grid}</g>
    <rect x="{CX - 300}" y="{CY - 340}" width="130" height="700" fill="#ffffff" opacity="0.28" transform="rotate(24 {CX} {CY})"/>
    <rect x="{CX - 120}" y="{CY - 340}" width="60" height="700" fill="#ffffff" opacity="0.22" transform="rotate(24 {CX} {CY})"/>
  </g>
  {emblem}
  {skyline}
</svg>
<div class="stack">
  <div class="kick">{kicker}</div>
  <div class="name">{htmlmod.escape(name)}</div>
  <div class="sub">{htmlmod.escape(line)}</div>
  <svg width="260" height="20" viewBox="0 0 260 20" style="margin-top:30px">
    <line x1="0" y1="10" x2="245" y2="10" stroke="#E0BC64" stroke-width="1.4" opacity="0.7"/>
    <path d="M252 3 V17 M245 10 H259" stroke="#E0BC64" stroke-width="1.4" opacity="0.9"/>
  </svg>
</div>
<div class="cap">{cap}</div>
</body></html>"""
    slug = slug or re.sub(r"[^a-z0-9]+", "-", name.lower().replace("é", "e")).strip("-")
    html_path = OUT_DIR / f"{idx:02d}-{slug}.html"
    png_path = OUT_DIR / f"{idx:02d}-{slug}.png"
    html_path.write_text(doc)
    subprocess.run([
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless", "--disable-gpu", "--force-device-scale-factor=1",
        f"--screenshot={png_path}", f"--window-size={W},{H}",
        "--hide-scrollbars", html_path.as_uri(),
    ], check=True, capture_output=True, timeout=60)
    print("rendered", png_path.name, png_path.stat().st_size, "bytes")


# Closing call to action: the QR card takes the moon's place inside the compass
# ring, drawn over the skyline so it stays flat cream and scans every time.
QR_SVG = (OUT_DIR / "join-qr.svg").read_text().replace(
    "<svg", '<svg class="qr" aria-label="QR code to dearcrisis.com/join"', 1)

CTA_CX, CTA_CY, CTA_RING = 960, 722, 268

cta_ticks = []
for i in range(72):
    a = math.radians(i * 5)
    long = i % 6 == 0
    r1 = CTA_RING - (28 if long else 15)
    cta_ticks.append(
        f'<line x1="{CTA_CX + r1 * math.sin(a):.0f}" y1="{CTA_CY - r1 * math.cos(a):.0f}"'
        f' x2="{CTA_CX + CTA_RING * math.sin(a):.0f}" y2="{CTA_CY - CTA_RING * math.cos(a):.0f}"'
        f' stroke="#3a4a76" stroke-width="{3 if long else 2}"/>')


def render_cta(idx, kicker, title, line, url, cap, title_px=104, slug="join-our-nyc-community", scale=1):
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{fonts_css}
html,body{{margin:0;padding:0;width:{W}px;height:{H}px;overflow:hidden}}
body{{background:linear-gradient(180deg,#132147 0%,#0B1733 55%,#080f24 100%);
     font-family:'Inter',sans-serif;position:relative}}
svg.bg{{position:absolute;inset:0}}
.stack{{position:absolute;top:84px;left:0;right:0;display:flex;flex-direction:column;
       align-items:center;text-align:center}}
.kick{{color:#E0BC64;font-weight:700;font-size:30px;letter-spacing:.34em;text-indent:.34em}}
.name{{color:#F2E7C8;font-family:'Lora',serif;font-weight:600;font-size:{title_px}px;
      line-height:1.06;margin-top:24px}}
.sub{{color:#A9B6E4;font-family:'Lora',serif;font-style:italic;font-size:42px;
     line-height:1.34;max-width:1460px;margin-top:20px;text-wrap:balance}}
.card{{position:absolute;left:50%;top:{CTA_CY}px;transform:translate(-50%,-50%);
      background:#F5EBCB;border:2px solid #C9A227;border-radius:20px;
      padding:26px 26px 20px;display:flex;flex-direction:column;align-items:center;
      box-shadow:0 0 0 11px #0B1733,0 0 0 13px rgba(224,188,100,.45)}}
.qr{{width:272px;height:272px;display:block}}
.card .url{{color:#0B1733;font-weight:800;font-size:25px;letter-spacing:.11em;
           text-indent:.11em;margin-top:18px}}
.cap{{position:absolute;top:1012px;width:100%;text-align:center;color:#F2E7C8;
     font-weight:600;font-size:24px;letter-spacing:.3em;text-indent:.3em}}
</style></head><body>
<svg class="bg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  {starfield(207)}
  <g><path d="M{CTA_CX} {CTA_CY - CTA_RING - 68} L{CTA_CX + 20} {CTA_CY - CTA_RING - 8} L{CTA_CX} {CTA_CY - CTA_RING - 18} L{CTA_CX - 20} {CTA_CY - CTA_RING - 8} Z" fill="#9aa3b5"/>
     <path d="M{CTA_CX - CTA_RING - 30} {CTA_CY} L{CTA_CX - CTA_RING + 40} {CTA_CY - 18} L{CTA_CX - CTA_RING + 28} {CTA_CY} L{CTA_CX - CTA_RING + 40} {CTA_CY + 18} Z" fill="#9aa3b5"/>
     <path d="M{CTA_CX + CTA_RING + 30} {CTA_CY} L{CTA_CX + CTA_RING - 40} {CTA_CY - 18} L{CTA_CX + CTA_RING - 28} {CTA_CY} L{CTA_CX + CTA_RING - 40} {CTA_CY + 18} Z" fill="#9aa3b5"/></g>
  <circle cx="{CTA_CX}" cy="{CTA_CY}" r="{CTA_RING}" fill="none" stroke="#2b3a63" stroke-width="2.5"/>
  {"".join(cta_ticks)}
  {skyline}
</svg>
<div class="stack">
  <div class="kick">{kicker}</div>
  <div class="name">{htmlmod.escape(title)}</div>
  <div class="sub">{htmlmod.escape(line)}</div>
</div>
<div class="card">{QR_SVG}<div class="url">{htmlmod.escape(url)}</div></div>
<div class="cap">{cap}</div>
</body></html>"""
    suffix = "" if scale == 1 else f"-{round(W * scale / 1000)}k"   # 3840px wide -> "-4k"
    html_path = OUT_DIR / f"{idx:02d}-{slug}.html"
    png_path = OUT_DIR / f"{idx:02d}-{slug}{suffix}.png"
    html_path.write_text(doc)
    subprocess.run([
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless", "--disable-gpu", f"--force-device-scale-factor={scale}",
        f"--screenshot={png_path}", f"--window-size={W},{H}",
        "--hide-scrollbars", html_path.as_uri(),
    ], check=True, capture_output=True, timeout=60)
    print("rendered", png_path.name, png_path.stat().st_size, "bytes")


# The event's own title slide, for the big screen: the Luma flyer's text
# verbatim, at 16:9.
render(0, "Exploring Systemic Change",
       "with the Denizen + Dear Crisis communities",
       kicker="MON SEPT 21 &#10035; 7 TO 11 PM",
       cap="CARAVAN OF DREAMS &#183; THE WHOLE HOUSE",
       name_px=128, slug="exploring-systemic-change")

for i, (name, line) in enumerate(SPEAKERS, 1):
    render(i, name, line)

render_cta(11,
           "ISLANDS OF COHERENCE &#10035; NEW YORK CITY",
           "Join the Dear Crisis Community",
           "Come nurture, create, and grow islands of coherence across the city.",
           "dearcrisis.com/join",
           cap="TURNING CRISIS INTO CONNECTION &#183; CONNECTION INTO ACTION",
           title_px=94)

# same slide at 3840x2160 for the big screen
render_cta(11,
           "ISLANDS OF COHERENCE &#10035; NEW YORK CITY",
           "Join the Dear Crisis Community",
           "Come nurture, create, and grow islands of coherence across the city.",
           "dearcrisis.com/join",
           cap="TURNING CRISIS INTO CONNECTION &#183; CONNECTION INTO ACTION",
           title_px=94, scale=2)
