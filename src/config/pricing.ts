/**
 * Kanonický pricing model — mirror checkoutu z appky (wemarry-app-2).
 * Jediný zdroj pravdy pro marketingový ceník. Bez Reactu, jen data.
 * Viz HANDOFF-pricing.md.
 *
 * POZN.: Zatím se používá jen na skryté stránce /cenik-new (preview nového ceníku).
 * Stávající /cenik (1 490 Kč) zůstává beze změny.
 */

export type TierId = "web" | "rsvp" | "full";

export type Tier = {
  id: TierId;
  name: string;
  desc: string;
  priceCzk: number;
  /** Zobrazená cena (např. "Zdarma" pro 0). */
  priceLabel: string;
  /** Odhad ušetřených hodin práce. */
  savesHours: number;
  popular: boolean;
  ctaLabel: string;
};

export const PRICING_TIERS: Tier[] = [
  {
    id: "web",
    name: "Svatební web",
    desc: "Informační web pro hosty.",
    priceCzk: 0,
    priceLabel: "Zdarma",
    savesHours: 10,
    popular: false,
    ctaLabel: "Začít zdarma",
  },
  {
    id: "rsvp",
    name: "Web + RSVP",
    desc: "Web s potvrzením účasti hostů.",
    priceCzk: 1490,
    priceLabel: "1 490 Kč",
    savesHours: 24,
    popular: true,
    ctaLabel: "Vyzkoušet zdarma",
  },
  {
    id: "full",
    name: "Komplet",
    desc: "Web, RSVP i sdílená galerie.",
    priceCzk: 1990,
    priceLabel: "1 990 Kč",
    savesHours: 30,
    popular: false,
    ctaLabel: "Vyzkoušet zdarma",
  },
];

/** Rozklad ušetřených hodin pro popover („Jak jsme k tomu došli"). */
export const SAVES_BREAKDOWN: Record<TierId, { label: string; hours: number }[]> = {
  web: [
    { label: "Odpovídání na opakované dotazy hostů", hours: 8 },
    { label: "Aktualizace informací a rozeslání změn", hours: 2 },
  ],
  rsvp: [
    { label: "Vše ze Svatebního webu", hours: 10 },
    { label: "Obvolávání hostů kvůli potvrzení účasti", hours: 8 },
    { label: "Sledování a urgování odpovědí", hours: 4 },
    { label: "Finální seznam pro dodavatele a zasedací pořádek", hours: 2 },
  ],
  full: [
    { label: "Vše z Web + RSVP", hours: 24 },
    { label: "Založení a sdílení fotoalba", hours: 2 },
    { label: "Sbírání fotek od hostů jednotlivě", hours: 2 },
    { label: "Třídění a rozeslání fotek po svatbě", hours: 2 },
  ],
};

export const SAVES_ESTIMATE_NOTE = "Odhad pro průměrnou svatbu ~60 hostů.";

/** Feature matrix. Hodnota: true = ✓, false = —, string = textová hodnota. */
export const TIER_FEATURES: { label: string; values: Record<TierId, boolean | string> }[] = [
  {
    label: "Doména",
    values: { web: "subdoména *.wemarry.io", rsvp: "vlastní doména", full: "vlastní doména" },
  },
  { label: "Druhý jazyk", values: { web: true, rsvp: true, full: true } },
  {
    label: "Dostupnost webu",
    values: { web: "12 měsíců", rsvp: "18 měsíců", full: "18 měsíců" },
  },
  { label: "RSVP formulář", values: { web: false, rsvp: true, full: true } },
  { label: "E-mailové pozvánky", values: { web: false, rsvp: true, full: true } },
  { label: "Propojení se zasedacím pořádkem", values: { web: false, rsvp: true, full: true } },
  { label: "QR sběr fotek do galerie", values: { web: false, rsvp: false, full: true } },
];

export const FREE_INCLUDED = [
  "checklist úkolů",
  "kalkulačka rozpočtu",
  "katalog dodavatelů",
  "zasedací pořádek",
];

export const TRUST_BADGES = [
  { title: "30 dní záruka", sub: "Vrátíme peníze bez otázek" },
  { title: "Přes 2 000 svateb", sub: "Páry už spustily svůj web" },
  { title: "4,9 ★ na Google", sub: "Ze stovek recenzí" },
];
