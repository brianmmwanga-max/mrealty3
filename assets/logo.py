"""Render the M Realty logo (geometric 'M' of skyscraper shapes) to PNG + SVG.

Outputs:
  assets/img/logo.png        transparent, navy+gold mark + wordmark (3x scale)
  assets/img/logo-light.png  white wordmark variant for navy footer
  assets/img/favicon.png     square app-icon version
Run from repo root:  python3 assets/logo.py
"""
from PIL import Image, ImageDraw

S = 3  # supersample factor for crisp edges
NAVY = (10, 28, 58, 255)
GOLD = (197, 160, 89, 255)
WHITE = (255, 255, 255, 255)


def draw_mark(d, x0, y_base, unit=S):
    """Geometric M built from three tower silhouettes with a gold crown."""
    u = unit
    # Left tower (leans right -> forms left leg of M)
    d.polygon([(x0, y_base), (x0 + 6 * u, y_base),
               (x0 + 14 * u, y_base - 34 * u), (x0 + 8 * u, y_base - 34 * u)], fill=NAVY)
    # Right tower (mirror)
    r0 = x0 + 40 * u
    d.polygon([(r0 - 6 * u, y_base), (r0, y_base),
               (r0 - 8 * u, y_base - 34 * u), (r0 - 14 * u, y_base - 34 * u)], fill=NAVY)
    # Centre spire (shorter, gold-crowned apex completing the M)
    c = x0 + 20 * u
    d.polygon([(c - 5 * u, y_base), (c + 5 * u, y_base),
               (c + 5 * u, y_base - 22 * u), (c, y_base - 30 * u),
               (c - 5 * u, y_base - 22 * u)], fill=NAVY)
    # Gold apex cap on centre spire
    d.polygon([(c - 5 * u, y_base - 22 * u), (c, y_base - 30 * u),
               (c + 5 * u, y_base - 22 * u), (c, y_base - 25.4 * u)], fill=GOLD)
    # Gold podium band tying the towers together
    d.rectangle([x0, y_base - 3 * u, r0, y_base], fill=GOLD)
    # Window slits (knock-out in white handled by transparency: draw nothing,
    # instead add thin light seams using background-blended navy tint)
    seam = (30, 52, 90, 255)
    for tx in (x0 + 3 * u, x0 + 26 * u, x0 + 37 * u):
        pass
    d.rectangle([x0 + 2.4 * u, y_base - 26 * u, x0 + 3.6 * u, y_base - 6 * u], fill=seam)
    d.rectangle([r0 - 3.6 * u, y_base - 26 * u, r0 - 2.4 * u, y_base - 6 * u], fill=seam)
    d.rectangle([c - 0.6 * u, y_base - 20 * u, c + 0.6 * u, y_base - 6 * u], fill=seam)


