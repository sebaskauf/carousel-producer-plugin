# Motiv-Bibliothek — wiederverwendbare Carousel-Bausteine

Copy-Paste-Bausteine fuer die Slides. Alle deterministisch (kein Random/Date), Marks zeichnen sich
per `stroke-dashoffset` ein. Farben aus der Stil-DNA. Diese Bausteine sind das, was den Look
ausmacht — bewusst und sparsam einsetzen.

Inhalt: 1) Hand-Kringel · 2) Unterstrich · 3) Highlighter · 4) Cursor-Klick · 5) Terminal-Fenster
· 6) Typewriter-Prompt-Fenster · 7) Charakter-Lineup · 8) Clash/VS-Face-off · 9) Signatur-Scrawl
· 10) Blind-Spot-Marker.

---

## 1. Hand-Kringel um ein Wort
Markiert EIN Schluesselwort. Wort in `.circled` wrappen, SVG zieht sich ein.
```html
<span class="circled"><span class="accent">einer</span>
  <svg viewBox="0 0 120 70" preserveAspectRatio="none"><path id="circ" d="M104,20 C96,7 30,2 16,16 C2,30 6,54 28,62 C58,72 110,64 112,40 C113,28 104,18 92,12" stroke="#C2410C" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg></span>
```
```css
.circled{position:relative;display:inline-block}
.circled svg{position:absolute;left:-22px;top:-14px;width:calc(100% + 44px);height:calc(100% + 30px);overflow:visible}
```
```js
const c=document.getElementById("circ"),L=c.getTotalLength();
c.style.strokeDasharray=L;c.style.strokeDashoffset=L;
tl.to(c,{strokeDashoffset:0,duration:0.7,ease:"power2.inOut"},0.75);
```
Tipp: Kringel auf gleichfarbigem Grund (orange auf orange) wird unsichtbar -> Kontrastfarbe nehmen (z.B. cream `#F6E9D6` ueber orangem Wort).

## 2. Hand-Unterstrich
```html
<span class="mark">blinden Flecken<svg viewBox="0 0 300 26" preserveAspectRatio="none"><path id="ul" d="M4,16 Q80,7 150,13 T296,9" stroke="#C2410C" stroke-width="6" fill="none" stroke-linecap="round"/></svg></span>
```
```css
.mark{position:relative;display:inline-block}
.mark svg{position:absolute;left:-8px;bottom:-16px;width:calc(100% + 16px);height:26px;overflow:visible}
```
```js
const u=document.getElementById("ul"),L=u.getTotalLength();u.style.strokeDasharray=L;u.style.strokeDashoffset=L;
tl.to(u,{strokeDashoffset:0,duration:0.55,ease:"power2.inOut"},1.95);
```

## 3. Highlighter-Swipe (hinter einem Wort)
```css
.hl{position:absolute;left:-10px;right:-14px;top:34%;height:.52em;background:rgba(255,138,76,.42);transform:rotate(-2.2deg);border-radius:6px;z-index:0}
.w-streiten{position:relative;display:inline-block}
.w-streiten .txt{position:relative;z-index:1}
```
```html
<span class="w-streiten"><span class="hl"></span><span class="txt">streiten.</span></span>
```

## 4. Cursor-Klick (VERBESSERT: weich rein, klarer Klick)
Klickt etwas Konkretes (z.B. einen `/command`). Tip des Pfeils liegt oben-links.
```html
<div class="click-ring" id="ring"></div>
<svg class="cursor" id="cursor" viewBox="0 0 24 26"><path d="M2,1 L2,20 L7,15 L11,23 L14,22 L10,14 L17,14 Z" fill="#fff" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"/></svg>
```
```css
.cursor{position:absolute;left:150px;top:150px;width:42px;height:46px;z-index:5;filter:drop-shadow(0 4px 6px rgba(0,0,0,.25))}
.click-ring{position:absolute;left:96px;top:142px;width:60px;height:60px;border-radius:50%;border:4px solid #C2410C;opacity:0}
```
```js
tl.from("#cursor",{opacity:0,x:130,y:96,duration:0.6,ease:"power2.out"},1.15);   // weich reinfahren
tl.to("#cursor",{y:"+=9",duration:0.12,yoyo:true,repeat:1,ease:"power2.in"},1.85); // Klick-Dip
tl.fromTo("#ring",{opacity:.85,scale:.4},{opacity:0,scale:1.25,duration:0.5,ease:"power2.out"},1.9); // Klick-Ring
```
Verbesserung ggue. Prototyp: langsamer, weicher Anflug + sichtbarer Ring statt nur Wackeln.
Positionen an das Ziel-Element anpassen und im Render-Frame gegenpruefen.

