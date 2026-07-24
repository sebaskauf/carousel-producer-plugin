#!/usr/bin/env python3
"""Baut einen Kontaktbogen aus den Settle-Frames (frames/s*.png) zum Drueberschauen.
Aufruf:  python3 contact-sheet.py [projekt-dir] [out.jpg]   (default: . und /tmp/carousel-contact.jpg)
"""
import sys, os, glob, re
from PIL import Image

d = sys.argv[1] if len(sys.argv) > 1 else "."
out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/carousel-contact.jpg"
files = glob.glob(os.path.join(d, "frames", "s*.png"))
files.sort(key=lambda p: int(re.search(r"s(\d+)\.png$", p).group(1)))
if not files:
    print("Keine frames/s*.png gefunden, erst render-all.sh laufen lassen."); sys.exit(1)
tw = 360
ims = [Image.open(p).convert("RGB") for p in files]
ims = [im.resize((tw, int(im.height * tw / im.width))) for im in ims]
ch = max(im.height for im in ims); pad = 8
cols = min(4, len(ims)); rows = (len(ims) + cols - 1) // cols
W = cols * tw + (cols + 1) * pad; H = rows * ch + (rows + 1) * pad
canvas = Image.new("RGB", (W, H), (24, 20, 16))
for i, im in enumerate(ims):
    r, c = divmod(i, cols)
    canvas.paste(im, (pad + c * (tw + pad), pad + r * (ch + pad)))
canvas.save(out, quality=92)
print("Kontaktbogen:", out, canvas.size)
