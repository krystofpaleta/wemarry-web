import { defineCollection, z } from "astro:content";

/**
 * Blog jako Astro Content Collection (type-safe markdown).
 * Nahrazuje původní src/data/blog.ts — obsah teď žije v src/content/blog/*.md
 * s validovaným frontmatterem. Editace = úprava markdownu, žádný build krok.
 *
 * `list` zachovává původní rozdělení z prototypu:
 *  - "featured" → velký článek nahoře na /blog
 *  - "popular"  → boční sloupec „Nejčtenější“
 *  - "grid"     → hlavní mřížka „Všechny články“
 */
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    /** Reálné kategorie přenesené z wemarry.io. */
    category: z.enum([
      "Plánování svatby",
      "Vzhled a styl",
      "Místo a dekorace",
      "Hosté a organizace",
      "Dodavatelé a inspirace",
    ]),
    excerpt: z.string().default(""),
    /** Zobrazované datum (cs formát). */
    date: z.string(),
    /** ISO datum pro řazení, sitemap a structured data. */
    isoDate: z.coerce.date(),
    readMinutes: z.number().default(5),
    /** Gradient placeholder místo fotky. */
    palette: z.string(),
    /** Reálná URL původní hero fotky (pro pozdější localizaci do public/). */
    image: z.string().optional(),
    /** Původní URL na wemarry.io (reference). */
    sourceUrl: z.string().optional(),
    list: z.enum(["featured", "popular", "grid"]).default("grid"),
    /** Pozice v rámci svého seznamu. */
    order: z.number().default(0),
  }),
});

export const collections = { blog };
