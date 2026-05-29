"""
Generate the After Dark Android launcher icon set.

Designs a 1024x1024 master logo (flame in After Dark gradient on a dark
glow background), then writes all Android mipmap sizes:

  mipmap-mdpi/ic_launcher{,_round,_foreground}.png         48x48
  mipmap-hdpi/ic_launcher{,_round,_foreground}.png         72x72
  mipmap-xhdpi/ic_launcher{,_round,_foreground}.png        96x96
  mipmap-xxhdpi/ic_launcher{,_round,_foreground}.png       144x144
  mipmap-xxxhdpi/ic_launcher{,_round,_foreground}.png      192x192

Also writes resources/icon-1024.png and resources/icon-512.png for
Play Store / iOS / future use.
"""

import math
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES  = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'res')
OUT  = os.path.join(ROOT, 'resources')
os.makedirs(OUT, exist_ok=True)


# ─── Master 1024 design ────────────────────────────────────────────
def make_master(size: int = 1024) -> Image.Image:
    W = H = size
    img = Image.new('RGB', (W, H), (10, 10, 20))   # #0a0a14

    # Radial glow — purple/crimson aura behind the flame
    glow = Image.new('RGB', (W, H), (10, 10, 20))
    gd = ImageDraw.Draw(glow)
    cx, cy = W / 2, H / 2 + H * 0.06
    max_r = int(W * 0.55)
    # Concentric ellipses, light at center → fading out
    for r in range(max_r, 0, -4):
        t = r / max_r
        # Brighter color at center
        r_col = int(80  * (1 - t) + 10)
        g_col = int(20  * (1 - t) + 10)
        b_col = int(70  * (1 - t) + 20)
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(r_col, g_col, b_col))
    glow = glow.filter(ImageFilter.GaussianBlur(int(W * 0.04)))
    img = Image.blend(img, glow, 0.7)

    # ─── Flame outline (teardrop) ─────────────────────────────────
    # Generated as a parametric curve, then mirrored.
    flame_pts = []
    cy_flame = H * 0.50
    top_y    = H * 0.16
    bot_y    = H * 0.84
    half_h   = (bot_y - top_y) / 2
    max_half_w = W * 0.27

    n = 90
    # Right side, top → bottom
    for i in range(n + 1):
        t = i / n
        y = top_y + (bot_y - top_y) * t
        if t < 0.50:
            # Top half — narrow tip widening through the middle
            local = t / 0.50
            w = math.sin(local * math.pi / 2) * max_half_w
            # add a tiny wave for organic feel
            w *= 1.0 + 0.04 * math.sin(local * math.pi * 2)
        else:
            # Bottom half — taper back, but base is fuller (heart-like)
            local = (t - 0.50) / 0.50
            w = math.cos(local * math.pi / 2) * max_half_w * 0.92
            # widen back slightly near the base for a heart-like flare
            w += math.sin(local * math.pi) * max_half_w * 0.08
        flame_pts.append((cx + w, y))
    # Left side, bottom → top (mirror)
    for i in range(n, -1, -1):
        t = i / n
        y = top_y + (bot_y - top_y) * t
        if t < 0.50:
            local = t / 0.50
            w = math.sin(local * math.pi / 2) * max_half_w
            w *= 1.0 + 0.04 * math.sin(local * math.pi * 2)
        else:
            local = (t - 0.50) / 0.50
            w = math.cos(local * math.pi / 2) * max_half_w * 0.92
            w += math.sin(local * math.pi) * max_half_w * 0.08
        flame_pts.append((cx - w, y))

    # ─── Vertical brand gradient inside the flame ────────────────
    gradient = Image.new('RGB', (W, H), (10, 10, 20))
    gd = ImageDraw.Draw(gradient)
    # Brand stops (oklch approximations):
    #  top    — gold/ember   (255, 200, 100)
    #  upper  — ember/crimson (255, 90,  80)
    #  middle — blush pink   (240, 130, 180)
    #  bottom — violet       (140, 90,  200)
    def lerp(c1, c2, t):
        return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))
    stops = [
        (0.00, (255, 210, 120)),  # gold tip
        (0.22, (255, 110,  80)),  # ember
        (0.55, (245, 120, 175)),  # blush
        (1.00, (160, 100, 210)),  # violet base
    ]
    for y in range(H):
        t = y / H
        for i in range(len(stops) - 1):
            s0, s1 = stops[i], stops[i + 1]
            if s0[0] <= t <= s1[0]:
                local = (t - s0[0]) / (s1[0] - s0[0])
                color = lerp(s0[1], s1[1], local)
                break
        else:
            color = stops[-1][1]
        gd.line([(0, y), (W, y)], fill=color)

    # Mask flame, composite gradient
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).polygon(flame_pts, fill=255)
    img.paste(gradient, mask=mask)

    # Outer glow halo around the flame
    glow_mask = mask.filter(ImageFilter.GaussianBlur(int(W * 0.045)))
    halo = Image.new('RGBA', (W, H), (255, 130, 180, 150))
    img_rgba = img.convert('RGBA')
    img_rgba.paste(halo, mask=glow_mask)
    img = img_rgba.convert('RGB')

    # Tiny highlight on the flame tip
    hl_size = int(W * 0.08)
    hl = Image.new('RGBA', (hl_size * 2, hl_size * 2), (0, 0, 0, 0))
    ImageDraw.Draw(hl).ellipse(
        [0, 0, hl_size * 2, hl_size * 2],
        fill=(255, 240, 200, 180),
    )
    hl = hl.filter(ImageFilter.GaussianBlur(hl_size * 0.4))
    img.paste(hl, (int(cx - hl_size), int(top_y - hl_size * 0.4)), hl)

    return img


