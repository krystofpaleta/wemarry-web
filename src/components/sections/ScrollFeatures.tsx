import { useEffect, useRef, useState } from "react";
import { SITE } from "../../config/site";
import {
  useActiveAnimKey,
  useCountUp,
  usePrefersReducedMotion,
  type VisualProps,
} from "./scroll-features/hooks";

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
                <FeatureVisual step={step} isActive={i === activeStep} />
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

function FeatureVisual({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div
      className={`relative size-full max-w-md rounded-card bg-gradient-to-br ${step.palette} p-8 shadow-prominent`}
    >
      {step.visual === "checklist" && <ChecklistVisual isActive={isActive} />}
      {step.visual === "budget" && <BudgetVisual isActive={isActive} />}
      {step.visual === "website" && <WebsiteVisual isActive={isActive} />}
      {step.visual === "seating" && <SeatingVisual isActive={isActive} />}
      {step.visual === "photos" && <PhotosVisual isActive={isActive} />}
      {step.visual === "vendors" && <VendorsVisual isActive={isActive} />}
    </div>
  );
}

function ChecklistVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const items = [
    { text: "Stanovit datum svatby", done: true },
    { text: "Určit rozpočet", done: true },
    { text: "Vytvořit svatební web", done: false },
    { text: "Rezervovat místo konání", done: false },
    { text: "Rozeslat pozvánky", done: false },
  ];
  const idleDone = 2;
  const finalDone = 5;
  const [doneCount, setDoneCount] = useState(idleDone);

  useEffect(() => {
    if (!isActive) {
      setDoneCount(idleDone);
      return;
    }
    if (reduced) {
      setDoneCount(finalDone);
      return;
    }
    setDoneCount(idleDone);
    const steps = [800, 1500, 2200];
    const timers = steps.map((ms, i) =>
      setTimeout(() => setDoneCount(idleDone + i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [isActive, reduced, animKey]);

  const displayDone = isActive ? doneCount : idleDone;
  const progressPct = (displayDone / items.length) * 100;

  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Checklist</p>
        <span className="rounded-pill bg-sage/20 px-3 py-1 text-tiny uppercase tracking-cta text-ink-body transition-all duration-300">
          {displayDone} / {items.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%`, transformOrigin: "left" }}
        />
      </div>
      <p className="mt-3 text-tiny uppercase tracking-cta text-ink-soft">
        12+ měsíců před svatbou
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((it, i) => {
          const done = i < displayDone;
          return (
            <li
              key={it.text}
              className="flex items-center gap-3"
              style={
                isActive && !reduced && done && i >= idleDone
                  ? { animation: "sf-slide-up 0.35s ease forwards" }
                  : undefined
              }
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done ? "scale-100 border-primary bg-primary" : "scale-100 border-ink/20 bg-white"
                }`}
                style={
                  isActive && !reduced && done && i >= idleDone
                    ? { animation: "sf-pop 0.35s ease forwards" }
                    : undefined
                }
              >
                {done && (
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
                )}
              </span>
              <span
                className={`text-small transition-all duration-300 ${
                  done ? "text-ink-soft line-through" : "text-ink-body"
                }`}
              >
                {it.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BudgetVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);

  const totalBudget = 450000;
  const spentTarget = 312000;
  const remainingTarget = totalBudget - spentTarget;
  const spentPctTarget = Math.round((spentTarget / totalBudget) * 100);

  const spent = useCountUp(spentTarget, isActive, reduced, animKey, 1600);
  const remaining = useCountUp(remainingTarget, isActive, reduced, animKey, 1600);
  const spentPct = useCountUp(spentPctTarget, isActive, reduced, animKey, 1600);

  const categories = [
    { label: "Místo konání", budget: 160000, spent: 160000, color: "bg-primary", delay: 400 },
    { label: "Catering", budget: 115000, spent: 90000, color: "bg-sage", delay: 650 },
    { label: "Fotograf", budget: 65000, spent: 45000, color: "bg-[#d4a78a]", delay: 900 },
    { label: "Dekorace", budget: 55000, spent: 17000, color: "bg-warm-peach", delay: 1150 },
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
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              className="text-ink/5"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              className="text-primary transition-[stroke-dashoffset] duration-300 ease-out"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
            />
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
                <span
                  className={`block h-full origin-left rounded-full ${c.color}`}
                  style={{
                    width: `${pct}%`,
                    transform:
                      isActive && !reduced ? "scaleX(0)" : "scaleX(1)",
                    animation:
                      isActive && !reduced
                        ? `sf-star-fill 0.9s ease ${c.delay}ms forwards`
                        : undefined,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WebsiteVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const [visibleRows, setVisibleRows] = useState(0);
  const [langEn, setLangEn] = useState(false);

  const rsvpRows = [
    { name: "Marie Nováková", status: "Přijde · vegetarián" },
    { name: "Petr Svoboda", status: "Přijde · bez lepku" },
    { name: "Jana Horáková", status: "Přijde · ubytování" },
  ];
  const finalRows = reduced ? rsvpRows.length : visibleRows;

  useEffect(() => {
    if (!isActive) {
      setVisibleRows(0);
      setLangEn(false);
      return;
    }
    if (reduced) {
      setVisibleRows(rsvpRows.length);
      setLangEn(true);
      return;
    }
    setVisibleRows(0);
    setLangEn(false);
    const timers = [
      setTimeout(() => setLangEn(true), 2200),
      setTimeout(() => setLangEn(false), 2800),
      ...rsvpRows.map((_, i) => setTimeout(() => setVisibleRows(i + 1), 900 + i * 550)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isActive, reduced, animKey]);

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-card-sm bg-white p-0 shadow-card">
      <div className="flex items-center gap-1.5 border-b border-ink/5 bg-warm-gray/50 px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="ml-2 flex-1 truncate text-micro text-ink-soft">
          tereza-a-martin.wemarry.cz
        </span>
        <span className="flex gap-1 text-micro">
          <span
            className={`rounded px-1.5 py-0.5 transition-colors ${
              !langEn ? "bg-primary/10 font-medium text-primary" : "text-ink-soft"
            } ${isActive && !reduced && langEn ? "animate-sf-lang-blink" : ""}`}
          >
            CS
          </span>
          <span
            className={`rounded px-1.5 py-0.5 transition-colors ${
              langEn ? "bg-primary/10 font-medium text-primary" : "text-ink-soft"
            }`}
          >
            EN
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="flex flex-col items-center text-center">
          <p className="text-tiny uppercase tracking-cta text-primary">Tereza & Martin</p>
          <p className="mt-1 font-serif text-h4 italic text-ink">12. června 2025</p>
          <p className="text-small text-ink-soft">Zámek Liblice</p>
        </div>
        <div
          className="mt-3 aspect-[5/2] rounded-card-sm bg-gradient-to-br from-warm-peach to-beige-light"
          style={
            isActive && !reduced
              ? { animation: "sf-pop 0.6s ease forwards" }
              : undefined
          }
        />
        <div className="mt-3 flex-1 overflow-hidden">
          <p className="text-tiny uppercase tracking-cta text-ink-soft">RSVP odpovědi</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {rsvpRows.map((row, i) => {
              const show = i < finalRows;
              return (
                <li
                  key={row.name}
                  className={`flex items-center justify-between rounded-input border border-beige-border px-2.5 py-1.5 transition-all duration-300 ${
                    show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={
                    show && isActive && !reduced
                      ? { animation: `sf-slide-up 0.4s ease ${i * 0.05}s forwards` }
                      : undefined
                  }
                >
                  <div>
                    <p className="text-micro font-medium text-ink">{row.name}</p>
                    <p className="text-tiny text-ink-soft">{row.status}</p>
                  </div>
                  <span className="flex items-center gap-1 text-tiny font-medium text-primary">
                    <svg
                      viewBox="0 0 12 12"
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 6.5L5 9L10 3.5" />
                    </svg>
                    Potvrzeno
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SeatingVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const [guestSeated, setGuestSeated] = useState(false);
  const [tablesVisible, setTablesVisible] = useState(reduced);

  useEffect(() => {
    if (!isActive) {
      setGuestSeated(false);
      setTablesVisible(false);
      return;
    }
    if (reduced) {
      setGuestSeated(true);
      setTablesVisible(true);
      return;
    }
    setGuestSeated(false);
    setTablesVisible(false);
    const t1 = setTimeout(() => setTablesVisible(true), 300);
    const t2 = setTimeout(() => setGuestSeated(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, reduced, animKey]);

  const tablePositions = [
    { top: "38%", left: "16%" },
    { top: "38%", left: "58%" },
    { top: "72%", left: "38%" },
  ];
  const showTables = !isActive || tablesVisible;

  return (
    <div className="relative flex size-full flex-col rounded-card-sm bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Zasedací pořádek</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          68 hostů
        </span>
      </div>

      <div className="mt-3 flex flex-1 gap-3 overflow-hidden">
        {/* Guest sidebar */}
        <div className="flex w-[72px] shrink-0 flex-col gap-2 border-r border-beige-border pr-2">
          <p className="text-tiny uppercase tracking-cta text-ink-soft">Hosté</p>
          <div className="relative">
            {!guestSeated && (
              <span
                key={isActive ? animKey : "idle"}
                className={`block rounded-pill bg-primary/10 px-2 py-1 text-tiny font-medium text-primary ${
                  isActive && !reduced && !guestSeated ? "animate-sf-guest-to-seat" : ""
                }`}
              >
                Marie N.
              </span>
            )}
            {guestSeated && isActive && (
              <span className="block rounded-pill border border-dashed border-ink/15 px-2 py-1 text-tiny text-ink-soft">
                + host
              </span>
            )}
          </div>
        </div>

        {/* Floor plan */}
        <div className="relative flex-1">
          <div className="absolute left-1/2 top-2 flex -translate-x-1/2 flex-col items-center">
            <HeartIcon />
            <span className="mt-0.5 text-micro text-ink-soft">Obřad</span>
          </div>

          {tablePositions.map((pos, i) => (
            <div
              key={i}
              className={`absolute flex size-[4.5rem] items-center justify-center transition-all duration-500 ease-out ${
                showTables ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-90 opacity-0"
              }`}
              style={{
                top: pos.top,
                left: pos.left,
                transitionDelay: reduced ? "0ms" : `${i * 120}ms`,
              }}
            >
              <div className="relative size-full">
                {[0, 1, 2, 3, 4, 5].map((s) => {
                  const angle = (s / 6) * 2 * Math.PI - Math.PI / 2;
                  const r = 34;
                  const x = 36 + r * Math.cos(angle);
                  const y = 36 + r * Math.sin(angle);
                  const isTarget = i === 1 && s === 2;
                  const filled = isTarget && guestSeated && isActive;
                  return (
                    <span
                      key={s}
                      className={`absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[7px] font-medium transition-all duration-300 ${
                        filled
                          ? "border-primary bg-primary text-white"
                          : "border-beige-border bg-white text-ink-soft"
                      }`}
                      style={{
                        left: x,
                        top: y,
                        animation:
                          filled && !reduced
                            ? "sf-seat-fill 0.35s ease forwards"
                            : undefined,
                      }}
                    >
                      {filled ? "MN" : ""}
                    </span>
                  );
                })}
                <div className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-warm-gray ring-1 ring-beige-border">
                  <span className="text-micro font-medium text-ink-body">{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 text-primary"
      fill="currentColor"
      fillOpacity={0.15}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function PhotosVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const [visibleCount, setVisibleCount] = useState(reduced ? 6 : 0);

  const tiles = [
    { palette: "from-[#f5d9d2] to-[#e8a89a]" },
    { palette: "from-[#d4e3d0] to-[#a6c1a7]" },
    { palette: "from-[#edd4cb] to-[#d4b6a8]" },
    { palette: "from-[#e4dde8] to-[#c0b4cc]" },
    { palette: "from-[#f9f0eb] to-[#e8d6c8]" },
    { palette: "from-[#d4b8a4] to-[#8a6a54]" },
  ];

  useEffect(() => {
    if (!isActive) {
      setVisibleCount(0);
      return;
    }
    if (reduced) {
      setVisibleCount(tiles.length);
      return;
    }
    setVisibleCount(0);
    const timers = tiles.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 400 + i * 180),
    );
    return () => timers.forEach(clearTimeout);
  }, [isActive, reduced, animKey]);

  const shown = isActive ? visibleCount : tiles.length;

  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Galerie</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          {isActive && visibleCount > 0 ? visibleCount : 128} fotek
        </span>
      </div>

      <div className="relative mt-5 flex-1">
        <div className="grid h-full grid-cols-3 gap-2">
          {tiles.map((t, i) => {
            const visible = i < shown;
            return (
              <div
                key={i}
                className={`rounded-card-sm bg-gradient-to-br ${t.palette} transition-all duration-300 ${
                  visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
                style={
                  visible && isActive && !reduced && i < shown
                    ? { animation: `sf-pop 0.4s ease ${i * 0.08}s forwards` }
                    : undefined
                }
              />
            );
          })}
        </div>

        <div
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-card-sm bg-white p-4 text-center shadow-prominent ${
            isActive && !reduced ? "animate-sf-pulse-soft" : ""
          }`}
        >
          <QrIcon />
          <div className="flex flex-col items-center">
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

function VendorsVisual({ isActive }: VisualProps) {
  const reduced = usePrefersReducedMotion();
  const animKey = useActiveAnimKey(isActive);
  const [visibleCards, setVisibleCards] = useState(0);
  const [starsFilled, setStarsFilled] = useState(false);

  const vendors = [
    { name: "Marie Nováková", role: "Fotografka", rating: "5.0", initials: "MN", color: "bg-warm-peach" },
    { name: "Atelier Květ", role: "Floristika", rating: "4.9", initials: "AK", color: "bg-sage/40" },
    { name: "Jakub Dvořák", role: "DJ & hudba", rating: "4.8", initials: "JD", color: "bg-beige-light" },
  ];

  useEffect(() => {
    if (!isActive) {
      setVisibleCards(0);
      setStarsFilled(false);
      return;
    }
    if (reduced) {
      setVisibleCards(vendors.length);
      setStarsFilled(true);
      return;
    }
    setVisibleCards(0);
    setStarsFilled(false);
    const cardTimers = vendors.map((_, i) =>
      setTimeout(() => setVisibleCards(i + 1), 350 + i * 280),
    );
    const starTimer = setTimeout(() => setStarsFilled(true), 1200);
    return () => {
      cardTimers.forEach(clearTimeout);
      clearTimeout(starTimer);
    };
  }, [isActive, reduced, animKey]);

  const shown = isActive ? visibleCards : vendors.length;
  const fillStars = !isActive || reduced || starsFilled;

  return (
    <div className="flex size-full flex-col rounded-card-sm bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-serif text-h4 text-ink">Katalog dodavatelů</p>
        <span className="rounded-pill bg-primary/10 px-3 py-1 text-tiny uppercase tracking-cta text-primary">
          Ověřeno
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {vendors.map((v, i) => {
          const show = i < shown;
          return (
            <li
              key={v.name}
              className={`flex items-center gap-4 rounded-card-sm border border-beige-border bg-cream/50 p-3 transition-all duration-400 ${
                show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={
                show && isActive && !reduced
                  ? { animation: `sf-slide-up 0.45s ease ${i * 0.1}s forwards` }
                  : undefined
              }
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${v.color} font-serif text-h4 text-ink`}
              >
                {v.initials}
              </span>
              <div className="flex-1">
                <p className="text-small font-medium text-ink">{v.name}</p>
                <p className="text-tiny text-ink-soft">{v.role}</p>
              </div>
              <div className="relative flex items-center gap-1">
                <svg
                  viewBox="0 0 20 20"
                  className="size-3.5 text-ink/15"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 1.5l2.472 5.01 5.528.804-4 3.9.944 5.506L10 14.127 5.056 16.72l.944-5.506-4-3.9 5.528-.804L10 1.5z" />
                </svg>
                <svg
                  viewBox="0 0 20 20"
                  className="absolute left-0 size-3.5 origin-left text-primary"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{
                    clipPath: fillStars ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                    transition: reduced ? "none" : "clip-path 0.6s ease",
                    transitionDelay: reduced ? "0ms" : `${800 + i * 150}ms`,
                  }}
                >
                  <path d="M10 1.5l2.472 5.01 5.528.804-4 3.9.944 5.506L10 14.127 5.056 16.72l.944-5.506-4-3.9 5.528-.804L10 1.5z" />
                </svg>
                <span className="text-tiny font-medium text-ink">{v.rating}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
