#!/usr/bin/env bash
# MP4 -> Loop-GIF unter 5MB (LinkedIn animiert GIFs nur <5MB & <400 Frames).
# Aufruf:  bash gif.sh renders/slide-2.mp4 [out.gif] [fps] [breite]
# Default: 15 fps, 720px breit. Schrumpft fps/Breite automatisch bis <5MB.
set -euo pipefail
IN="$1"; OUT="${2:-${IN%.mp4}.gif}"; FPS="${3:-15}"; W="${4:-720}"
mk(){ local fps="$1" w="$2"; local pal; pal="$(mktemp).png"
  ffmpeg -y -i "$IN" -vf "fps=$fps,scale=$w:-1:flags=lanczos,palettegen=stats_mode=diff" "$pal" 2>/dev/null
  ffmpeg -y -i "$IN" -i "$pal" -lavfi "fps=$fps,scale=$w:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" "$OUT" 2>/dev/null
  rm -f "$pal"; }
mk "$FPS" "$W"
for try in 1 2 3 4; do
  sz=$(stat -f%z "$OUT" 2>/dev/null || stat -c%s "$OUT"); mb=$((sz/1048576))
  [ "$sz" -lt 5242880 ] && { echo "OK $OUT ($((sz/1024)) KB, ${FPS}fps, ${W}px)"; exit 0; }
  # zu gross -> erst fps runter, dann Breite
  if [ "$FPS" -gt 12 ]; then FPS=12; elif [ "$W" -gt 560 ]; then W=560; FPS=12; else W=480; FPS=10; fi
  echo "noch $((sz/1024)) KB -> retry ${FPS}fps ${W}px"; mk "$FPS" "$W"
done
echo "WARN: $OUT noch $(( $(stat -f%z "$OUT" 2>/dev/null || stat -c%s "$OUT")/1024 )) KB - evtl. Slide kuerzen."