## 5. Terminal-Fenster (VERBESSERT: echter Ablauf, saubere Mono-Spalten)
Dunkles Terminal mit Prompt -> System-Zeile -> Rollen/Output -> Verdikt. Mono ausrichten ueber
feste Tag-Breite (`display:inline-block;width:Xch`), damit nichts zappelt.
```html
<div class="term" id="term">
  <div class="tbar"><span class="d r"></span><span class="d y"></span><span class="d g"></span><span class="tt">claude — council</span></div>
  <div class="tbody">
    <div class="ln"><span class="pr">›</span> <span class="cmd">/council</span> <span id="typed"></span><span class="cur" id="cur"></span></div>
    <div class="ln sys" id="sys">↻ Council tagt · 4 Rollen, unabhaengig</div>
    <div class="ln role" id="r0"><span class="tag">Pragmatiker</span><span class="rt">Launch jetzt. Feedback &gt; Politur.</span></div>
    <div class="ln role" id="r1"><span class="tag">Skeptiker</span><span class="rt">Buggy Launch verbrennt Vertrauen.</span></div>
    <div class="ln verdict" id="vd">⟶ jetzt launchen, aber nur den Kern.</div>
  </div>
</div>
```
```css
.term{background:#181410;border-radius:20px;box-shadow:0 34px 70px rgba(60,40,20,.3);overflow:hidden}
.tbar{height:54px;background:#241d16;display:flex;align-items:center;gap:11px;padding:0 22px}
.d{width:15px;height:15px;border-radius:50%}.r{background:#FF5F57}.y{background:#FEBC2E}.g{background:#28C840}
.tt{margin-left:14px;font-family:"JetBrains Mono",monospace;font-size:18px;color:#8a7d6a}
.tbody{padding:38px 40px;font-family:"JetBrains Mono",monospace;font-size:25px;line-height:1.75;color:#cdc4b4}
.pr{color:#7fb88a}.cmd{color:#e6c07a;font-weight:700}.sys{color:#8a7d6a;margin:8px 0}
.role .tag{display:inline-block;width:12ch;color:#e0723a;font-weight:700}.role .rt{color:#d8cfbe}
.verdict{margin-top:18px;color:#ffd27a;font-weight:700}
.cur{display:inline-block;width:13px;height:26px;background:#e6c07a;vertical-align:-4px;margin-left:4px}
```
```js
const typed=document.getElementById("typed"),full="launchen oder warten?",tw={n:0};
tl.from("#term",{opacity:0,y:30,scale:.985,duration:0.5,ease:"power3.out"},0.15);
tl.to(tw,{n:full.length,duration:0.9,ease:"none",onUpdate:()=>typed.textContent=full.slice(0,Math.round(tw.n))},0.55);
tl.to("#cur",{opacity:.12,duration:0.16,repeat:30,yoyo:true,ease:"none"},0.55);
tl.from("#sys",{opacity:0,duration:0.4},1.6);
tl.from("#r0",{opacity:0,x:-22,duration:0.4,ease:"power2.out"},2.0);
tl.from("#r1",{opacity:0,x:-22,duration:0.4,ease:"power2.out"},2.35);
tl.from("#vd",{opacity:0,y:10,duration:0.5,ease:"back.out(1.4)"},3.1);
```
Verbesserung: feste `width:12ch` auf `.tag` richtet die Rollen-Spalte sauber aus; klare Farbhierarchie (Prompt gruen, Command gold, System grau, Verdikt hell). Fuer Light-Variante: window `#FFFFFF`, bar `#ECE7DD`, Titel-Text `#6E6857`.

## 6. Typewriter-Prompt-Fenster (helles Mac-Fenster)
Wie Terminal, aber hell, fuer "der User tippt eine Frage". Gleicher `tw`-Typewriter wie oben.
Fenster `#FFFFFF`, bar `#ECE7DD`, prompt-Text `#3A352B`, command-Chip accent auf `rgba(194,65,12,.10)`.

## 7. Charakter-Lineup (Reihen, fuellt die Mitte)
Mehrere Charaktere mittig, NICHT ans untere Ende kleben. Bei vielen: 2 Reihen (z.B. 4+3), groesser.
```html
<div class="mid"><div class="grp r1"><img src="assets/cut/role-1.png"/>...</div>
  <div class="grp r2"><img src="assets/cut/role-5.png"/>...</div></div>
```
```css
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:16px}
.grp{display:flex;justify-content:center;align-items:flex-end;gap:18px}
.grp img{width:178px;height:178px;object-fit:contain;filter:drop-shadow(0 22px 26px rgba(120,70,40,.20))}
.grp.r2 img{width:168px;height:168px}
```
```js
tl.from(".grp.r1 img",{opacity:0,y:44,scale:.6,duration:.55,ease:"back.out(1.7)",stagger:{each:.08,from:"center"}},0.9);
tl.from(".grp.r2 img",{opacity:0,y:44,scale:.6,duration:.55,ease:"back.out(1.7)",stagger:{each:.08,from:"center"}},1.15);
tl.to(".grp img",{y:-12,duration:1.4,ease:"sine.inOut",yoyo:true,repeat:1,stagger:{each:.05,from:"center"}},2.2);
```

