"""Palette maths for the StartNet brand book: OKLCH ramps anchored on brand values + WCAG contrast."""
import json, math

def s2l(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def l2s(c):
    c = max(0.0, min(1.0, c))
    v = 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
    return round(max(0, min(1, v)) * 255)

def hex2rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def rgb2hex(r, g, b): return '#%02X%02X%02X' % (r, g, b)

def lum(h):
    r, g, b = hex2rgb(h); return 0.2126 * s2l(r) + 0.7152 * s2l(g) + 0.0722 * s2l(b)

def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True); return (la + 0.05) / (lb + 0.05)

def rgb_to_oklab(h):
    r, g, b = (s2l(c) for c in hex2rgb(h))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (x ** (1 / 3) for x in (l, m, s))
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)

def oklab_to_linear(L, a, b):
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)

def oklch(h):
    L, a, b = rgb_to_oklab(h); return L, math.hypot(a, b), (math.degrees(math.atan2(b, a)) + 360) % 360

def from_oklch(L, C, H):
    # reduce chroma until in gamut
    while True:
        a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
        r, g, bl = oklab_to_linear(L, a, b)
        if all(-0.0005 <= x <= 1.0005 for x in (r, g, bl)) or C < 0.001:
            return rgb2hex(l2s(r), l2s(g), l2s(bl))
        C *= 0.97

def hsl(h):
    r, g, b = (c / 255 for c in hex2rgb(h)); mx, mn = max(r, g, b), min(r, g, b); l = (mx + mn) / 2
    if mx == mn: return 0, 0, round(l * 100)
    d = mx - mn; s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
    hh = ((g - b) / d + (6 if g < b else 0)) if mx == r else ((b - r) / d + 2) if mx == g else ((r - g) / d + 4)
    return round(hh * 60), round(s * 100), round(l * 100)

def cmyk(h):
    r, g, b = (c / 255 for c in hex2rgb(h)); k = 1 - max(r, g, b)
    if k == 1: return 0, 0, 0, 100
    return tuple(round(x * 100) for x in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))

# Ramp: lightness targets per step; chroma scaled by a bell around the anchor.
STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
LT = {50: 0.975, 100: 0.945, 200: 0.89, 300: 0.81, 400: 0.72, 500: 0.64, 600: 0.56, 700: 0.48, 800: 0.39, 900: 0.30}

def ramp(anchor_hex, anchor_step, hue_shift_dark=0.0, chroma_scale=None):
    L0, C0, H0 = oklch(anchor_hex)
    lt = dict(LT)
    # re-anchor the lightness curve so the anchor step hits the anchor exactly
    off = L0 - lt[anchor_step]
    out = {}
    for s in STEPS:
        L = max(0.12, min(0.985, lt[s] + off * (1 - abs(STEPS.index(s) - STEPS.index(anchor_step)) / 9)))
        dist = (STEPS.index(s) - STEPS.index(anchor_step))
        cf = (chroma_scale or {}).get(s, max(0.08, 1 - 0.13 * abs(dist))) if dist < 0 else max(0.35, 1 - 0.08 * dist)
        H = H0 + (hue_shift_dark * max(0, dist) / 5)
        out[s] = anchor_hex.upper() if s == anchor_step else from_oklch(L, C0 * cf, H)
    return out

INK = '#0C1719'; PAPER = '#F4F3EF'; WHITE = '#FFFFFF'; BONE = '#EBEAE5'
RED = '#EF4444'
# Tailwind's red scale is anchored exactly on #EF4444 at 500; we adopt it (perceptually tuned, familiar to developers).
RED_RAMP = {50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444',
            600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D'}

L, C, H = oklch(RED)
print('RED oklch', round(L, 3), round(C, 3), round(H, 1), 'hsl', hsl(RED))
print('INK oklch', [round(x, 3) for x in oklch(INK)], 'hsl', hsl(INK))
# Secondary: Ink = red's complement (H+180) taken almost to black.
# Tertiary candidates
cands = {
  'Marigold (analogous +45)': from_oklch(0.80, 0.155, H + 48),
  'Lagoon (complement mid)': from_oklch(0.52, 0.085, (H + 180) % 360),
  'Triadic violet': from_oklch(0.50, 0.15, (H + 120 + 120) % 360),
  'Analogous rose': from_oklch(0.62, 0.17, (H - 25) % 360),
}
for k, v in cands.items(): print(k, v, 'oklch', [round(x, 3) for x in oklch(v)], 'vsInk %.2f vsPaper %.2f' % (contrast(v, INK), contrast(v, PAPER)))
EOF_MARK = None

def explicit(H, spec):
    return {s: from_oklch(L, C, H) for s, (L, C) in spec.items()}

INK_RAMP = explicit(210, {50: (0.975, 0.004), 100: (0.945, 0.007), 200: (0.88, 0.012), 300: (0.78, 0.018), 400: (0.66, 0.024),
                         500: (0.54, 0.026), 600: (0.44, 0.026), 700: (0.35, 0.024), 800: (0.27, 0.02), 900: (0.195, 0.016)})
INK_RAMP[900] = INK
MARI = from_oklch(0.79, 0.16, 70)
MARI_RAMP = explicit(70, {50: (0.975, 0.03), 100: (0.95, 0.055), 200: (0.91, 0.095), 300: (0.86, 0.13), 400: (0.83, 0.15),
                          500: (0.79, 0.16), 600: (0.70, 0.15), 700: (0.58, 0.125), 800: (0.47, 0.10), 900: (0.37, 0.075)})
MARI_RAMP[500] = MARI
LAG = from_oklch(0.52, 0.085, 205)
LAG_RAMP = explicit(205, {50: (0.975, 0.012), 100: (0.94, 0.025), 200: (0.88, 0.045), 300: (0.79, 0.065), 400: (0.66, 0.08),
                          500: (0.52, 0.085), 600: (0.45, 0.078), 700: (0.38, 0.068), 800: (0.31, 0.055), 900: (0.24, 0.04)})
LAG_RAMP[500] = LAG
print('MARIGOLD', MARI, 'LAGOON', LAG)
data = {'red': RED_RAMP, 'ink': INK_RAMP, 'marigold': MARI_RAMP, 'lagoon': LAG_RAMP}
for name, r in data.items():
    print(name, ' '.join(f'{s}:{h}' for s, h in r.items()))
core = {'SNX Red': RED, 'Red 600 (button)': RED_RAMP[600], 'Red 700 (text)': RED_RAMP[700], 'Red 400 (on ink)': RED_RAMP[400],
        'Ink': INK, 'Paper': PAPER, 'Bone': BONE, 'White': WHITE, 'Marigold': MARI, 'Marigold 800': MARI_RAMP[800],
        'Lagoon': LAG, 'Lagoon 300': LAG_RAMP[300], 'Graphite (Ink 600)': INK_RAMP[600], 'Slate (Ink 700)': INK_RAMP[700],
        'Ink 500': INK_RAMP[500]}
print()
for k, v in core.items():
    print(f'{k:20s} {v}  rgb{hex2rgb(v)} hsl{hsl(v)} cmyk{cmyk(v)} oklch{tuple(round(x,3) for x in oklch(v))}  vsWhite {contrast(v,WHITE):.2f} vsPaper {contrast(v,PAPER):.2f} vsInk {contrast(v,INK):.2f}')
json.dump({'ramps': data, 'core': core}, open('palette.json', 'w'), indent=1)
