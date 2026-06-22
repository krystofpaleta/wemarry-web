/**
 * Centrální konfigurace webu — jediné místo pravdy pro URL, externí odkazy do
 * aplikace a sociální sítě. Cokoliv, co se může změnit při deployi, žije tady.
 */

export const SITE = {
  name: "WeMarry",
  /** Produkční doména marketing webu (musí ladit s astro.config `site`). */
  url: "https://wemarry.cz",
  defaultLocale: "cs" as const,

  /**
   * Externí aplikace (jiná doména). Všechna CTA „Vyzkoušet zdarma“ /
   * registrace míří sem — marketing web sám nemá žádný form backend.
   * Změna = 1 řádek.
   */
  app: {
    signup: "https://wemarry.app/auth/signup",
    // Předpoklad podle konvence signup URL — uprav, pokud má login jinou cestu.
    login: "https://wemarry.app/auth/login",
  },

  social: {
    instagram: "https://instagram.com/wemarry.cz",
    facebook: "https://facebook.com/wemarry",
    pinterest: "https://pinterest.com/wemarry",
    tiktok: "https://tiktok.com/@wemarry",
  },

  contactEmail: "info@wemarry.io",

  /** Provozovatel — fakturační a NAP údaje (Organization schema, Kontakt). */
  company: {
    legalName: "WeMarry s.r.o.",
    ico: "22269347",
    street: "Hořanská 1510",
    city: "Praha",
    postalCode: "130 00",
    phone: "+420608003789",
    phoneDisplay: "608 003 789",
  },

  /**
   * Reálné Google hodnocení (Firemní profil) — jeden zdroj pravdy pro
   * strukturovaná data i viditelný odznak v UI. Drž v souladu s Google profilem.
   */
  rating: {
    value: 4.8,
    count: 76,
    profileUrl: "https://g.page/r/CePgbgdGXelDEAI",
  },

  /** Aktuální jednorázová cena (CZK) — musí ladit s viditelnou cenou na webu. */
  priceCzk: 1490,

  /** Analytics — GA4 measurement ID. Doplň reálné G-XXXX a načte se v BaseLayout. */
  ga4Id: "G-XXXXXXXXXX",
} as const;

/** Plný absolutní odkaz z relativní cesty (pro canonical, OG, JSON-LD). */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}
