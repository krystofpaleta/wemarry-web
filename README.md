# WeMarry — marketing web (Astro)

Produkční přepis marketingového webu WeMarry z Next.js prototypu na **Astro + GitHub + Cloudflare Pages**. Vizuál a struktura jsou zachované 1:1, mění se runtime a deploy stack.

## Stack

- **Astro 4** (static output, zero-JS by default)
- **@astrojs/tailwind** — design systém přenesený 1:1 (`tailwind.config.mjs`, `src/styles/global.css`)
- **@astrojs/react** — jen pro dva interaktivní „islands" (ScrollFeatures, TemplatesGallery)
- **@astrojs/sitemap** — automatický sitemap + hreflang
- **Content Collections** — blog (`src/content/blog/*.md`, type-safe schema v `src/content/config.ts`)
- **i18n** připraveno (cs default, en „na klik")

## Vývoj

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # produkční build do dist/
npm run preview    # náhled buildu
npm run check      # astro check (typová + template validace)
```

> V Cowork sandboxu může `astro build` selhat na paměti (SIGTERM). Lokálně na Macu proběhne v pořádku. Pro validaci v sandboxu používej `npm run check`.

## Struktura

```
src/
├── pages/            # routy (index, jak-to-funguje, cenik, sablony/*, blog/*)
├── layouts/          # BaseLayout.astro (head, SEO, GA4, Header + Footer)
├── components/
│   ├── layout/       # Header.astro (vanilla scroll/drawer), Footer.astro
│   ├── sections/     # homepage sekce (.astro) + 2 islands (.tsx)
│   └── seo/          # JsonLd.astro
├── content/blog/     # markdown články (Content Collection)
├── data/             # templates.ts
├── lib/              # blog.ts (queries nad kolekcí)
├── i18n/             # ui.ts (slovníky, jazyky)
├── config/           # site.ts (URL, app odkazy, GA4 ID) — JEDINÉ místo pravdy
└── styles/           # global.css
```

## Co je potřeba doplnit před launchem

1. **`src/config/site.ts`** — nastav reálné:
   - `app.signup` / `app.login` (aktuálně `https://wemarry.app/auth/*`)
   - `ga4Id` (nahraď `G-XXXXXXXXXX` reálným measurement ID — jinak se GA4 nenačte)
2. **`public/og-default.jpg`** (1200×630) a **`public/logo.png`** — OG náhled a logo pro structured data.
3. **Fonty** — teď přes Google Fonts CDN. Pro produkci zvaž self-host (`@fontsource`) a výměnu serifu za Adobe Fonts „Orpheus Pro" (viz design poznámky).
4. **Reálné fotky** místo gradient palet → pak přejít na Astro `<Image>` (srcset + AVIF/WebP).

## i18n (vícejazyčnost)

- Config v `astro.config.mjs` (`i18n.locales`) + slovníky v `src/i18n/ui.ts`.
- Čeština je výchozí (bez prefixu), další jazyky pod `/<lang>/`.
- Přepínač v hlavičce se řídí `enabledLocales` v `src/i18n/ui.ts` — jakmile bude hotový anglický obsah, přidej `"en"` a vytvoř stránky pod `src/pages/en/`.
- `hreflang` + `x-default` jsou v `BaseLayout.astro` automaticky.

## SEO / AIO / GEO

- Per-page `<title>`, meta description, canonical, Open Graph, Twitter card.
- JSON-LD: Organization + WebSite (globálně), SoftwareApplication+Offer+rating (homepage), FAQPage (jak-to-funguje, ceník), Article + BreadcrumbList (blog), BreadcrumbList (šablony).
- `robots.txt` + automatický `sitemap-index.xml`.

## Deploy — Cloudflare Pages

1. `git init && git add -A && git commit -m "Astro migrace"`
2. `gh repo create wemarry-web --private --source=. --remote=origin && git push -u origin main`
3. Cloudflare dashboard → **Pages → Create → Connect to Git** → vyber repo.
4. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20` (proměnná `NODE_VERSION=20`)
5. **Custom doména** `wemarry.cz` → Pages → Custom domains.
6. Každý PR dostane preview `*.pages.dev` URL pro design review.

Redirecty starých cest (`/vyzkouset`, `/prihlaseni`) do aplikace jsou v `public/_redirects`.

## Poznámky k migraci

- TemplatesGallery už čte data ze sdíleného `src/data/templates.ts` (splacený dluh z HANDOFFu).
- Header scroll/drawer/jazykový přepínač je čistý vanilla `<script>` — žádná React hydratace.
- Blog body je zatím sdílený placeholder text 1:1 z prototypu; reálné články se píšou do `src/content/blog/*.md`.
