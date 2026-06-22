import { useCallback, useRef, useState } from "react";
import { templates, type Template } from "../../data/templates";

/**
 * Galerie šablon svatebních webů — "Apple-style" sticky scroll (React island).
 * Vertikální scroll stránky řídí horizontální carousel šablon.
 *
 * Data se nově berou ze sdíleného src/data/templates.ts (splacený dluh z HANDOFFu —
 * dřív měla komponenta vlastní hardcoded kopii).
 *
 * TODO: Placeholder gradienty nahradit reálnými fotkami z Figmy.
 */

export default function TemplatesGallery() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Posun carouselu na konkrétní kartu (šipky / tečky). Žádné navázání na scroll stránky.
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(templates.length - 1, i));
    const track = trackRef.current;
    if (track) {
      const cards = track.querySelectorAll<HTMLElement>("[data-template-card]");
      const card = cards[clamped];
      if (card) {
        const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
        track.scrollTo({ left: target, behavior: "smooth" });
      }
    }
    setActiveIndex(clamped);
  };

  // Při ručním swipu synchronizuj zvýrazněnou kartu podle středu viewportu tracku.
  const handleTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const cards = track.querySelectorAll<HTMLElement>("[data-template-card]");
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const cc = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cc - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActiveIndex((prev) => (prev === best ? prev : best));
  }, []);

  return (
    <section
      className="relative isolate bg-gradient-to-b from-warm-peach/25 via-cream/40 to-white py-20 md:py-28"
      aria-label="Šablony svatebních webů"
    >
      <div className="container-site">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="font-serif text-h2 text-ink md:text-hero-sm">
            5 minut práce a váš svatební web je hotový
          </h2>
          <p className="max-w-2xl text-small text-ink-muted md:text-body">
            Díky praktickým funkcím proběhne vaše svatba hladce a bez stresu.
            Aplikace pak sama automaticky sesbírá odpovědi o účasti vašich hostů.
          </p>
        </div>
      </div>

      <div className="relative mt-10 md:mt-12">
        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div aria-hidden="true" className="shrink-0 basis-[10%] md:basis-[20%]" />
          {templates.map((t, i) => (
            <TemplateCard key={t.slug} template={t} isActive={i === activeIndex} />
          ))}
          <div aria-hidden="true" className="shrink-0 basis-[10%] md:basis-[20%]" />
        </div>
      </div>

      <div className="container-site mt-8 flex flex-col items-center gap-4 md:mt-10">
        <div className="flex items-center gap-2">
          {templates.map((t, i) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Přejít na šablonu ${t.name}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-10 bg-primary" : "w-5 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <CarouselBtn direction="prev" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} />
          <span className="text-tiny uppercase tracking-cta text-ink-soft">
            {String(activeIndex + 1).padStart(2, "0")} / {String(templates.length).padStart(2, "0")}
          </span>
          <CarouselBtn direction="next" disabled={activeIndex === templates.length - 1} onClick={() => goTo(activeIndex + 1)} />
        </div>
      </div>
    </section>
  );
}

function TemplateCard({ template, isActive }: { template: Template; isActive: boolean }) {
  return (
    <article
      data-template-card
      className={`group relative shrink-0 basis-[75%] snap-center overflow-hidden rounded-card transition-all duration-500 ease-out sm:basis-[52%] lg:basis-[44%] ${
        isActive ? "opacity-100 shadow-prominent scale-100" : "opacity-60 shadow-card scale-[0.88]"
      }`}
    >
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${template.palette}`}>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,_rgba(255,220,180,0.18)_0%,_transparent_55%)]" />

        <div className="absolute left-0 right-0 top-0 flex flex-col gap-3 p-6 text-white md:gap-4 md:p-8">
          <h3 className="font-serif text-h2 text-white md:text-hero-sm">{template.name}</h3>
          <p className="max-w-md text-small text-white/85 md:text-body">{template.subtitle}</p>
          <a
            href={`/sablony/${template.slug}`}
            className="mt-2 inline-flex w-fit items-center rounded-pill bg-white px-6 py-3 text-micro uppercase tracking-cta text-ink transition-colors hover:bg-white/90"
          >
            Prohlédnout
          </a>
        </div>

        <div
          className={`absolute bottom-[-12%] left-1/2 w-[62%] -translate-x-1/2 transition-all duration-500 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="rounded-[18px] bg-[#1a1a1a] p-1.5 shadow-prominent md:rounded-[22px] md:p-2">
            <div className="overflow-hidden rounded-[12px] bg-white md:rounded-[14px]">
              <WebsitePreview template={template} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function WebsitePreview({ template }: { template: Template }) {
  const tone = template.previewTone;

  const bgClass =
    tone === "moody"
      ? "from-[#3a2f28] via-[#5a4a42] to-[#1f1a16]"
      : tone === "light"
        ? "from-[#f0e4db] via-[#e8d4c4] to-[#d4b8a4]"
        : "from-[#6b3a30] via-[#b08a7a] to-[#4a2520]";

  const textColor = tone === "light" ? "text-ink" : "text-white";
  const subTextColor = tone === "light" ? "text-ink-muted" : "text-white/80";

  return (
    <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${bgClass} flex flex-col`}>
      <div className="flex items-center justify-between px-3 py-2">
        <span className={`font-serif text-[9px] italic md:text-[11px] ${textColor}`}>
          {template.coupleName.split(" & ")[0]}ovi
        </span>
        <div className="hidden items-center gap-2 md:flex">
          {["Úvod", "Kdy a kde", "Program", "RSVP"].map((m) => (
            <span key={m} className={`text-[7px] uppercase tracking-cta ${subTextColor}`}>
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-3 text-center">
        <p className={`font-serif italic ${textColor} text-sm md:text-lg lg:text-xl`}>
          {template.coupleName}
        </p>
        <p className={`mt-1 max-w-[85%] font-serif italic ${textColor} text-[11px] leading-snug md:text-sm lg:text-base`}>
          {template.tagline}
        </p>
        <p className={`mt-1.5 text-[8px] md:text-[9px] ${subTextColor}`}>{template.date}</p>
      </div>

      <div className="flex justify-center px-3 pb-2">
        <span className={`rounded-pill border border-white/30 px-2.5 py-1 text-[7px] uppercase tracking-cta ${textColor}`}>
          Potvrdit účast
        </span>
      </div>
    </div>
  );
}

function CarouselBtn({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Předchozí šablona" : "Další šablona"}
      className="flex size-10 items-center justify-center rounded-full border border-beige-border bg-white text-ink shadow-card transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-beige-border disabled:hover:text-ink"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-4 ${direction === "prev" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </button>
  );
}