# ─── Round mask (for ic_launcher_round) ────────────────────────────
def apply_round_mask(img: Image.Image) -> Image.Image:
    W, H = img.size
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, W, H], fill=255)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rgba = img.convert('RGBA')
    out.paste(rgba, mask=mask)
    return out


# ─── Foreground (transparent bg, just the flame) for adaptive icons ─
def make_foreground(master: Image.Image) -> Image.Image:
    """
    Adaptive icon foreground: transparent background, flame centered in
    the inner 66% safe area (Android crops the outer ~33% under masks).
    """
    W, H = master.size
    bg = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # Composite the flame onto transparent — easiest: extract by removing
    # the dark background via a flame mask (regenerate the polygon).
    # Simpler approach: just paste the master scaled down by 0.66 onto a
    # transparent canvas.
    inner_size = int(min(W, H) * 0.66)
    inner = master.resize((inner_size, inner_size), Image.LANCZOS).convert('RGBA')
    # Replace dark pixels (close to bg) with transparent for cleaner edges
    pixels = inner.load()
    for y in range(inner_size):
        for x in range(inner_size):
            r, g, b, _ = pixels[x, y]
            dark = max(0, 60 - (r + g + b) // 3)
            alpha = 255 - min(255, dark * 4)
            pixels[x, y] = (r, g, b, alpha)
    bg.paste(inner, ((W - inner_size) // 2, (H - inner_size) // 2), inner)
    return bg


# ─── Drive the export ───────────────────────────────────────────────
def main():
    print('▶ Designing master 1024x1024 logo…')
    master = make_master(1024)

    master.save(os.path.join(OUT, 'icon-1024.png'))
    master.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, 'icon-512.png'))
    print(f'  • {OUT}/icon-1024.png')
    print(f'  • {OUT}/icon-512.png')

    sizes = {
        'mipmap-mdpi':    48,
        'mipmap-hdpi':    72,
        'mipmap-xhdpi':   96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi':192,
    }

    print('▶ Writing Android mipmap icons…')
    for folder, sz in sizes.items():
        dst = os.path.join(RES, folder)
        os.makedirs(dst, exist_ok=True)
        sq = master.resize((sz, sz), Image.LANCZOS)
        sq.save(os.path.join(dst, 'ic_launcher.png'))
        apply_round_mask(sq).save(os.path.join(dst, 'ic_launcher_round.png'))
        fg_size = int(sz * 1.5)   # adaptive icon foreground is ~1.5x display size
        fg_master = master.resize((fg_size, fg_size), Image.LANCZOS)
        make_foreground(fg_master).save(os.path.join(dst, 'ic_launcher_foreground.png'))
        print(f'  • {folder}/  ({sz}x{sz})')

    print('✓ Logo set ready.')


if __name__ == '__main__':
    sys.exit(main())
