/**
 * Cloudflare Pages middleware.
 *
 * Staging guard: jakýkoliv požadavek na *.pages.dev (preview/staging doména)
 * dostane hlavičku `X-Robots-Tag: noindex, nofollow`, takže Google staging
 * neindexuje. Produkční doména (wemarry.cz) hlavičku NEDOSTANE → indexuje se
 * normálně. Po napojení ostré domény není potřeba nic měnit.
 */
export async function onRequest(context) {
  const response = await context.next();
  const host = new URL(context.request.url).hostname;
  if (host.endsWith(".pages.dev")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
