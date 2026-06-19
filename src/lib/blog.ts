import { getCollection, type CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

/** Všechny články seřazené podle data (nejnovější první). */
export async function getAllBlog(): Promise<BlogEntry[]> {
  const all = await getCollection("blog");
  return all.sort(
    (a, b) => b.data.isoDate.valueOf() - a.data.isoDate.valueOf(),
  );
}

/** Velký „featured“ článek na vrcholu /blog. */
export async function getFeatured(): Promise<BlogEntry | undefined> {
  const all = await getCollection("blog");
  return all.find((p) => p.data.list === "featured");
}

/** Boční sloupec „Nejčtenější“ (seřazeno podle order). */
export async function getPopular(): Promise<BlogEntry[]> {
  const all = await getCollection("blog");
  return all
    .filter((p) => p.data.list === "popular")
    .sort((a, b) => a.data.order - b.data.order);
}

/** Hlavní mřížka „Všechny články“ (seřazeno podle order). */
export async function getGrid(): Promise<BlogEntry[]> {
  const all = await getCollection("blog");
  return all
    .filter((p) => p.data.list === "grid")
    .sort((a, b) => a.data.order - b.data.order);
}

/** Související články — N kusů kromě aktuálního (featured + grid pool). */
export async function getRelated(
  currentSlug: string,
  limit = 3,
): Promise<BlogEntry[]> {
  const all = await getCollection("blog");
  const pool = all
    .filter((p) => p.data.list === "featured" || p.data.list === "grid")
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => b.data.isoDate.valueOf() - a.data.isoDate.valueOf());
  return pool.slice(0, limit);
}

export const blogCategories: { name: BlogEntry["data"]["category"]; palette: string }[] = [
  { name: "Rady a tipy", palette: "from-[#d4a78a] to-[#8a6a54]" },
  { name: "Svatební hostina", palette: "from-[#e8c9b8] to-[#c9a089]" },
  { name: "Svatební dorty", palette: "from-[#f5e8e0] to-[#edd4cb]" },
  { name: "Svatební tabule", palette: "from-[#e8dfd4] to-[#c9b89f]" },
  { name: "Svatební šaty", palette: "from-[#f9f0eb] to-[#e4c8b4]" },
  { name: "Svatební kytice", palette: "from-[#e8a89a] to-[#c97a6c]" },
];

/** Pomocná formátovačka počtu zobrazení (cs, mezera jako oddělovač tisíců). */
export function formatViews(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/,/g, " ");
}
