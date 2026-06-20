/**
 * WeMarry design system
 * Tokeny vytažené z Figma souboru WeMarry-Base (HP V3_winner).
 * Jediné místo pravdy — komponenty nepoužívají hardcoded hodnoty.
 * Přeneseno 1:1 z Next.js prototypu (tailwind.config.ts), upraveny jen content paths.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  // ScrollFeatures animace aplikované přes inline style (dynamický stagger delay)
  // se v contentu neobjeví jako animate-* třídy — safelist donutí Tailwind
  // vygenerovat jejich @keyframes do CSS, jinak by tiše nejely.
  safelist: [
    "animate-sf-pop",
    "animate-sf-slide-up",
    "animate-sf-seat-fill",
    "animate-sf-star-fill",
  ],
  theme: {
    extend: {
      colors: {
        // Primary / CTA
        primary: {
          DEFAULT: "#0c948c",
          hover: "#0a7f78",
        },
        // Sage accents (checkmark backgrounds, badges)
        sage: {
          DEFAULT: "#a6c1a7",
          deep: "#385647",
        },
        // Warm surface tones
        cream: "#fffdfc",
        beige: {
          light: "#f9f0eb",
          DEFAULT: "#f8ebe6",
          border: "#f2edeb",
        },
        warm: {
          gray: "#f8f5f4",
          peach: "#edd4cb",
        },
        // Text scale
        ink: {
          DEFAULT: "#000000",
          body: "#454545",
          muted: "#585858",
          soft: "#7a7a7a",
          light: "#a3a3a3",
        },
        neutral: {
          gray: "#bfbfbf",
          bg: "#f1f1f1",
          lighter: "#f2f2f2",
        },
      },
      fontFamily: {
        // Serif pro nadpisy. Orpheus Pro (logo) zatím jako fallback na Cormorant/Lora —
        // k výměně na Adobe Fonts "Orpheus Pro" při deployi.
        serif: ["Lora", "Georgia", "serif"],
        logo: ["Cormorant", "Lora", "Georgia", "serif"],
        // Sans pro body, UI
        sans: ["Jost", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Design-specific sizes (px → rem)
        "hero-xl": ["2.75rem", { lineHeight: "1.2" }], // 44px
        hero: ["2rem", { lineHeight: "1.2" }], // 32px
        "hero-sm": ["1.75rem", { lineHeight: "1.2" }], // 28px mobile hero
        h2: ["1.5rem", { lineHeight: "1.3" }], // 24px
        h3: ["1.25rem", { lineHeight: "1.4" }], // 20px
        h4: ["1.125rem", { lineHeight: "1.4" }], // 18px
        body: ["1rem", { lineHeight: "1.7" }], // 16px
        small: ["0.875rem", { lineHeight: "1.6" }], // 14px
        micro: ["0.8125rem", { lineHeight: "1.6" }], // 13px — CTA, nav
        tiny: ["0.75rem", { lineHeight: "1.6" }], // 12px — labels
      },
      letterSpacing: {
        nav: "0.125em", // 2px
        cta: "0.2em", // 2.6px / 3.25px @13px — uppercase buttons
        label: "0.3em", // 3.9px — chart labels
      },
      borderRadius: {
        pill: "200px",
        card: "24px",
        "card-md": "20px",
        "card-sm": "16px",
        input: "12px",
        mini: "10px",
      },
      boxShadow: {
        card: "0px 1px 2px 0px rgba(0,0,0,0.1)",
        "card-hover": "0px 0px 10px 0px rgba(0,0,0,0.11)",
        soft: "0px 0px 20px 0px rgba(0,0,0,0.06)",
        prominent: "0px 0px 30px 0px rgba(0,0,0,0.1)",
        warm: "0px 2px 2px 0px #f8f5f4",
      },
      spacing: {
        // Běžné hodnoty navíc k defaultu
        18: "4.5rem", // 72px
        30: "7.5rem", // 120px
      },
      maxWidth: {
        content: "1360px",
        container: "1440px",
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.35))",
      },
      keyframes: {
        "sf-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sf-slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "sf-pulse-soft": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "sf-guest-to-seat": {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
          "40%": { transform: "translate(-28px, -18px) scale(1.08)", opacity: "1" },
          "70%": { transform: "translate(-52px, -42px) scale(0.95)", opacity: "1" },
          "100%": { transform: "translate(-52px, -42px) scale(1)", opacity: "0" },
        },
        "sf-seat-fill": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sf-lang-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "sf-star-fill": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "sf-pop": "sf-pop 0.4s ease forwards",
        "sf-slide-up": "sf-slide-up 0.45s ease forwards",
        "sf-pulse-soft": "sf-pulse-soft 2.4s ease-in-out infinite",
        "sf-guest-to-seat": "sf-guest-to-seat 1.8s ease-in-out forwards",
        "sf-seat-fill": "sf-seat-fill 0.35s ease forwards",
        "sf-lang-blink": "sf-lang-blink 0.6s ease 2.2s 2",
        "sf-star-fill": "sf-star-fill 0.7s ease forwards",
      },
    },
  },
  plugins: [],
};
