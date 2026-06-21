# Handoff — pricing & „ušetřené hodiny“ (marketing ↔ appka)

> **Problém:** Marketing web (`wemarry-astro`) a checkout v appce (`wemarry-app-2`) mluví o cenách
> **jinak**. Appka má 3 balíčky + rozpad hodin práce. Web má zjednodušené „1 490 Kč jednorázově“.
> Tento dokument je **jediný zdroj pravdy pro sjednocení** — Claude ho má použít při úpravě Astro ceníku.

---

## Kde co žije dnes

| Vrstva | Repo | Soubory | Co ukazuje |
|--------|------|---------|------------|
| **Checkout (prodej)** | `wemarry-app-2` | `src/app/(app)/checkout/page.tsx` + `messages/cs.json` → `checkout` | 3 tiery, ceny, feature matrix, **~X hodin ušetřené**, popover s rozkladem |
| **Feature gating** | `wemarry-app-2` | `src/lib/plan.ts` | `free` / `rsvp` / `full` — co je odemčené v appce |
| **Marketing — srovnání** | `wemarry-astro` | `PricingCompare.astro` | Tabulka WeMarry vs tradičně vs jiné online |
| **Marketing — cena** | `wemarry-astro` | `Pricing.astro` | **Jen 1 490 Kč**, WeMarry vs „Ostatní 10 000 Kč“ |
| **Marketing — stránka** | `wemarry-astro` | `cenik.astro` | Hero + PricingCompare + Pricing + FAQ |
| **JSON-LD** | `wemarry-astro` | `index.astro` | `offers.price: "1490"` — jen jedna cena |

**Závěr:** Checkout v appce je **produktově novější** (3 balíčky, free web, upsell na galerii).
Marketing je **zastaralý zjednodušený model**. Při syncu vycházej z checkoutu.

---

## Kanonický pricing model (z appky)

### Tři balíčky (tiery)

| ID | Název (CS) | Popis | Cena CZK | Plán v appce | Popular |
|----|------------|-------|----------|--------------|---------|
| `web` | Svatební web | Informační web pro hosty | **0 Kč** | `free` | — |
| `rsvp` | Web + RSVP | Web s potvrzením účasti | **1 490 Kč** | `rsvp` | ✅ nejoblíbenější |
| `full` | Komplet | Web, RSVP i galerie | **1 990 Kč** | `full` | — |

### Ceny v dalších měnáách (checkout)

```ts
// checkout/page.tsx → TIER_PRICES
CZK: { web: 0,   rsvp: 1490, full: 1990 }
EUR: { web: 0,   rsvp: 59,   full: 79   }
USD: { web: 0,   rsvp: 65,   full: 87   }
PLN: { web: 0,   rsvp: 259,  full: 349  }
```

Kupón mock: `SLEVA300` → sleva 300 Kč / 12 € / 13 $ / 52 zł.

### Co je ve všech balíčcích zdarma (footer checkoutu)

> „Ke každému balíčku zdarma: **checklist úkolů · rozpočet · katalog dodavatelů · zasedací pořádek**"

To platí i na marketingu — plánovač je free, platí se až RSVP/galerie při zveřejnění webu.

---

## „Ušetřené hodiny“ — logika prodeje

Hlavní claim na kartě balíčku:

```
„Ušetří vám ~{hours} hodin práce“
```

| Tier | Celkem hodin | Odkud se to skládá |
|------|--------------|-------------------|
| **web** | **~10 h** | 8 h odpovídání hostům na opakované dotazy + 2 h aktualizace info a rozesílání změn |
| **rsvp** | **~24 h** | 10 h (vše z webu) + 8 h obvolávání + 4 h urgování odpovědí + 2 h finální seznam pro dodavatele / seating |
| **full** | **~30 h** | 24 h (vše z RSVP) + 2 h založení alba + 2 h sbírání fotek od hostů + 2 h třídění po svatbě |

**Poznámka pod popoverem:** „Odhad pro průměrnou svatbu ~60 hostů.“

**UI v appce:** tlačítko ℹ u badge hodin → popover s řádky `{label} ~{h} h`.

### i18n klíče (namespace `checkout` v `messages/cs.json`)

