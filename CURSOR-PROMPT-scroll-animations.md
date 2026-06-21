# Cursor prompt — animované vizuály do sticky-scroll sekce (ScrollFeatures)

> Zkopíruj celý text níže do Cursoru. Ideálně měj otevřené **oba** repozitáře:
> marketing web (Astro) a appku — Cursor má brát appku jako vzor reálného UI.

---

## Kontext

Pracuješ na marketingovém webu **WeMarry** (svatební plánovač). Je to **Astro 4 + React islands + Tailwind**. Na homepage je „Apple-style" sticky-scroll sekce, která prochází 6 funkcí produktu. Teď má každá funkce jen **statický placeholder mockup**. Chci je nahradit **jemně animovanými vizuály, které vypadají jako reálná appka** (kterou vyvíjím v druhém repu).

## Kde to je

- **Repo (marketing):** `wemarry-astro/`
- **Soubor k úpravě:** `src/components/sections/ScrollFeatures.tsx` — React island, na homepage se renderuje jako `<ScrollFeatures client:visible />` (z `src/pages/index.astro`).
- **Appka (vzor reálného UI):** druhý repozitář v Cursoru. Pro každou funkci najdi odpovídající obrazovku a převezmi z ní **layout, barvy, sample data a microcopy**, ať mockup vypadá jako produkt.

## Jak ScrollFeatures funguje (NEROZBÍJEJ tento mechanismus)

- Vnější `<section>` má výšku `steps.length * 100vh`.
- Uvnitř je `sticky top-0 h-screen` wrapper.
- Scroll listener počítá `progress` (0–1) a z něj `activeStep`.
- Vlevo je text kroku (fade podle activeStep), vpravo `<FeatureVisual step={...} />`, který se přepíná podle aktivního kroku (fade + scale ve wrapperu).
- Kroky (`steps[].visual`): `"checklist" | "budget" | "website" | "seating" | "photos" | "vendors"`.
- Jednotlivé vizuály jsou funkce: `ChecklistVisual`, `BudgetVisual`, `WebsiteVisual`, `SeatingVisual`, `PhotosVisual`, `VendorsVisual`. Přepíná je `FeatureVisual`.

**Důležité:** sekce sama řídí přepínání kroků scrollem. Vnepřidávej žádný scroll-jacking ani druhý scroll listener. Animace uvnitř vizuálů mají být **micro-interakce, které se spustí (a případně smyčkují), když je daný krok aktivní.**

## Co udělat

1. Do `FeatureVisual` (a do `steps.map(...)` na pravé straně) **přidej prop `isActive: boolean`** a předávej ho z `ScrollFeatures` (vizuál ví, jestli je zrovna aktivní). Animace se mají spouštět/resetovat při `isActive === true`.
2. Pro každý z 6 vizuálů vytvoř **animovanou verzi věrnou reálné appce**:
   - **checklist** → úkoly se postupně odškrtávají (stagger), progress „3/5" naskakuje.
   - **budget** → donut se „dolije" na cílové %, kategorie progress bary se naplní zleva, čísla se dopočítají (count-up).
   - **website** → mockup svatebního webu + RSVP řádky, kde se postupně objevují „✓ potvrzeno", přepínač jazyka decentně blikne.
   - **seating** → stoly/židle/jmenovky „snapnou" na místo (drag-and-drop dojem), host se přesune ke stolu.
   - **photos** → fotky postupně „popnou" do gridu, QR panel jemně pulzuje.
   - **vendors** → karty dodavatelů naskáčou se staggerem, hvězdičky se naplní.
3. Zachovej rozměry/poměry vizuálů (aby seděly do pravého sloupce, cca `h-[440px] md:h-[520px]`).

## Technické mantinely

- **Stack:** TSX React komponenta uvnitř Astro islandu. Animace řeš primárně přes **CSS keyframes / Tailwind** (lehké, bez závislostí). `framer-motion` přidej jen pokud sekvence reálně potřebuješ — pak ho přidej do `package.json` a zdůvodni to. Žádné těžké knihovny navíc.
- **Respektuj `prefers-reduced-motion`** — při zapnutém se animace nespouští (zobraz koncový stav staticky).
- **Výkon:** animuj jen `transform` a `opacity`. Žádné animace `width/height/top/left` na velkých prvcích. Smyčky drž decentní (ne rušivé), ideálně se po dokončení zastaví.
- **Design tokeny (drž se jich, jsou v `tailwind.config.mjs`):**
  - `primary` `#0c948c` (hover `#0a7f78`), `sage` `#a6c1a7` / `sage-deep` `#385647`, `cream` `#fffdfc`, `beige`/`beige-light`/`beige-border`, `warm-gray` `#f8f5f4`, `warm-peach` `#edd4cb`
  - text: `ink` `#000`, `ink-body` `#454545`, `ink-muted` `#585858`, `ink-soft` `#7a7a7a`
  - radiusy: `rounded-card` 24px, `card-sm` 16px, `pill` 200px; stíny `shadow-card`, `shadow-soft`, `shadow-prominent`
  - fonty: nadpisy `font-serif` (Lora), UI `font-sans` (Jost)
- **SVG donut** (budget) drž stávající techniku: dva `<circle>`, `strokeDasharray`/`strokeDashoffset`, `strokeLinecap="round"`, rotace `-90deg`. Animuj `strokeDashoffset`.

## Vzor z appky

Pro každou funkci otevři v repu appky odpovídající obrazovku (checklist, rozpočet/kalkulačka, svatební web + RSVP, zasedací pořádek, sdílená galerie, katalog dodavatelů) a **převezmi reálný layout, barvy, ikonografii a vzorová data**. Cílem je, aby marketingový mockup vypadal jako zmenšenina skutečného produktu, ne jako obecná ilustrace. Pokud appka používá konkrétní komponenty/tokeny, slaď s nimi vzhled (ale výsledek musí ladit i s marketing tokeny výše).

## Hotovo, když

- `npm run check` projde bez chyb a `npm run build` lokálně proběhne.
- Každý krok má animovaný vizuál, který se spustí při aktivaci kroku, je věrný appce a respektuje `prefers-reduced-motion`.
- Sticky-scroll mechanismus funguje stejně jako dřív (jen vizuály jsou živé).
- Žádná regrese výkonu (animace na `transform`/`opacity`, lazy, bez scroll-jackingu).

## Doporučený postup

1. Nejdřív přidej `isActive` prop a prožeň jím všech 6 vizuálů (zatím beze změny vzhledu) → ověř, že se nic nerozbilo.
2. Pak po jednom předělávej vizuály (`checklist` → `budget` → `website` → `seating` → `photos` → `vendors`), vždy s referencí na reálnou obrazovku v appce.
3. Na konci přidej `prefers-reduced-motion` fallback a projeď `npm run check` + `npm run build`.
