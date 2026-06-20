import { useEffect, useRef, useState } from "react";
import { SITE } from "../../config/site";

/**
 * "Apple-style" sticky scroll sekce (React island).
 * Sekce se přišpendlí na viewport, obsah se mění podle pozice scrollu.
 *  - Vnější <section> má výšku (STEPS * 100vh).
 *  - Vnitřní <div> má position: sticky, top: 0, h-screen.
 *  - Scroll listener počítá progress (0..1) a z toho activeStep.
 */

type Step = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  palette: string;
  visual: "checklist" | "budget" | "website" | "seating" | "photos" | "vendors";
  /** Odkaz na detailní feature stránku (Zjistit víc). */
  href?: string;
};

const steps: Step[] = [
  {
    eyebrow: "01 — Checklist",
    title: "Checklist od zkušené koordinátorky.",
    description:
      "Žádný úkol už nebudete nosit v hlavě. Checklist sestavený zkušenou svatební koordinátorkou vás provede vším od prvního kroku až po poděkování hostům — interaktivní, odškrtávací, navržený podle reálných svateb.",
    bullets: [
      "Přednastavené úkoly rozdělené podle fáze plánování",
      "Vlastní úkoly s deadliny a poznámkami",
      "Sdílení s partnerem i koordinátorkou v reálném čase",
    ],
    palette: "from-[#f5e8e0] via-[#e8c9b8] to-[#d4a894]",
    visual: "checklist",
    href: "/svatebni-checklist",
  },
  {
    eyebrow: "02 — Rozpočet",
    title: "Kalkulačka, která vám pohlídá každou korunu.",
    description:
      "Kalkulačka nákladů vám ohlídá svatební rozpočet do poslední koruny. Mějte přehled o všech výdajích, zaplacených zálohách i zbývajících doplatcích — všechno na jednom místě.",
    bullets: [
      "Rozdělení do kategorií (místo, catering, fotograf…)",
      "Sledování záloh, doplatků a termínů plateb",
      "Okamžitý přehled utraceno / zbývá",
    ],
    palette: "from-[#e8ebe0] via-[#c8d4b8] to-[#9bb59a]",
    visual: "budget",
    href: "/svatebni-rozpocet",
  },
  {
    eyebrow: "03 — Svatební web & RSVP",
    title: "Vlastní svatební web za 5 minut.",
    description:
      "Vytvořte si během pár minut svatební web s RSVP formulářem. Hosté se sami přihlásí, potvrdí účast, dají vědět o dietních preferencích nebo požadavku na ubytování. Ušetříte si desítky opakujících se telefonátů.",
    bullets: [
      "RSVP formulář s dietami, písničkami a ubytováním",
      "Vícejazyčná verze webu jedním kliknutím",
      "Automatický sběr odpovědí + export hostů",
    ],
    palette: "from-[#f0e4db] via-[#d8b8a4] to-[#b08a75]",
    visual: "website",
    href: "/svatebni-web",
  },
  {
    eyebrow: "04 — Zasedací pořádek",
    title: "Posouvejte stoly, dokud neklapne každý detail.",
    description:
      "Interaktivní drag & drop plánovač napojený přímo na RSVP. Přidávejte stoly všech tvarů, přesunujte hosty — a jakmile někdo potvrdí účast, automaticky přiskočí do seznamu k usazení.",
    bullets: [
      "Všechny tvary stolů (kulatý, obdélníkový, banket…)",
      "Automatické napojení na RSVP odpovědi",
      "Stáhnutí a tisk finální verze jedním klikem",
    ],
    palette: "from-[#f5d9d2] via-[#e8a89a] to-[#c37768]",
    visual: "seating",
    href: "/zasedaci-poradek",
  },
  {
    eyebrow: "05 — Sdílená fotogalerie",
    title: "Svatba žije dál v galerii pro hosty.",
    description:
      "V den svatby se váš svatební web promění v živou galerii. Hosté přes QR kód nahrávají momentky přímo z mobilu, vy později přidáte profesionální snímky od fotografa. Vše dostupné kdykoliv a kdekoliv.",
    bullets: [
      "Sdílení a nahrávání fotek přes QR kód",
      "Nahrání profi fotek od fotografa do stejné galerie",
      "Jedna adresa — sdílíte se všemi hosty",
    ],
    palette: "from-[#e4dde8] via-[#c0b4cc] to-[#8a7a9c]",
    visual: "photos",
  },
  {
    eyebrow: "06 — Katalog dodavatelů",
    title: "Ověření fotografové, floristky i designéři.",
    description:
      "Hned po zaplacení získáte doporučení na ověřené dodavatele, kteří už spolupracovali s páry jako vy. Ušetříte si týdny hledání, čtení recenzí a srovnávání cen — nabídka přichází na míru vaší svatbě.",
    bullets: [
      "Ručně vybraní a ověření dodavatelé",
      "Doporučení na míru stylu vaší svatby",
      "Kontakt přímo z aplikace, bez hledání na webu",
    ],
    palette: "from-[#e8dfd4] via-[#c9b89f] to-[#8a7459]",
    visual: "vendors",
  },
];