def wordmark(img, dark=True):
    """Draw 'M REALTY' letters as simple geometric bars (font-independent)."""
    d = ImageDraw.Draw(img)
    color = NAVY if dark else WHITE
    w, h = img.size
    x = 52 * S          # start after the mark
    cy = h // 2
    bh = 11 * S         # cap height
    t = 2.4 * S         # stroke thickness
    gap = 9 * S

    def rect(a, b, c, e, col=color):
        d.rectangle([a, b, c, e], fill=col)

    # ---- M ----
    rect(x, cy - bh / 2, x + t, cy + bh / 2)
    rect(x + gap - t, cy - bh / 2, x + gap, cy + bh / 2)
    d.polygon([(x, cy - bh / 2), (x + t * 1.1, cy - bh / 2),
               (x + gap / 2, cy + bh / 5), (x + gap / 2 - t, cy + bh / 5)], fill=color)
    d.polygon([(x + gap, cy - bh / 2), (x + gap - t * 1.1, cy - bh / 2),
               (x + gap / 2, cy + bh / 5), (x + gap / 2 + t, cy + bh / 5)], fill=color)
    x += gap + 5 * S

    # ---- E ----
    rect(x, cy - bh / 2, x + t, cy + bh / 2)
    rect(x, cy - bh / 2, x + 6 * S, cy - bh / 2 + t)
    rect(x, cy - t / 2, x + 5 * S, cy + t / 2)
    rect(x, cy + bh / 2 - t, x + 6 * S, cy + bh / 2)
    x += gap

    # ---- space ----
    x += 3 * S

    # ---- R ----
    rect(x, cy - bh / 2, x + t, cy + bh / 2)
    d.arc([x, cy - bh / 2, x + 6 * S, cy - bh / 2 + 5 * S], 270, 90, fill=color, width=int(t))
    rect(x + 4 * S, cy - bh / 2 + t / 2, x + 6 * S + t, cy - bh / 2 + 5 * S)
    d.polygon([(x + 3 * S, cy), (x + 3 * S + t, cy), (x + 6 * S, cy + bh / 2),
               (x + 6 * S - t, cy + bh / 2)], fill=color)
    x += gap

    # ---- A ----
    d.polygon([(x, cy + bh / 2), (x + t, cy + bh / 2), (x + 3.5 * S + t / 2, cy - bh / 2),
               (x + 3.5 * S - t / 2, cy - bh / 2)], fill=color)
    d.polygon([(x + 7 * S, cy + bh / 2), (x + 7 * S - t, cy + bh / 2),
               (x + 3.5 * S, cy - bh / 2), (x + 3.5 * S + t, cy - bh / 2)], fill=color)
    rect(x + 1.6 * S, cy + t / 2, x + 5.4 * S, cy + 1.6 * S)
    x += gap + 4 * S

    # ---- L ----
    rect(x, cy - bh / 2, x + t, cy + bh / 2)
    rect(x, cy + bh / 2 - t, x + 6 * S, cy + bh / 2)
    x += gap

    # ---- T ----
    rect(x, cy - bh / 2, x + 6 * S, cy - bh / 2 + t)
    rect(x + 3 * S - t / 2, cy - bh / 2, x + 3 * S + t / 2, cy + bh / 2)
    x += gap

    # ---- Y ----
    d.polygon([(x, cy - bh / 2), (x + t, cy - bh / 2), (x + 3.5 * S + t / 2, cy),
               (x + 3.5 * S - t / 2, cy)], fill=color)
    d.polygon([(x + 7 * S, cy - bh / 2), (x + 7 * S - t, cy - bh / 2),
               (x + 3.5 * S, cy), (x + 3.5 * S + t, cy)], fill=color)
    rect(x + 3 * S - t / 2, cy, x + 3 * S + t / 2, cy + bh / 2)
    return img


def make_logo(path, dark_word=True, width_px=620):
    H = 150 * S
    W = width_px * S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_mark(d, 6 * S, H - 14 * S)
    img = img.resize((W // S, H // S), Image.LANCZOS)
    img = wordmark(img, dark=dark_word)
    img.save(path)
    print("wrote", path)


def make_favicon(path, size=512):
    img = Image.new("RGBA", (size, size), NAVY)
    d = ImageDraw.Draw(img)
    u = size / 64
    cx = size / 2
    base = size * 0.78
    top = size * 0.20
    # simplified M towers
    d.polygon([(cx - 22 * u, base), (cx - 15 * u, base), (cx - 4 * u, top + 8 * u), (cx - 11 * u, top + 8 * u)], fill=(20, 44, 84, 255))
    d.polygon([(cx + 15 * u, base), (cx + 22 * u, base), (cx + 11 * u, top + 8 * u), (cx + 4 * u, top + 8 * u)], fill=(20, 44, 84, 255))
    d.polygon([(cx - 6 * u, base), (cx + 6 * u, base), (cx + 6 * u, top + 16 * u), (cx, top), (cx - 6 * u, top + 16 * u)], fill=GOLD)
    d.rectangle([cx - 22 * u, base - 3 * u, cx + 22 * u, base], fill=GOLD)
    img.save(path)
    print("wrote", path)


if __name__ == "__main__":
    make_logo("assets/img/logo.png", dark_word=True)
    make_logo("assets/img/logo-light.png", dark_word=False)
    make_favicon("assets/img/favicon.png")
