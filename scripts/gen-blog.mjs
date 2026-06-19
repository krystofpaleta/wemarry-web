/**
 * Jednorázový generátor: převede data z původního src/data/blog.ts
 * na markdown soubory pro Astro Content Collection (src/content/blog/*.md).
 * Tělo článku = sdílený placeholder text 1:1 z Next.js prototypu (blog/[slug]).
 *
 * Spuštění: node scripts/gen-blog.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "content", "blog");
mkdirSync(OUT, { recursive: true });

/** "23. 11. 2025" → "2025-11-23" */
function toISO(cs) {
  const [d, m, y] = cs.split(".").map((s) => s.trim());
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const posts = [
  // FEATURED
  { slug: "jak-vybrat-svatebni-saty-2026", list: "featured", order: 0, category: "Svatební šaty", title: "Jak vybrat svatební šaty. Trendy pro rok 2026", excerpt: "Od princeznovských A-linií po minimalistické bias-cut. Poradíme, jak ve smršti trendů najít ty šaty, které budete opravdu chtít.", date: "23. 11. 2025", views: 2398, readMinutes: 7, palette: "from-[#e8a89a] via-[#c97a6c] to-[#6b3a30]" },
  // POPULAR
  { slug: "svatebni-saty-trendy-2026", list: "popular", order: 0, category: "Svatební šaty", title: "Jak vybrat svatební šaty. Trendy pro rok 2026", excerpt: "", date: "14. 11. 2025", views: 2398, readMinutes: 6, palette: "from-[#f9f0eb] to-[#e4c8b4]" },
  { slug: "svatba-netrpet-v-botach", list: "popular", order: 1, category: "Rady a tipy", title: "Jak na svatbě netrpět v botách", excerpt: "", date: "9. 11. 2025", views: 2398, readMinutes: 4, palette: "from-[#edd4cb] to-[#d4a78a]" },
  { slug: "10-tipu-mista-svatba-cr", list: "popular", order: 2, category: "Rady a tipy", title: "10 tipů na krásná místa v ČR, kde uspořádat vaši svatbu", excerpt: "", date: "2. 11. 2025", views: 2398, readMinutes: 8, palette: "from-[#d4e3d0] to-[#a6c1a7]" },
  { slug: "10-tipu-svatebni-prstynky", list: "popular", order: 3, category: "Rady a tipy", title: "10 tipů, jak a kde vybrat svatební prstýnky. Na co si dát pozor a nenaletět", excerpt: "", date: "26. 10. 2025", views: 2398, readMinutes: 9, palette: "from-[#e8dfd4] to-[#c9b89f]" },
  // GRID
  { slug: "jak-vybrat-fotografa-otazky", list: "grid", order: 0, category: "Rady a tipy", title: "Svatební fotograf: 12 otázek, které musíte položit před podpisem", excerpt: "Od stylu přes cenu až po zálohy. Praktický checklist, který vás ochrání před nepříjemnými překvapeními.", date: "18. 11. 2025", views: 2398, readMinutes: 6, palette: "from-[#d4b8a4] to-[#8a6a54]" },
  { slug: "dary-pro-hosty-8-napadu", list: "grid", order: 1, category: "Svatební dorty", title: "Dárky pro hosty: 8 nápadů, které nikdo nevyhodí", excerpt: "Klasické mandle už nikdo nechce. Vybrali jsme osm nápadů na svatební dárky, které vaši hosté skutečně využijí.", date: "12. 11. 2025", views: 2398, readMinutes: 5, palette: "from-[#f5e8e0] to-[#edd4cb]" },
  { slug: "zasedaci-poradek-tipy", list: "grid", order: 2, category: "Rady a tipy", title: "Jak sestavit zasedací pořádek, aby se všichni bavili", excerpt: "Tetička Jana vedle kolegy Petra? Raději ne. Pravidla pro rozsazení hostů, aby večer klaplo.", date: "7. 11. 2025", views: 2398, readMinutes: 7, palette: "from-[#f0e4db] to-[#b08a75]" },
  { slug: "svatebni-hostina-jidla-na-hosta", list: "grid", order: 3, category: "Svatební hostina", title: "Svatební hostina: kolik jídla vlastně potřebujete na hosta?", excerpt: "Catering není věštění z křišťálové koule. Konkrétní čísla i tipy, jak se vyhnout vyhazování jídla.", date: "30. 10. 2025", views: 2398, readMinutes: 5, palette: "from-[#e8c9b8] to-[#c9a089]" },
  { slug: "trendy-svatebnich-kytic-2026", list: "grid", order: 4, category: "Svatební kytice", title: "Trendy svatebních kytic 2026: divoké louky a decentní zeleň", excerpt: "Přírodní vazby, sezónní květiny a návrat k jednoduchosti. Co letos kvete na svatbách.", date: "25. 10. 2025", views: 2398, readMinutes: 4, palette: "from-[#e8a89a] to-[#c97a6c]" },
  { slug: "svatebni-rozpocet-kam-penize", list: "grid", order: 5, category: "Rady a tipy", title: "Svatební rozpočet: kam peníze reálně utíkají", excerpt: "Šestimístná čísla v excelu? Rozebrali jsme reálné rozpočty desítek párů a ukazujeme, co stojí nejvíc.", date: "19. 10. 2025", views: 2398, readMinutes: 8, palette: "from-[#d4e3d0] to-[#a6c1a7]" },
  { slug: "svatebni-tabule-inspirace", list: "grid", order: 6, category: "Svatební tabule", title: "Svatební tabule: pět stylů, které nikdy nezestárnou", excerpt: "Od rustikální dřevěné po minimalistickou v ocelových tónech. Inspirace pro výzdobu tabule.", date: "13. 10. 2025", views: 2398, readMinutes: 6, palette: "from-[#e8dfd4] to-[#c9b89f]" },
  { slug: "dj-vs-kapela-co-vybrat", list: "grid", order: 7, category: "Rady a tipy", title: "DJ nebo kapela? Co vybrat pro svatební večer", excerpt: "Rozpočet, atmosféra, variabilita. Výhody a nevýhody obou variant — a kdy se vyplatí kombinace.", date: "6. 10. 2025", views: 2398, readMinutes: 5, palette: "from-[#f9f0eb] to-[#e4c8b4]" },
  { slug: "rsvp-jak-pripomenout", list: "grid", order: 8, category: "Rady a tipy", title: "RSVP: jak (ne)otravně připomínat hostům odpověď", excerpt: "Hosté neodpovídají? Tři jemné způsoby, jak je přimět ke kliknutí, aniž byste vypadali jako otravní.", date: "1. 10. 2025", views: 2398, readMinutes: 3, palette: "from-[#edd4cb] to-[#d4a78a]" },
  { slug: "svatebni-dort-styly-2026", list: "grid", order: 9, category: "Svatební dorty", title: "Svatební dort 2026: od naked cake po minimalistické sochy", excerpt: "Cukráři letos opouští klasické růžičky. Koukneme, co se nosí a kolik to stojí.", date: "24. 9. 2025", views: 2398, readMinutes: 4, palette: "from-[#f5e8e0] to-[#edd4cb]" },
  { slug: "koordinatorka-ano-ne", list: "grid", order: 10, category: "Rady a tipy", title: "Svatební koordinátorka: ano, ne, nebo jen na den D?", excerpt: "Kdy se vyplatí a kdy si vystačíte sami. Tři scénáře podle velikosti svatby a volného času.", date: "17. 9. 2025", views: 2398, readMinutes: 6, palette: "from-[#d4b8a4] to-[#8a6a54]" },
  { slug: "svatba-venku-co-na-pocasi", list: "grid", order: 11, category: "Rady a tipy", title: "Svatba venku: jak se připravit na všechny druhy počasí", excerpt: "Plán B, C a někdy i D. Praktický průvodce, jak zachránit venkovní obřad při dešti, větru i třicítce ve stínu.", date: "10. 9. 2025", views: 2398, readMinutes: 7, palette: "from-[#d4e3d0] to-[#8a9e8a]" },
];

// Sdílené tělo článku — text 1:1 z Next.js prototypu (blog/[slug] placeholder).
const BODY = `Svatební proslov je neodmyslitelnou součástí každé svatby. Pokud jste byli požádáni o proslov na svatbě, měli byste se minimálně **částečně připravit** a trochu nacvičit. Není nic horšího, než se na svatbě rozhostí trapné ticho a hosté čekají, co z řečníka vypadne.

Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést, aby dotyční měli dostatek času na přípravu.

Součástí i samotného novomanželského slova by mělo být také poděkování své rodině a přátelům za vše, co pro ně v předešlých letech nebo v předsvatebních měsících udělali.

Někdy je to podvrh, co někdo takového pronese natřes, tudíž se může jednat o dojemný moment, který často výrazně vyvýší vzájemné vztahy v rodině. Pokud se proslovu zhostí vynikající řečník, může být celá záležitost nesmírně zábavnou částí svatby.

## Svatební proslov otce nevěsty

Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést, aby dotyční měli dostatek času na přípravu.

Současně i sami novomanželé se mohou na svatební hostině ujmout slova a poděkovat své rodině a přátelům za vše, co pro ně v předešlých letech nebo v předsvatebních měsících udělali.

## Svatební proslov svědka

Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést, aby dotyční měli dostatek času na přípravu.

Současně i sami novomanželé se mohou na svatební hostině ujmout slova a poděkovat své rodině a přátelům za vše, co pro ně v předešlých letech nebo v předsvatebních měsících udělali.

## Na co si dát při proslovu pozor

- Novomanželé by se proto měli předem domluvit
- Současně i sami novomanželé
- Dostatek času na přípravu
- Přejí svatební projev přednést
- Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést

> Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést, aby dotyční měli dostatek času na přípravu.

Novomanželé by se proto měli předem domluvit s těmi, od kterých si přejí svatební projev přednést, aby dotyční měli dostatek času na přípravu. Současně i sami novomanželé se mohou na svatební hostině ujmout slova a poděkovat své rodině a přátelům za vše, co pro ně v předešlých letech nebo v předsvatebních měsících udělali.
`;

const esc = (s) => s.replace(/"/g, '\\"');

for (const p of posts) {
  const fm = [
    "---",
    `title: "${esc(p.title)}"`,
    `category: "${p.category}"`,
    `excerpt: "${esc(p.excerpt)}"`,
    `date: "${p.date}"`,
    `isoDate: ${toISO(p.date)}`,
    `views: ${p.views}`,
    `readMinutes: ${p.readMinutes}`,
    `palette: "${p.palette}"`,
    `list: "${p.list}"`,
    `order: ${p.order}`,
    "---",
    "",
    BODY,
  ].join("\n");
  writeFileSync(join(OUT, `${p.slug}.md`), fm, "utf8");
}

console.log(`Wrote ${posts.length} markdown files to src/content/blog/`);