## 8. Clash / VS-Face-off (VERBESSERT: kein Ueberlauf, klarer Kampf)
Zwei Lager prallen aufeinander, Burst + kurzer Shake. KURZE Quotes + `max-width` auf Blasen, sonst
laeuft Text aus der Spalte (war der Haupt-Bug).
```css
.ring{flex:1;display:grid;grid-template-columns:1fr 168px 1fr;align-items:center}
.side{display:flex;flex-direction:column;gap:80px}
.side.left .card{display:flex;align-items:center;gap:14px;justify-content:flex-end}
.side.right .card{display:flex;align-items:center;gap:14px;justify-content:flex-start}
.tama{width:104px;height:104px;object-fit:contain;flex-shrink:0}
.side.left .tama{transform:rotate(8deg)}.side.right .tama{transform:rotate(-8deg)}
.bub{background:#fff;border-radius:22px;padding:16px 22px;box-shadow:0 18px 38px rgba(120,80,40,.14);max-width:224px}
.bub .q{font-size:32px;font-weight:700;color:#1A1A1A;line-height:1.04}
.vs{font-family:Georgia,serif;font-weight:700;font-size:72px;color:#C2410C;text-shadow:0 3px 0 #fff}
```
Markup: links `[bub][tama]`, rechts `[tama][bub]` (tama jeweils zur Mitte). Zentrale `.clash` mit
Burst-SVG (8 Strahlen) + `.vs`.
```js
tl.from("#cL1",{opacity:0,x:-90,duration:.45,ease:"back.out(1.5)"},0.6);
tl.from("#cR1",{opacity:0,x: 90,duration:.45,ease:"back.out(1.5)"},0.6);
document.querySelectorAll("#rays line").forEach(r=>{const L=r.getTotalLength();r.style.strokeDasharray=L;r.style.strokeDashoffset=L;});
tl.to("#rays line",{strokeDashoffset:0,duration:.3,ease:"power2.out",stagger:.02},1.0);
tl.from("#vs",{opacity:0,scale:.2,rotation:-18,duration:.4,ease:"back.out(2.2)"},1.0);
tl.to("#ring",{x:-10,duration:.05,repeat:5,yoyo:true,ease:"none"},1.05);tl.set("#ring",{x:0},1.45); // Shake
tl.to("#cL1 .bub",{rotation:-2.5,duration:.3,yoyo:true,repeat:5,ease:"sine.inOut",transformOrigin:"100% 50%"},2.2);
```
Verbesserung: `max-width` + Quotes auf 2-3 Woerter (Launch jetzt. / Wart noch. / Eindruck zaehlt. / Ein Zehntel.).

## 9. Signatur-Scrawl (persoenlicher Sign-off, z.B. auf CTA)
```html
<svg viewBox="0 0 360 116"><path id="sig" d="M12,82 C22,42 52,40 54,68 C55,86 42,88 46,72 C52,48 80,42 88,74 C92,90 78,98 80,76 C84,52 112,54 118,78 C122,94 140,66 152,62 C142,88 170,94 178,68 C184,86 198,60 212,66 C202,82 228,88 238,64 C246,80 264,62 278,68 C302,78 322,72 350,54" stroke="#1A1A1A" stroke-width="5" fill="none" stroke-linecap="round"/></svg>
```
```js
const s=document.getElementById("sig"),L=s.getTotalLength();s.style.strokeDasharray=L;s.style.strokeDashoffset=L;
tl.to(s,{strokeDashoffset:0,duration:0.9,ease:"power1.inOut"},0.95);
```

## 10. Blind-Spot-Marker (fuellt Leerraum, "was die KI uebersieht")
Gestrichelte Kreise mit `?` um EINEN grossen Charakter -> macht "eine Meinung + blinde Flecken" visuell.
```css
.blind{position:absolute;display:flex;align-items:center;justify-content:center;width:116px;height:116px;border-radius:50%;border:3px dashed #C7BBA6;color:#B0A48E;font-family:Georgia,serif;font-size:64px;background:rgba(255,255,255,.35)}
```
```js
tl.from([".b1",".b2",".b3",".b4"],{opacity:0,scale:.4,duration:.5,ease:"back.out(1.6)",stagger:.12},1.25);
```