| Klíč | Text (CS) |
|------|-----------|
| `savesHours` | Ušetří vám ~{hours} hodin práce |
| `savesHow` | Jak jsme k tomu došli |
| `savesEstimate` | Odhad pro průměrnou svatbu ~60 hostů. |
| `savesAnswering` | Odpovídání na opakované dotazy hostů |
| `savesUpdating` | Aktualizace informací a rozeslání změn |
| `savesAllWeb` | Vše ze Svatebního webu |
| `savesCalling` | Obvolávání hostů kvůli potvrzení účasti |
| `savesChasing` | Sledování a urgování odpovědí |
| `savesFinalList` | Finální seznam pro dodavatele a zasedací pořádek |
| `savesAllRsvp` | Vše z Web + RSVP |
| `savesAlbum` | Založení a sdílení fotoalba |
| `savesCollecting` | Sbírání fotek od hostů jednotlivě |
| `savesSorting` | Třídění a rozeslání fotek po svatbě |

Anglické překlady: stejné klíče v `messages/en.json`.

---

## Feature matrix (co je v kterém balíčku)

Z `checkout/page.tsx` → `FEATURES[]`. ✓ = zapnuto, — = ne.

| Feature (klíč) | web | rsvp | full | Poznámka textu |
|----------------|-----|------|------|----------------|
| Doména | subdoména `*.wemarry.io` | vlastní doména | vlastní doména | `featDomainSub` / `featDomainCustom` |
| Druhý jazyk | ✓ | ✓ | ✓ | |
| Dostupnost webu | 12 měsíců | 18 měsíců | 18 měsíců | |
| RSVP | — | ✓ | ✓ | |
| E-mail pozvánky | — | ✓ | ✓ | |
| Propojení se seating | — | ✓ | ✓ | |
| QR sběr fotek | — | — | ✓ | |

### Trust badges (pod kartami)

| Klíč | Title | Sub |
|------|-------|-----|
| `trustGuarantee` | 30 dní záruka | Vrátíme peníze bez otázek |
| `trustWeddings` | Přes 2 000 svateb | Páry už spustily svůj web |
| `trustRating` | 4,9 ★ na Google | Ze stovek recenzí |

---

## Co marketing teď říká špatně / zjednodušeně

1. **`Pricing.astro`** — jedna cena 1 490, chybí tier **Komplet 1 990** a **free web**.
2. **Chybí badge „Ušetří ~24 h“** — hlavní prodejní argument z checkoutu.
3. **`PricingCompare.astro`** — řádek Cena: „1 490 Kč jednorázově“ — neodráí 3 tiery; OK jako orientační srovnání s konkurencí.
4. **`cenik.astro` meta** — „1 490 Kč“ v title; mělo by zmínit „od zdarma“ nebo „1 490–1 990“.
5. **JSON-LD** — jedna offer; ideálně `AggregateOffer` nebo min/max.

**Co je na webu OK a neměnit bez důvodu:**
- srovnávací tabulka funkcí vs Excel/papír/konkurence
- „Ostatní řešení 10 000 Kč“ — marketingový kontrast, ne produktová cena
- FAQ na `/cenik` — sedí s jednorázovou platbou a garancí

---

## Doporučená architektura pro Astro (sync)

### 1. Sdílený config — `src/config/pricing.ts`

Jeden soubor, mirror konstant z checkoutu (bez React):

```ts
export const PRICING_TIERS = [
  { id: "web",  priceCzk: 0,    savesHours: 10, popular: false },
  { id: "rsvp", priceCzk: 1490, savesHours: 24, popular: true  },
  { id: "full", priceCzk: 1990, savesHours: 30, popular: false },
] as const;

export const SAVES_BREAKDOWN = { /* stejné jako SAVES_DETAIL */ };
export const TIER_FEATURES = { /* stejné jako FEATURES */ };
```

Texty zatím v `src/content/pricing.cs.ts` nebo přímo v Astro frontmatter — marketing nemá next-intl.

### 2. Nová sekce — `PricingTiers.astro`

3 karty vedle sebe (jako checkout step 1), statické Astro:
- název, popis, cena, badge hodin, seznam feature (✓/—)
- CTA → `SITE.app.signup` (ne přímo platba — platba je až v appce `/checkout`)
- volitelně: ℹ popover s rozkladem hodin — buď `<details>`, nebo malý React island

