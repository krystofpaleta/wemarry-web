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
    category: z.enum([
      "Rady a tipy",
      "Svatební hostina",
      "Svatební dorty",
      "Svatební tabule",
      "Svatební šaty",
      "Svatební kytice",
    ]),
    excerpt: z.string().default(""),
    /** Zobrazované datum (cs formát), 1:1 z prototypu. */
    date: z.string(),
    /** ISO datum pro řazení, sitemap a structured data. */
    isoDate: z.coerce.date(),
    views: z.number().default(0),
    readMinutes: z.number().default(5),
    /** Gradient placeholder místo fotky (přenos 1:1). */
    palette: z.string(),
    list: z.enum(["featured", "popular", "grid"]).default("grid"),
    /** Pozice v rámci svého seznamu. */
    order: z.number().default(0),
  }),
});

export const collections = { blog };
