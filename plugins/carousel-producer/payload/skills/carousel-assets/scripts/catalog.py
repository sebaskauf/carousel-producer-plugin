#!/usr/bin/env python3
"""Katalog-Verwaltung fuer die Carousel-Asset-Bibliothek.
catalog.json ist die Quelle der Wahrheit; LIBRARY.md wird daraus regeneriert (immer konsistent).

  python3 catalog.py list [theme]
  python3 catalog.py add --id ID --file characters/x.png --type character \
      --theme council --tags "skeptiker,glasses" --desc "Skeptiker mit Brille" \
      --prompt "..." [--created 2026-06-15]
"""
import sys, os, json, argparse, datetime

LIB = os.path.expanduser("~/.skaile/carousel-library")
CAT = os.path.join(LIB, "catalog.json")
MD = os.path.join(LIB, "LIBRARY.md")

def load():
    if os.path.exists(CAT):
        with open(CAT) as f: return json.load(f)
    return []

def save(entries):
    entries.sort(key=lambda e: (e.get("type",""), e.get("theme",""), e.get("id","")))
    with open(CAT, "w") as f: json.dump(entries, f, indent=2, ensure_ascii=False)
    render_md(entries)

def render_md(entries):
    by = {}
    for e in entries:
        by.setdefault(e.get("type","misc"), {}).setdefault(e.get("theme","_"), []).append(e)
    lines = ["# Carousel Asset-Bibliothek — Index",
             "",
             "Menschlicher Index, automatisch aus catalog.json regeneriert. Pro Piece eine Zeile.",
             "Wiederverwenden bevorzugen; nur bei echter Luecke neu generieren (siehe carousel-assets Skill).",
             ""]
    for typ in sorted(by):
        lines.append(f"## {typ}")
        for theme in sorted(by[typ]):
            lines.append(f"### {theme}")
            for e in sorted(by[typ][theme], key=lambda x: x["id"]):
                tags = ", ".join(e.get("tags", [])) if isinstance(e.get("tags"), list) else (e.get("tags") or "")
                lines.append(f"- `{e['file']}` — {e.get('description','')}" + (f"  _(tags: {tags})_" if tags else ""))
            lines.append("")
    with open(MD, "w") as f: f.write("\n".join(lines))

def cmd_list(args):
    entries = load()
    if args.theme:
        entries = [e for e in entries if e.get("theme") == args.theme or args.theme in (e.get("tags") or [])]
    if not entries:
        print("(Bibliothek leer)" if not args.theme else f"(nichts unter theme/tag '{args.theme}')"); return
    for e in entries:
        print(f"[{e.get('type')}/{e.get('theme')}] {e['id']:32} {e['file']:34} {e.get('description','')}")

def cmd_add(args):
    entries = load()
    entries = [e for e in entries if e["id"] != args.id]  # upsert
    tags = [t.strip() for t in args.tags.split(",")] if args.tags else []
    entries.append({
        "id": args.id, "file": args.file, "type": args.type, "theme": args.theme,
        "tags": tags, "description": args.desc, "prompt": args.prompt or "",
        "created": args.created or datetime.date.today().isoformat(),
    })
    save(entries)
    print(f"+ {args.id} aufgenommen. catalog.json + LIBRARY.md aktualisiert ({len(entries)} Pieces).")

p = argparse.ArgumentParser()
sub = p.add_subparsers(dest="cmd", required=True)
pl = sub.add_parser("list"); pl.add_argument("theme", nargs="?"); pl.set_defaults(fn=cmd_list)
pa = sub.add_parser("add")
for a in ["id","file","type","theme","desc"]: pa.add_argument(f"--{a}", required=True)
for a in ["tags","prompt","created"]: pa.add_argument(f"--{a}", default="")
pa.set_defaults(fn=cmd_add)
if __name__ == "__main__":
    os.makedirs(LIB, exist_ok=True)
    args = p.parse_args(); args.fn(args)
