/**
 * Sdílená data šablon — používá homepage TemplatesGallery i /sablony katalog a detail.
 * Přeneseno 1:1 z Next.js prototypu.
 * TODO: Placeholder gradienty nahradit reálnými fotkami z Figmy.
 */

export type TemplateStyle =
  | "Moderní"
  | "Hravá"
  | "Elegantní"
  | "Klasická"
  | "Květinová"
  | "Minimalistická";

export type Template = {
  slug: string;
  name: string;
  style: TemplateStyle;
  subtitle: string;
  description: string;
  palette: string;
  coupleName: string;
  tagline: string;
  date: string;
  previewTone: "moody" | "light" | "romance";
};

export const templates: Template[] = [
  {
    slug: "moderni",
    name: "Moderní",
    style: "Moderní",
    subtitle: "Minimalistický vzhled, elegantní typografie, dost prostoru.",
    description:
      "Pro páry, které si potrpí na čistý design a kvalitní typografii. Velké fotky, hodně bílého prostoru a decentní animace.",
    palette: "from-[#4a3f36] via-[#6b5a4e] to-[#3a2f28]",
    coupleName: "Honza & Klára",
    tagline: "Chceme, abyste byli součástí našeho dne!",
    date: "23. 8. 2025 • Václavské náměstí",
    previewTone: "moody",
  },
  {
    slug: "hrava",
    name: "Hravá",
    style: "Hravá",
    subtitle: "Hravý vzhled, veselé zdobení a spousta barev.",
    description:
      "Pro páry, které svatbu berou jako velkou radostnou párty. Playful typografie, veselé ilustrace, pestrá paleta.",
    palette: "from-[#d4b8a4] via-[#c9a089] to-[#8a6a54]",
    coupleName: "Luboš & Denisa",
    tagline: "Budeme se brááát!",
    date: "23. 11. 2025 • Praha",
    previewTone: "light",
  },
  {
    slug: "elegantni",
    name: "Elegantní",
    style: "Elegantní",
    subtitle: "Romantické tóny, serifová typografie, zlaté detaily.",
    description:
      "Pro páry, které chtějí nadčasovou eleganci. Serifové nadpisy, jemné tóny, zlaté akcenty — klasika, která nikdy nevyjde z módy.",
    palette: "from-[#6b4a42] via-[#b08a7a] to-[#5a3a32]",
    coupleName: "Honza & Šárka",
    tagline: "Vás zvou na svoji veselku.",
    date: "12. 6. 2025 • Zámek Liblice",
    previewTone: "romance",
  },
  {
    slug: "klasicka",
    name: "Klasická",
    style: "Klasická",
    subtitle: "Nadčasový styl s důrazem na fotografii a detaily.",
    description:
      "Pro páry, které chtějí klasický svatební web v tradičním pojetí. Důraz na fotky, strukturované informace a přehlednost.",
    palette: "from-[#3e3530] via-[#5c4e45] to-[#2a231f]",
    coupleName: "Anna & Tomáš",
    tagline: "Říkáme si ano.",
    date: "14. 6. 2025 • Zámek Liblice",
    previewTone: "moody",
  },
  {
    slug: "kvetinova",
    name: "Květinová",
    style: "Květinová",
    subtitle: "Rozkvetlé aranže, jemné pastely, romantická nálada.",
    description:
      "Pro romantické páry. Květinové motivy, akvarelové pozadí, pastelové tóny. Ideální pro svatby v přírodě nebo vinařství.",
    palette: "from-[#e8a89a] via-[#c97a6c] to-[#6b3a30]",
    coupleName: "Eliška & Petr",
    tagline: "Bereme se!",
    date: "5. 9. 2025 • Vinařství Sonberk",
    previewTone: "romance",
  },
  {
    slug: "minimalisticka",
    name: "Minimalistická",
    style: "Minimalistická",
    subtitle: "Čisté linie, černobílá paleta, důraz na jednoduchost.",
    description:
      "Pro páry, které oceňují minimalismus a čisté linie. Méně je víc — černobílá paleta, jedna typografie, žádné zbytečnosti.",
    palette: "from-[#2c2a28] via-[#4a4643] to-[#1a1918]",
    coupleName: "Nikola & Filip",
    tagline: "Zveme vás.",
    date: "21. 5. 2025 • Praha",
    previewTone: "moody",
  },
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export const templateStyles: TemplateStyle[] = [
  "Moderní",
  "Hravá",
  "Elegantní",
  "Klasická",
  "Květinová",
  "Minimalistická",
];
