"""Generate architectural placeholder imagery for M Realty.

All images are drawn programmatically (vector-style: facades, floor plans,
interior abstractions, duotone portraits) so the site ships with coherent,
on-brand artwork and no external image dependencies.
Run:  python3 assets/generate.py   (from repo root)
"""
import math
import random
from PIL import Image, ImageDraw, ImageFilter

OUT = "assets/img/"

NAVY = (10, 28, 58)
NAVY_DEEP = (7, 19, 40)
NAVY_MID = (16, 40, 78)
GOLD = (197, 160, 89)
STONE = (248, 249, 250)
GREY = (170, 175, 182)
WHITE = (255, 255, 255)


def canvas(w, h, base):
    img = Image.new("RGB", (w, h), base)
    return img, ImageDraw.Draw(img)


def grain(img, amount=6, seed=7):
    """Subtle monochrome noise to avoid flat digital look."""
    rnd = random.Random(seed)
    px = img.load()
    w, h = img.size
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            n = rnd.randint(-amount, amount)
            r, g, b = px[x, y]
            v = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
            px[x, y] = v
    return img


def sky_gradient(d, w, h, top, bottom, bands=48):
    for i in range(bands):
        t = i / (bands - 1)
        c = tuple(int(top[j] + (bottom[j] - top[j]) * t) for j in range(3))
        d.rectangle([0, int(h * i / bands), w, int(h * (i + 1) / bands) + 1], fill=c)


def tower(d, x, y0, y1, w_, cols, rows, lit, seed, win=(0, 0, 0)):
    """Draw a building block with a window grid; some windows lit gold."""
    rnd = random.Random(seed)
    d.rectangle([x, y0, x + w_, y1], fill=lit)
    pw = w_ / cols
    ph = (y1 - y0) / rows
    if ph < 3 or pw < 3:
        return
    ww, wh = pw * 0.55, ph * 0.5
    for r in range(rows):
        for c in range(cols):
            wx = x + c * pw + (pw - ww) / 2
            wy = y0 + r * ph + (ph - wh) * 0.7
            if rnd.random() < 0.16:
                d.rectangle([wx, wy, wx + ww, wy + wh], fill=GOLD)
            else:
                shade = tuple(max(0, min(255, v + rnd.randint(-14, 14))) for v in win)
                d.rectangle([wx, wy, wx + ww, wy + wh], fill=shade)


