import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wemarry.cz",
  output: "static",
  // i18n připraveno od začátku. cs = default (bez prefixu), další jazyky s prefixem (/en/...).
  // Přidání jazyka = doplnit locale sem + slovník v src/i18n/ui.ts. "Multijazyčnost na klik".
  i18n: {
    defaultLocale: "cs",
    locales: ["cs", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({
      i18n: {
        defaultLocale: "cs",
        locales: { cs: "cs-CZ", en: "en-US" },
      },
    }),
  ],
});