export default function ScrollFeatures() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollable = rect.height - viewportH;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      setActiveStep(idx);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-warm-gray/40"
      style={{ height: `${steps.length * 100}vh` }}
      aria-label="Funkce WeMarry"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-site grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — text + step indicator */}
          <div className="flex flex-col gap-8">
            <p className="text-tiny uppercase tracking-cta text-primary">
              Vše, co svatba potřebuje
            </p>

            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeStep
                      ? "w-12 bg-primary"
                      : i < activeStep
                        ? "w-8 bg-primary/40"
                        : "w-8 bg-ink/15"
                  }`}
                />
              ))}
            </div>

            <div className="relative min-h-[420px] md:min-h-[440px]">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  aria-hidden={i !== activeStep}
                  className={`absolute inset-0 flex flex-col gap-5 transition-all duration-500 ${
                    i === activeStep
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-4 opacity-0"
                  }`}
                >
                  <p className="text-tiny uppercase tracking-cta text-ink-soft">
                    {step.eyebrow}
                  </p>
                  <h2 className="font-serif text-hero-sm text-ink md:text-hero">
                    {step.title}
                  </h2>
                  <p className="max-w-lg text-body text-ink-muted">
                    {step.description}
                  </p>
                  <ul className="mt-2 flex flex-col gap-3">
                    {step.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-body text-ink-body"
                      >
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sage"
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className="size-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.5 6.5L5 9L10 3.5" />
                          </svg>
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center gap-5">
                    <a href={SITE.app.signup} className="btn-primary">
                      Vyzkoušet zdarma
                    </a>
                    {step.href && (
                      <a
                        href={step.href}
                        className="text-micro uppercase tracking-cta text-primary transition-colors hover:text-primary-hover"
                      >
                        Zjistit víc →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative h-[440px] w-full md:h-[520px]">
            {steps.map((step, i) => (
              <div
                key={step.title}
                aria-hidden={i !== activeStep}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                  i === activeStep
                    ? "translate-y-0 opacity-100 scale-100"
                    : "pointer-events-none translate-y-6 opacity-0 scale-95"
                }`}
              >
                <FeatureVisual step={step} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500 ${
          progress > 0.05 || progress === 0 ? "opacity-0" : "opacity-80"
        }`}
      >
        <span className="text-tiny uppercase tracking-cta text-ink-soft">
          Scrollujte ↓
        </span>
      </div>
    </section>
  );
}

function FeatureVisual({ step }: { step: Step }) {
  return (
    <div
      className={`relative size-full max-w-md rounded-card bg-gradient-to-br ${step.palette} p-8 shadow-prominent`}
    >
      {step.visual === "checklist" && <ChecklistVisual />}
      {step.visual === "budget" && <BudgetVisual />}
      {step.visual === "website" && <WebsiteVisual />}
      {step.visual === "seating" && <SeatingVisual />}
      {step.visual === "photos" && <PhotosVisual />}
      {step.visual === "vendors" && <VendorsVisual />}
    </div>
  );
}

function ChecklistVisual() {
  const items = [
    { text: "Zamluvit místo obřadu", done: true },
    { text: "Objednat fotografa", done: true },
    { text: "Vybrat svatební šaty", done: true },
    { text: "Rozeslat pozvánky", done: false },
    { text: "Finalizovat menu", done: false },
  ];
  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Checklist</p>
        <span className="rounded-pill bg-sage/20 px-3 py-1 text-tiny uppercase tracking-cta text-ink-body">
          3 / 5
        </span>
      </div>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.text} className="flex items-center gap-3">
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                it.done ? "border-sage bg-sage" : "border-ink/20 bg-white"
              }`}
            >
              {it.done && (
                <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.5L5 9L10 3.5" />
                </svg>
              )}
            </span>
            <span
              className={`text-small ${
                it.done ? "text-ink-soft line-through" : "text-ink-body"
              }`}
            >
              {it.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BudgetVisual() {
  const totalBudget = 450000;
  const spent = 312000;
  const remaining = totalBudget - spent;
  const spentPct = Math.round((spent / totalBudget) * 100);

  const categories = [
    { label: "Místo konání", budget: 160000, spent: 160000, color: "bg-primary" },
    { label: "Catering", budget: 115000, spent: 90000, color: "bg-sage" },
    { label: "Fotograf", budget: 65000, spent: 45000, color: "bg-[#d4a78a]" },
    { label: "Dekorace", budget: 55000, spent: 17000, color: "bg-warm-peach" },
  ];

  const size = 112;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (spentPct / 100) * circumference;

  const fmt = (n: number) => `${n.toLocaleString("cs-CZ").replace(/,/g, " ")} Kč`;

  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-tiny uppercase tracking-cta text-ink-soft">
            Svatební rozpočet
          </p>
          <p className="mt-1 font-serif text-h3 text-ink">{fmt(totalBudget)}</p>
        </div>
        <span className="rounded-pill bg-sage/20 px-3 py-1 text-tiny uppercase tracking-cta text-sage-deep">
          V plánu
        </span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" className="text-ink/5" strokeWidth={stroke} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" className="text-primary" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" fill="none" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-h3 text-ink leading-none">{spentPct}%</span>
            <span className="text-tiny text-ink-soft">utraceno</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-small text-ink-body">
              <span className="size-2.5 rounded-full bg-primary" />
              Utraceno
            </span>
            <span className="text-small font-medium text-ink">{fmt(spent)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-small text-ink-body">
              <span className="size-2.5 rounded-full bg-ink/15" />
              Zbývá
            </span>
            <span className="text-small font-medium text-ink">{fmt(remaining)}</span>
          </div>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-3.5 border-t border-beige-border pt-5">
        {categories.map((c) => {
          const pct = Math.min(100, Math.round((c.spent / c.budget) * 100));
          return (
            <li key={c.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-small text-ink-body">
                  <span className={`size-2.5 rounded-full ${c.color}`} />
                  {c.label}
                </span>
                <span className="text-tiny text-ink-soft">
                  {fmt(c.spent)}{" "}
                  <span className="text-ink-light">/ {fmt(c.budget)}</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                <span className={`block h-full rounded-full ${c.color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-0 shadow-card overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-ink/5 bg-warm-gray/50 px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="ml-2 text-micro text-ink-soft">tereza-a-martin.wemarry.cz</span>
      </div>
      <div className="flex-1 p-5">
        <div className="flex flex-col items-center text-center">
          <p className="text-tiny uppercase tracking-cta text-primary">Tereza & Martin</p>
          <p className="mt-2 font-serif text-h4 italic text-ink">12. června 2025</p>
          <p className="text-small text-ink-soft">Zámek Liblice</p>
        </div>
        <div className="mt-5 aspect-[4/3] rounded-card-sm bg-gradient-to-br from-warm-peach to-beige-light" />
        <div className="mt-5">
          <p className="text-tiny uppercase tracking-cta text-ink-soft">Potvrďte účast</p>
          <div className="mt-2 flex h-9 items-center justify-center rounded-pill bg-primary">
            <span className="text-tiny uppercase tracking-cta text-white">Odpovědět na RSVP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeatingVisual() {
  return (
    <div className="relative flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Zasedací pořádek</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          68 hostů
        </span>
      </div>
      <div className="relative mt-6 flex flex-1 items-center justify-center">
        <div className="absolute left-1/2 top-6 flex -translate-x-1/2 flex-col items-center">
          <div className="h-6 w-32 rounded-card-sm bg-primary/80" />
          <span className="mt-1 text-micro text-ink-soft">Hlavní stůl</span>
        </div>
        {[
          { top: "35%", left: "18%" },
          { top: "35%", left: "62%" },
          { top: "70%", left: "10%" },
          { top: "75%", left: "45%" },
          { top: "70%", left: "75%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute flex size-16 items-center justify-center rounded-full bg-sage/30 ring-2 ring-sage/60"
            style={{ top: pos.top, left: pos.left }}
          >
            <span className="text-micro text-ink-body">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotosVisual() {
  const tiles = [
    { palette: "from-[#f5d9d2] to-[#e8a89a]" },
    { palette: "from-[#d4e3d0] to-[#a6c1a7]" },
    { palette: "from-[#edd4cb] to-[#d4b6a8]" },
    { palette: "from-[#e4dde8] to-[#c0b4cc]" },
    { palette: "from-[#f9f0eb] to-[#e8d6c8]" },
    { palette: "from-[#d4b8a4] to-[#8a6a54]" },
  ];
  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Galerie</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          128 fotek
        </span>
      </div>

      <div className="relative mt-5 flex-1">
        <div className="grid h-full grid-cols-3 gap-2">
          {tiles.map((t, i) => (
            <div key={i} className={`rounded-card-sm bg-gradient-to-br ${t.palette}`} />
          ))}
        </div>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-card-sm bg-white p-3 shadow-prominent">
          <QrIcon />
          <div className="flex flex-col">
            <p className="text-tiny uppercase tracking-cta text-ink-soft">Naskenujte</p>
            <p className="font-serif text-small text-ink">Přidat fotku</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QrIcon() {
  return (
    <div className="grid size-10 grid-cols-4 grid-rows-4 gap-[2px] rounded-sm bg-white p-0.5">
      {[1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0].map((v, i) => (
        <span key={i} className={`rounded-[1px] ${v ? "bg-ink" : "bg-white"}`} />
      ))}
    </div>
  );
}

function VendorsVisual() {
  const vendors = [
    { name: "Marie Nováková", role: "Fotografka", rating: "5.0", initials: "MN", color: "bg-warm-peach" },
    { name: "Atelier Květ", role: "Floristika", rating: "4.9", initials: "AK", color: "bg-sage/40" },
    { name: "Jakub Dvořák", role: "DJ & hudba", rating: "4.8", initials: "JD", color: "bg-beige-light" },
  ];
  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Katalog dodavatelů</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          Ověřeno
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {vendors.map((v) => (
          <li key={v.name} className="flex items-center gap-4 rounded-card-sm border border-beige-border bg-cream/50 p-3">
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${v.color} font-serif text-h4 text-ink`}>
              {v.initials}
            </span>
            <div className="flex-1">
              <p className="text-small font-medium text-ink">{v.name}</p>
              <p className="text-tiny text-ink-soft">{v.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 20 20" className="size-3.5 text-primary" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.472 5.01 5.528.804-4 3.9.944 5.506L10 14.127 5.056 16.72l.944-5.506-4-3.9 5.528-.804L10 1.5z" />
              </svg>
              <span className="text-tiny font-medium text-ink">{v.rating}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