def facade_scene(fname, w=1600, h=1000, variant=0, dusk=False):
    """Modern architecture elevation over a plain ground line."""
    img, d = canvas(w, h, NAVY_DEEP if dusk else (23, 34, 55))
    top = (9, 18, 38) if dusk else (30, 46, 74)
    bot = (30, 44, 72) if dusk else (96, 112, 138)
    sky_gradient(d, w, h, top, bot)

    # faint horizon haze
    d.rectangle([0, h * 0.62, w, h], fill=(12, 22, 40))

    rnd = random.Random(variant * 13 + 3)
    ground_y = int(h * 0.82)

    # background silhouettes
    for i in range(7):
        bw = rnd.randint(60, 160)
        bh = rnd.randint(120, 320)
        bx = rnd.randint(0, w - bw)
        d.rectangle([bx, ground_y - bh, bx + bw, ground_y], fill=(18, 30, 52))

    hero_blocks = []
    if variant % 3 == 0:          # twin towers
        tw = int(w * 0.17)
        for k in range(2):
            tx = int(w * (0.30 + k * 0.24))
            th = int(h * (0.62 - k * 0.04))
            hero_blocks.append((tx, ground_y - th, tw, th, 6, int(th / 26)))
    elif variant % 3 == 1:        # stepped slab
        segs = [(0.18, 0.30, 0.52), (0.48, 0.26, 0.66), (0.74, 0.16, 0.44)]
        for fx, fw, fh in segs:
            hero_blocks.append((int(w * fx), ground_y - int(h * fh), int(w * fw), int(h * fh), 8, int(h * fh / 24)))
    else:                         # courtyard low-rise + single tower
        hero_blocks.append((int(w * 0.10), ground_y - int(h * 0.30), int(w * 0.42), int(h * 0.30), 10, 9))
        hero_blocks.append((int(w * 0.58), ground_y - int(h * 0.58), int(w * 0.20), int(h * 0.58), 5, 22))

    for (bx, by, bw, bh, cols, rows) in hero_blocks:
        body = (206, 206, 200) if not dusk else (150, 152, 158)
        tower(d, bx, by, ground_y, bw, cols, rows, body, bx + bh, win=(24, 38, 62))
        # thin gold roof line
        d.rectangle([bx, by, bx + bw, by + 3], fill=GOLD)
        # vertical fin detail
        for fx in range(bx, bx + bw, max(24, bw // 5)):
            d.line([fx, by + 6, fx, ground_y], fill=(160, 160, 156), width=1)

    # ground plane + reflecting strip
    d.rectangle([0, ground_y, w, h], fill=(14, 24, 42))
    d.rectangle([0, ground_y, w, ground_y + 2], fill=GOLD)
    for (bx, by, bw, bh, *_rest) in hero_blocks:
        ref = d.rectangle  # faint reflection blocks
        ref([bx, ground_y + 6, bx + bw, ground_y + 6 + bh * 0.12], fill=(20, 32, 54))

    # trees as dark circles
    for tx in range(60, w, 210):
        ty = ground_y - 8
        r = 26
        d.ellipse([tx - r, ty - r * 2, tx + r, ty], fill=(9, 16, 30))
        d.rectangle([tx - 2, ty, tx + 2, ty + 14], fill=(9, 16, 30))

    img = img.filter(ImageFilter.GaussianBlur(0.4))
    grain(img, 5, seed=variant + 11)
    img.save(OUT + fname, quality=88)


def interior_scene(fname, w=1400, h=1000, variant=0):
    """Abstract interior: wall panels, window aperture, furniture silhouettes."""
    palettes = [
        ((232, 228, 220), (206, 199, 188), NAVY),
        ((198, 201, 205), (168, 172, 178), NAVY_MID),
        ((226, 220, 210), (190, 178, 158), (30, 34, 40)),
    ]
    wall, floor, dark = palettes[variant % 3]
    img, d = canvas(w, h, wall)

    # floor
    fy = int(h * 0.68)
    d.polygon([(0, fy), (w, fy - 40), (w, h), (0, h)], fill=floor)
    # skirting
    d.line([(0, fy), (w, fy - 40)], fill=(120, 118, 112), width=3)

    # large window aperture with city view fragment
    wx, wy, ww, wh = int(w * 0.08), int(h * 0.10), int(w * 0.44), int(h * 0.50)
    d.rectangle([wx - 10, wy - 10, wx + ww + 10, wy + wh + 10], fill=dark)
    d.rectangle([wx, wy, wx + ww, wy + wh], fill=(120, 140, 168))
    # distant buildings inside window
    rnd = random.Random(variant * 7 + 2)
    for i in range(5):
        bw = rnd.randint(ww // 8, ww // 4)
        bh = rnd.randint(wh // 4, wh // 2)
        bx = wx + rnd.randint(0, ww - bw)
        d.rectangle([bx, wy + wh - bh, bx + bw, wy + wh], fill=(88, 106, 134))
    # mullions
    for mx in range(wx, wx + ww, ww // 3):
        d.line([mx, wy, mx, wy + wh], fill=dark, width=8)
    d.line([wx, wy + wh // 2, wx + ww, wy + wh // 2], fill=dark, width=8)

    # timber slat feature wall
    sx = int(w * 0.60)
    d.rectangle([sx, int(h * 0.06), w - int(w * 0.04), fy - 20], fill=(168, 132, 92))
    for ly in range(int(h * 0.06), fy - 20, 26):
        d.line([sx, ly, w - int(w * 0.04), ly], fill=(128, 96, 60), width=3)

    # furniture silhouettes: sofa, table, lamp
    sofa_x, sofa_y = int(w * 0.56), int(h * 0.60)
    d.rounded_rectangle([sofa_x, sofa_y, sofa_x + int(w * 0.30), sofa_y + 120], radius=6, fill=(44, 48, 56))
    d.rounded_rectangle([sofa_x, sofa_y - 60, sofa_x + int(w * 0.30), sofa_y + 20], radius=6, fill=(58, 62, 72))
    d.rectangle([sofa_x - 20, sofa_y - 70, sofa_x, sofa_y + 120], fill=(44, 48, 56))
    d.rectangle([sofa_x + int(w * 0.30), sofa_y - 70, sofa_x + int(w * 0.30) + 20, sofa_y + 120], fill=(44, 48, 56))
    # rug
    d.polygon([(int(w*0.16), fy+40), (int(w*0.52), fy-10), (int(w*0.62), h-60), (int(w*0.10), h-40)], fill=(214, 208, 196))
    # coffee table
    d.rectangle([int(w*0.26), int(h*0.78), int(w*0.40), int(h*0.78)+16], fill=(90, 70, 50))
    d.line([int(w*0.28), int(h*0.78)+16, int(w*0.28), int(h*0.84)], fill=(90, 70, 50), width=6)
    d.line([int(w*0.38), int(h*0.78)+16, int(w*0.38), int(h*0.84)], fill=(90, 70, 50), width=6)
    # floor lamp with gold shade
    lx = int(w * 0.50)
    d.line([lx, int(h*0.30), lx, fy+30], fill=(30, 30, 34), width=5)
    d.polygon([(lx-46, int(h*0.30)), (lx+46, int(h*0.30)), (lx+26, int(h*0.22)), (lx-26, int(h*0.22))], fill=GOLD)

    # plant
    px = int(w * 0.05)
    d.rectangle([px, fy+60, px+60, fy+140], fill=(70, 74, 80))
    for i in range(6):
        ang = math.pi * (0.15 + 0.7 * i / 5)
        ex = px + 30 + int(70 * math.cos(ang + math.pi))
        ey = fy + 60 - int(110 * math.sin(ang))
        d.line([px + 30, fy + 60, ex, ey], fill=(52, 84, 60), width=8)

    img = img.filter(ImageFilter.GaussianBlur(0.5))
    grain(img, 5, seed=variant * 3 + 5)
    img.save(OUT + fname, quality=88)


def plan_drawing(fname, rooms, w=1400, h=1000, title="MAISONETTE PLAN"):
    """Technical floor-plan on paper background."""
    img, d = canvas(w, h, (247, 246, 242))
    m = 90
    d.rectangle([m, m, w - m, h - m], outline=NAVY, width=6)

    def room(x0, y0, x1, y1, label):
        d.rectangle([x0, y0, x1, y1], outline=NAVY, width=3)
        # hatch fill light
        for hx in range(int(x0), int(x1), 26):
            d.line([hx, y0, min(hx + (y1 - y0), x1), y1 if hx + (y1 - y0) <= x1 else y0 + (x1 - hx)],
                   fill=(225, 224, 218), width=1)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        d.text((cx - len(label) * 4, cy - 6), label, fill=NAVY, font_size=20)

    S = (w - 2 * m)
    T = (h - 2 * m)
    for (rx, ry, rw, rh, label) in rooms:
        room(m + rx * S, m + ry * T, m + (rx + rw) * S, m + (ry + rh) * T, label)

    # dimension lines
    d.line([m, m - 40, w - m, m - 40], fill=GOLD, width=2)
    for tx in range(m, w - m, 60):
        d.line([tx, m - 46, tx, m - 34], fill=GOLD, width=2)
    d.text((m, m - 78), title, fill=NAVY, font_size=26)
    d.text((w - m - 150, h - m + 30), "SCALE 1:100", fill=(120, 120, 118), font_size=18)
    # north arrow
    nx, ny = w - m + 40, m + 40
    d.polygon([(nx, ny - 30), (nx - 12, ny + 18), (nx + 12, ny + 18)], fill=NAVY)
    d.text((nx - 6, ny + 24), "N", fill=NAVY, font_size=22)
    img.save(OUT + fname, quality=90)


def portrait(fname, seed, shirt=(30, 40, 58)):
    """Duotone editorial headshot placeholder."""
    w, h = 800, 1000
    rnd = random.Random(seed)
    img, d = canvas(w, h, (236, 234, 228))
    # backdrop split
    d.rectangle([0, 0, w, h], fill=(228, 226, 220))
    d.rectangle([0, int(h * 0.72), w, h], fill=(210, 208, 202))

    skin = tuple(min(255, 150 + rnd.randint(-12, 12) + i * 12) for i in range(3))
    skin = (168, 128, 98) if seed % 2 else (196, 160, 128)
    hair = (28, 26, 26) if seed % 3 else (44, 36, 30)

    cx = w // 2
    # shoulders / suit
    d.ellipse([cx - 300, h - 420, cx + 300, h + 120], fill=shirt)
    # lapels
    d.polygon([(cx - 60, h - 300), (cx, h - 120), (cx - 150, h - 160)], fill=(246, 246, 246))
    d.polygon([(cx + 60, h - 300), (cx, h - 120), (cx + 150, h - 160)], fill=(238, 238, 238))
    d.polygon([(cx - 14, h - 300), (cx + 14, h - 300), (cx, h - 190)], fill=GOLD)  # tie accent
    # neck
    d.rectangle([cx - 46, h - 480, cx + 46, h - 300], fill=skin)
    # head
    d.ellipse([cx - 110, h - 760, cx + 110, h - 470], fill=skin)
    # hair
    if seed % 4 == 0:
        d.pieslice([cx - 118, h - 775, cx + 118, h - 505], 180, 360, fill=hair)
        d.rectangle([cx - 118, h - 640, cx - 96, h - 540], fill=hair)
        d.rectangle([cx + 96, h - 640, cx + 118, h - 540], fill=hair)
    elif seed % 4 in (1, 2):
        d.pieslice([cx - 116, h - 762, cx + 116, h - 520], 160, 380, fill=hair)
    else:
        d.ellipse([cx - 130, h - 790, cx + 130, h - 430], fill=hair)
        d.ellipse([cx - 100, h - 740, cx + 100, h - 480], fill=skin)
    # subtle face features
    d.line([cx - 40, h - 610, cx - 12, h - 610], fill=(90, 70, 60), width=5)
    d.line([cx + 12, h - 610, cx + 40, h - 610], fill=(90, 70, 60), width=5)
    d.line([cx - 18, h - 545, cx + 18, h - 545], fill=(120, 88, 78), width=5)

    img = img.convert("L").convert("RGB")
    # duotone: map luminance navy->cream
    src = Image.open(OUT + fname).convert("L") if False else img.convert("L")
    lut = []
    for v in range(256):
        t = v / 255
        r = int(NAVY[0] + (240 - NAVY[0]) * t)
        g = int(NAVY[1] + (236 - NAVY[1]) * t)
        b = int(NAVY[2] + (226 - NAVY[2]) * t)
        lut.append((r, g, b))
    out = src.convert("RGB")
    out.putdata([lut[p] for p in src.getdata()])
    grain(out, 7, seed=seed + 31)
    out.save(OUT + fname, quality=88)


def neighbourhood(fname, seed, kind=0):
    """Aerial-ish abstract street grid in brand tones."""
    w, h = 1200, 800
    rnd = random.Random(seed)
    img, d = canvas(w, h, (24, 38, 62))
    sky_gradient(d, w, h, (16, 30, 52), (52, 70, 96))
    # grid streets
    for gx in range(0, w, 150):
        d.line([gx + rnd.randint(-20, 20), 0, gx + rnd.randint(-20, 20), h], fill=(196, 196, 190), width=10)
    for gy in range(0, h, 130):
        d.line([0, gy, w, gy], fill=(196, 196, 190), width=8)
    # blocks
    for gx in range(0, w, 150):
        for gy in range(0, h, 130):
            bw, bh = rnd.randint(50, 110), rnd.randint(40, 90)
            bx, by = gx + rnd.randint(15, 35), gy + rnd.randint(15, 30)
            tone = rnd.choice([(208, 206, 200), (178, 178, 174), (150, 154, 160)])
            d.rectangle([bx, by, bx + bw, by + bh], fill=tone)
            if rnd.random() < 0.12:
                d.rectangle([bx, by, bx + bw, by + bh], fill=GOLD)
    # park wedge
    if kind % 2:
        d.polygon([(w*0.62, h*0.1), (w*0.9, h*0.2), (w*0.8, h*0.55), (w*0.55, h*0.4)], fill=(64, 96, 70))
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    grain(img, 6, seed=seed)
    img.save(OUT + fname, quality=86)


# ---------------------------------------------------------------- build all
random.seed(42)

# Hero + project imagery
facade_scene("hero.jpg", 1920, 1080, variant=0, dusk=True)
facade_scene("project-gemini-hero.jpg", 1920, 1080, variant=3, dusk=False)
facade_scene("project-gemini-1.jpg", 1400, 900, variant=1)
facade_scene("project-gemini-2.jpg", 1400, 900, variant=4, dusk=True)
facade_scene("project-gemini-3.jpg", 1400, 900, variant=2)
facade_scene("project-gemini-4.jpg", 1400, 900, variant=5, dusk=True)
facade_scene("project-quarter-hero.jpg", 1920, 1080, variant=2, dusk=False)
facade_scene("project-quarter-1.jpg", 1400, 900, variant=5)
facade_scene("project-quarter-2.jpg", 1400, 900, variant=1, dusk=True)

# Listing imagery — mix of exteriors and interiors
listing_images = {
    "prop-penthouse-1.jpg": ("interior", 0), "prop-penthouse-2.jpg": ("facade", 6),
    "prop-penthouse-3.jpg": ("interior", 3), "prop-penthouse-4.jpg": ("interior", 6),
    "prop-corner-1.jpg": ("interior", 1), "prop-corner-2.jpg": ("facade", 7),
    "prop-corner-3.jpg": ("interior", 4),
    "prop-garden-1.jpg": ("interior", 2), "prop-garden-2.jpg": ("facade", 8),
    "prop-garden-3.jpg": ("interior", 5),
    "prop-villa-1.jpg": ("facade", 2), "prop-villa-2.jpg": ("interior", 7),
    "prop-villa-3.jpg": ("facade", 5), "prop-villa-4.jpg": ("interior", 1),
    "prop-town-1.jpg": ("facade", 4), "prop-town-2.jpg": ("interior", 8),
    "prop-town-3.jpg": ("facade", 1),
    "prop-exec-1.jpg": ("interior", 4), "prop-exec-2.jpg": ("facade", 0),
    "prop-sold-1.jpg": ("facade", 3), "prop-sold-2.jpg": ("interior", 0),
    "prop-bungalow-1.jpg": ("facade", 7), "prop-bungalow-2.jpg": ("interior", 2),
    "prop-bungalow-3.jpg": ("facade", 8),
    "prop-duplex-1.jpg": ("interior", 5), "prop-duplex-2.jpg": ("facade", 6),
    "prop-duplex-3.jpg": ("interior", 8),
}
for name, (kind, v) in listing_images.items():
    if kind == "facade":
        facade_scene(name, 1400, 1000, variant=v, dusk=(v % 2 == 1))
    else:
        interior_scene(name, variant=v)

# Floor plans
plan_drawing("floorplan-1bed.jpg",
             [(0, 0, 0.55, 0.62, "LIVING / DINING"), (0.55, 0, 0.45, 0.35, "KITCHEN"),
              (0.55, 0.35, 0.45, 0.65, "BEDROOM"), (0, 0.62, 0.35, 0.38, "BATH"),
              (0.35, 0.62, 0.65, 0.38, "TERRACE")], title="ONE BEDROOM — TYPE A")
plan_drawing("floorplan-2bed.jpg",
             [(0, 0, 0.5, 0.55, "LIVING"), (0.5, 0, 0.5, 0.3, "KITCHEN"),
              (0.5, 0.3, 0.5, 0.35, "BED 2"), (0, 0.55, 0.35, 0.45, "PRINCIPAL"),
              (0.35, 0.55, 0.25, 0.45, "BATHS"), (0.6, 0.65, 0.4, 0.35, "BALCONY")],
             title="TWO BEDROOM — TYPE B")
plan_drawing("floorplan-3bed.jpg",
             [(0, 0, 0.46, 0.5, "LIVING / DINING"), (0.46, 0, 0.54, 0.28, "KITCHEN"),
              (0.46, 0.28, 0.3, 0.72, "BED 2"), (0.76, 0.28, 0.24, 0.72, "BED 3"),
              (0, 0.5, 0.32, 0.5, "PRINCIPAL SUITE"), (0.32, 0.5, 0.14, 0.5, "STUDY")],
             title="THREE BEDROOM — TYPE C")
plan_drawing("floorplan-4bed.jpg",
             [(0, 0, 0.5, 0.42, "GREAT ROOM"), (0.5, 0, 0.5, 0.24, "CHEF KITCHEN"),
              (0.5, 0.24, 0.26, 0.4, "BED 2"), (0.76, 0.24, 0.24, 0.4, "BED 3"),
              (0, 0.42, 0.34, 0.58, "PRINCIPAL WING"), (0.34, 0.42, 0.3, 0.3, "BED 4"),
              (0.34, 0.72, 0.66, 0.28, "ROOF TERRACE")], title="PENTHOUSE — DUPLEX SKETCH")
plan_drawing("floorplan-villa.jpg",
             [(0, 0, 0.42, 0.5, "LIVING COURTYARD SIDE"), (0.42, 0, 0.58, 0.3, "KITCHEN / PANTRY"),
              (0.42, 0.3, 0.28, 0.7, "GUEST STUDIO"), (0.7, 0.3, 0.3, 0.7, "POOL DECK"),
              (0, 0.5, 0.42, 0.5, "BEDWING BLOCK")], title="VILLA — GROUND FLOOR")
plan_drawing("floorplan-townhouse.jpg",
             [(0, 0, 0.4, 0.34, "COURTYARD"), (0.4, 0, 0.6, 0.34, "RECEPTION"),
              (0, 0.34, 0.6, 0.33, "KITCHEN / DINING"), (0.6, 0.34, 0.4, 0.66, "PRINCIPAL"),
              (0, 0.67, 0.6, 0.33, "GARDEN / ROOF TERRACE")], title="TOWNHOUSE — SECTION")

# Agents
portrait("agent-1.jpg", 1)
portrait("agent-2.jpg", 2, shirt=(24, 32, 46))
portrait("agent-3.jpg", 3)
portrait("agent-4.jpg", 4, shirt=(40, 44, 52))

# Neighbourhoods
for i, nb in enumerate(["westlands", "kilimani", "lavington", "karen", "runda", "downtown"]):
    neighbourhood(f"nb-{nb}.jpg", 100 + i * 9, kind=i)

print("Generated:", len(__import__("os").listdir(OUT)), "images")