**Mobil:** stack 1 sloupec, `rsvp` karta nahoře (popular).

### 3. Úpravy existujících souborů

| Soubor | Akce |
|--------|------|
| `Pricing.astro` | Nahradit / doplnit o `PricingTiers` NEBO sloučit — starý „WeMarry vs Ostatní“ nechat jako druhou sekci |
| `cenik.astro` | Vložit `PricingTiers` mezi hero a `PricingCompare` |
| `index.astro` | Na homepage buď tiers, nebo aspoň jeden řádek „od 0 Kč · RSVP 1 490 · Komplet 1 990“ |
| `index.astro` JSON-LD | `lowPrice: 0`, `highPrice: 1990`, `priceCurrency: CZK` |

### 4. Co NEDĚLAT na marketingu

- Platební bránu, voucher, fakturační formulář — to zůstává v appce `/checkout`
- `localStorage wm-plan` — jen appka
- Měnový přepínač — na webu stačí CZK; multi-currency až pokud cílíte na EN landing

---

## Vizuální reference (app checkout)

Layout karet v appce:
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Svatební web    │ │ Web + RSVP  ★   │ │ Komplet         │
│ popis           │ │ popis           │ │ popis           │
│ Zdarma          │ │ 1 490 Kč        │ │ 1 990 Kč        │
│ 🕐 ~10 h  ℹ     │ │ 🕐 ~24 h  ℹ     │ │ 🕐 ~30 h  ℹ     │
│ ✓ features…     │ │ ✓ features…     │ │ ✓ features…     │
│ [Aktivovat]     │ │ [Aktivovat]     │ │ [Aktivovat]     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
Ke každému balíčku zdarma: checklist · rozpočet · dodavatelé · seating
```

Marketing tokeny: `primary` #0c948c, `rounded-card`, `shadow-prominent`, `font-serif` Lora — viz `tailwind.config.mjs`.

---

## Prompt pro Claude (sync pricing do Astro)

```
Sjednoť pricing na marketing webu wemarry-astro s checkoutem z wemarry-app-2.

Přečti HANDOFF-pricing.md v kořeni wemarry-astro.

Úkol:
1. Vytvoř src/config/pricing.ts — ceny, tiery, saves breakdown, features (mirror checkout/page.tsx).
2. Vytvoř src/components/sections/PricingTiers.astro — 3 karty jako v app checkoutu včetně
   „Ušetří vám ~X hodin“ a rozkladu hodin (details nebo popover).
3. Zapoj na /cenik a volitelně homepage (index.astro).
4. Aktualizuj JSON-LD offers v index.astro (lowPrice/highPrice).
5. Zachovej PricingCompare.astro a FAQ na cenik — jen doplň, nemaž srovnávací tabulku.
6. CTA vede na SITE.app.signup z config/site.ts.
7. Texty v češtině, konzistentní s messages/cs.json checkout namespace.
8. npm run check && npm run build.

Neměň checkout v app repu. Marketing = informativní mirror, ne platba.
```

---

## Checklist po implementaci

- [ ] 3 ceny na `/cenik` sedí s app `/checkout`
- [ ] Hodiny 10 / 24 / 30 + popover rozklad
- [ ] „Ke každému balíčku zdarma: checklist…“ pod kartami
- [ ] Trust: 30 dní, 2000 svateb, 4,9 Google
- [ ] CTA → signup, ne checkout URL (pokud nemáte deep link)
- [ ] Meta title/description `/cenik` odráží „od zdarma“ nebo rozsah cen

---

## Shrnutí pro Krystofa

| Otázka | Odpověď |
|--------|---------|
| Kde je „pravda“ o cenách? | `wemarry-app-2` → `checkout/page.tsx` + `messages/cs.json` → `checkout` |
| Co jsou ušetřené hodiny? | Marketingový odhad, rozpad v `SAVES_DETAIL`, zobrazuje se u každého tieru |
| Je to už v Astru? | **Ne** — Astro má zjednodušené 1 490 Kč; tiers + hodiny chybí |
| Co udělat? | Handoff výše + prompt → Claude vytvoří `pricing.ts` + `PricingTiers.astro` |
