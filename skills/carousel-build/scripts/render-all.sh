#!/usr/bin/env bash
# Rendert alle slide-*.html eines Carousel-Projekts zu MP4, zieht Settle-Frames + statische JPGs.
# Aufruf:  bash render-all.sh [projekt-dir]   (default: aktuelles Verzeichnis)
# Voraussetzung: HyperFrames-Projekt mit slide-1.html ... slide-N.html
set -euo pipefail
DIR="${1:-.}"; cd "$DIR"
mkdir -p renders export-static frames
HF="npx --yes hyperframes@0.6.98"
shopt -s nullglob
slides=(slide-*.html)
[ ${#slides[@]} -eq 0 ] && { echo "Keine slide-*.html in $DIR"; exit 1; }
# nach Nummer sortieren
IFS=$'\n' slides=($(printf '%s\n' "${slides[@]}" | sort -t- -k2 -n)); unset IFS
for f in "${slides[@]}"; do
  n="${f#slide-}"; n="${n%.html}"
  echo ">> render $f"
  $HF render -c "$f" -o "renders/slide-$n.mp4" --quality high --quiet 2>&1 | tail -1 || true
  # Settle-Frame (0.35s vor Ende) fuer Kontrolle, + voller statischer Export (letzter Frame)
  ffmpeg -y -sseof -0.35 -i "renders/slide-$n.mp4" -frames:v 1 "frames/s$n.png" 2>/dev/null || true
  ffmpeg -y -sseof -0.05 -i "renders/slide-$n.mp4" -frames:v 1 -q:v 2 "export-static/slide-$n.jpg" 2>/dev/null || true
done
echo "Fertig. MP4s in renders/, statische JPGs in export-static/, Settle-Frames in frames/."
