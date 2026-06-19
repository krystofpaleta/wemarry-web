/**
 * i18n — slovníky a konfigurace jazyků.
 *
 * Web je dnes provozovaný v češtině. Infrastruktura je ale připravená
 * „na klik“: přidání jazyka = doplnit locale do `locales` v astro.config,
 * přidat klíč do `ui` níže a vytvořit obsahové stránky pod /src/pages/<lang>/.
 *
 * `enabledLocales` řídí, které jazyky se zobrazí v přepínači v hlavičce —
 * jakmile bude hotový anglický obsah, stačí sem přidat "en".
 */

export const defaultLocale = "cs" as const;

export const locales = ["cs", "en"] as const;
export type Locale = (typeof locales)[number];

/** Jazyky aktivní v přepínači. Rozšiř, až bude obsah přeložený. */
export const enabledLocales: Locale[] = ["cs"];

export const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
};

/** Krátké chrome stringy (navigace, patička, CTA). Marketing copy zůstává v šablonách. */
export const ui = {
  cs: {
    "nav.howItWorks": "Jak to funguje",
    "nav.templates": "Šablony",
    "nav.pricing": "Ceník",
    "nav.faq": "FAQ",
    "nav.blog": "Blog",
    "nav.contact": "Kontakt",
    "cta.tryFree": "Vyzkoušet zdarma",
    "cta.login": "Přihlásit se",
    "menu.label": "Menu",
  },
  en: {
    "nav.howItWorks": "How it works",
    "nav.templates": "Templates",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.tryFree": "Try for free",
    "cta.login": "Log in",
    "menu.label": "Menu",
  },
} as const;

export type UIKey = keyof (typeof ui)["cs"];

/** Vrátí překladovou funkci pro daný jazyk (fallback na default locale). */
export function useTranslations(locale: Locale = defaultLocale) {
  return function t(key: UIKey): string {
    return ui[locale]?.[key] ?? ui[defaultLocale][key];
  };
}
