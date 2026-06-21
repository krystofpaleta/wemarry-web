# Handoff — animované vizuály ve sticky-scroll sekci (ScrollFeatures)

> **Stav:** hotovo v tomto repu (`wemarry-astro`). Není potřeba nic přenášet z jiného projektu.
> Tento dokument popisuje **proč a jak** je to udělané, aby Claude (nebo člověk) mohl snadno
> doladit timing, přidat 7. krok, nebo stejný pattern zopakovat jinde.

---

## Co to řeší (produktově)

Homepage má Apple-style sticky scroll: 6 kroků produktu, vlevo text, vpravo mock appky.
Dřív statické placeholdery → teď **micro-animace**, které ukážou, co zákazník dostane
(odškrtávání checklistu, donut rozpočtu, RSVP odpovědi, drag hosta ke stolu…).

**Cíl animací:** ne „wow efekt", ale **srozumitelný náhled produktu** během ~2–3 s po scrollu na krok.

---

## Proč tento stack (a kolik práce ušetří)

| Varianta | Odhad práce | Bundle | Údržba | Verdikt |
|----------|-------------|--------|--------|---------|
| **CSS + React state (aktuální)** | ~1 den na 6 vizuálů | +0 deps, island ~24 KB gzip | Text/barvy v TSX, timing v ms | ✅ zvoleno |
| Lottie / Rive (6 animací) | 2–4 dny (design export + sync) | +50–200 KB/animace | Redesign ve Figma → re-export | Jen pro složité DnD |
| Autoplay video (6×) | 1–2 dny natáčení + compress | 1–5 MB | Každá změna UI = nové video | Ne |
| framer-motion | Podobný kód, větší bundle | +~30 KB | Pohodlnější sekvence | Zbytečné pro tento scope |
| Samostatný Astro komponent bez islandu | Horší — scroll state je v Reactu | — | Dva scroll listenery = bug | Ne |

**Úspora oproti Lottie/videu:** nemusíš udržovat 6 design assetů synchronních s appkou.
Změníš text mocku nebo barvu přímo v `ScrollFeatures.tsx` — hotovo za minuty, ne hodiny.

**Úspora oproti framer-motion:** nula nových závislostí, animace jdou primárně přes `transform` + `opacity`
(jak chtěl původní prompt).

---

## Soubory (mapa repa)

```
wemarry-astro/
├── src/components/sections/
│   ├── ScrollFeatures.tsx          ← hlavní island (steps, scroll logic, 6× Visual)
│   └── scroll-features/
│       └── hooks.ts                ← usePrefersReducedMotion, useActiveAnimKey, useCountUp
├── src/pages/index.astro           ← <ScrollFeatures client:visible />
├── tailwind.config.mjs             ← keyframes sf-* (prefix = scroll-features)
├── CURSOR-PROMPT-scroll-animations.md   ← původní zadání pro Cursor
└── HANDOFF-scroll-animations.md    ← tento soubor
```

**Nepoužívat:** složka `wemarry-app-2/landing/` — to byl early draft mimo Astro, ignorovat.

---

## Jak to funguje (architektura — NEROZBÍJET)

```
┌─ <section height={6 × 100vh}> ─────────────────────────────┐
│  scroll listener → activeStep (0..5), progress (0..1)      │
│  ┌─ sticky h-screen ──────────────────────────────────────┐ │
│  │  vlevo: steps[activeStep] text (fade)                  │ │
│  │  vpravo: steps.map → FeatureVisual isActive={i===n}   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

1. **Scroll řídí jen `ScrollFeatures`** — jeden listener, `activeStep = floor(progress × 6)`.
2. **`isActive`** se předává do každého vizuálu — animace **nespouští vlastní scroll listener**.
3. **`useActiveAnimKey(isActive)`** — při každém vstupu na krok (false→true) zvedne counter → restart efektů.
4. **Při opuštění kroku** vizuál resetuje state (prázdný donut, nezaškrtnuté úkoly…).
5. **`prefers-reduced-motion`** → finální statický stav, žádné timeouty/animace.

### Prop chain (důležité pro úpravy)

```tsx
// ScrollFeatures.tsx — pravý sloupec
<FeatureVisual step={step} isActive={i === activeStep} />

// FeatureVisual
{step.visual === "checklist" && <ChecklistVisual isActive={isActive} />}

// Každý Visual
function ChecklistVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  useEffect(() => { /* spustí sekvenci když isActive */ }, [isActive, reduced, animKey]);
}
```

---

## Pattern pro novou / upravenou animaci

```tsx
function FooVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) { setPhase(0); return; }
    if (reduced) { setPhase(FINAL); return; }

    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive, reduced, animKey]);

  // Render podle phase; pohyb jen transform/opacity
}
```

**CSS animace** (stagger, pop-in): přidej keyframe do `tailwind.config.mjs` s prefixem `sf-`,
použij `animate-sf-*` nebo inline `animation: sf-slide-up 0.4s ease 200ms forwards`.

**Count-up čísla:** `useCountUp(target, isActive, reduced, animKey)`.

**SVG donut:** animuj `strokeDashoffset` z plného kruhu — hodnota z `useCountUp` na procentech.

---

## Co jednotlivé vizuály dělají (timing)

| visual | Aktivní sekvence (~) | Technika |
|--------|----------------------|----------|
| `checklist` | 0.8s → 2.2s: 3 úkoly se odškrtnou, badge 2/5→5/5, progress bar | `setTimeout` stagger + CSS pop |
| `budget` | 0→1.6s: count-up 312 000 Kč, donut 0→69 %, bary scaleX stagger 400–1150 ms | `useCountUp` + `sf-star-fill` |
| `website` | 0.9s+: RSVP řádky slide-in; ~2.2s blink CS/EN | `visibleRows` state + `sf-lang-blink` |
| `seating` | 0.3s stoly fade-in; 1.4s host „Marie N." k sedadlu stolu 2 | `sf-guest-to-seat` + seat fill |
| `photos` | 0.4s+: 6 tile pop-in stagger 180 ms; QR `sf-pulse-soft` loop | stagger timeouts |
| `vendors` | 0.35s+: karty slide-up; ~1.2s hvězdičky clip-path | stagger + CSS transition |

Rozměry mocku: wrapper `h-[440px] md:h-[520px]`, vnitřek `rounded-card-sm bg-white shadow-card`.

Design tokeny: `primary` #0c948c, `sage`, `warm-peach`, font-serif Lora, font-sans Jost —
viz `tailwind.config.mjs`.

---

## Vzor z appky (kde hledat referenci)

| visual | Obrazovka v `wemarry-app-2` |
|--------|----------------------------|
| checklist | `src/app/(app)/checklist/page.tsx` |
| budget | `src/app/(app)/budget/page.tsx` |
| website | `src/components/website/site-preview.tsx` |
| seating | `src/app/(app)/seating/page.tsx` |
| photos | `src/app/(app)/gallery/page.tsx` |
| vendors | `src/app/(app)/vendors/page.tsx` |

Mock data v marketingu jsou zjednodušená česká jména/částky — nemíchat do `messages/*.json`.

---

## Checklist po úpravě

```bash
cd wemarry-astro
npm run check    # astro check — 0 errors
npm run build    # static build OK
npm run dev      # ručně scrollnout homepage sticky sekci
```

Ověřit:
- [ ] Scroll mezi kroky funguje jako dřív (fade text + scale vizuálu)
- [ ] Animace startuje při každém **návratu** na krok (ne jen poprvé)
- [ ] V Chrome DevTools → Rendering → Emulate prefers-reduced-motion: reduced → statické finální stavy
- [ ] Mobile: mock se vejde do pravého sloupce / pod text

---

## Prompt pro Claude (zkopíruj do chatu v `wemarry-astro`)

```
Uprav animace ve ScrollFeatures (wemarry-astro).

Kontext: HANDOFF-scroll-animations.md + CURSOR-PROMPT-scroll-animations.md.
Implementace je hotová — neměň scroll mechanismus (activeStep, sticky, 6×100vh).
Vizuály dostávají isActive z parenta; hooks v scroll-features/hooks.ts.

Úkol: [DOPLŇ — např. „zpomal seating animaci" / „přidej loop na website" / „sjednoť checklist s appkou"]

Pravidla:
- Animace jen transform + opacity (výjimka: strokeDashoffset u donutu, clip-path u hvězdiček)
- prefers-reduced-motion → finální stav
- Žádné nové npm balíčky bez důvodu
- npm run check && npm run build na konci
Referenční UI: wemarry-app-2 repozitář (obrazovky v tabulce v HANDOFF).
```

---

## Časté úpravy (rychlý návod)

**Zpomalit animaci kroku X:** v příslušné `*Visual` funkci posuň ms v `setTimeout` — vše je explicitní, žádná magie.

**Přidat 7. krok:** rozšíř `steps[]`, union type `visual`, nová `SomethingVisual`, keyframe jen pokud potřebuješ nový pohyb.

**Smyčka místo jednorázové:** po posledním timeoutu v `useEffect` zavolej znovu start (nebo CSS `infinite` jen u QR pulse — už tam je).

**Silnější „prodejní" efekt u webu:** theme swatch + přebarvení mocku (pattern z early draftu `FeatureWebMock.astro` v app repu — převést do `WebsiteVisual`, ne kopírovat celý soubor).

---

## Shrnutí pro tebe (Krystof)

- **Už to v Astru je** — stačí `npm run dev` a scrollnout homepage.
- **Formát = kód v React islandu**, ne externí assety.
- **Údržba:** jeden TSX + malý hooks soubor + pár řádků v tailwind config.
- **Handoff pro AI:** přilož tento soubor + konkrétní úkol do promptu výše.
