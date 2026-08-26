export interface Env {
  CARD_DESTINATIONS: KVNamespace;
  TAP_EVENTS: D1Database;
}

const ALLOWED_HOSTS = new Set([
  "g.page",
  "google.com",
  "www.google.com",
  "maps.google.com",
]);

function isAllowedDestination(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    return ALLOWED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function getCardId(pathname: string): string | null {
  const match = pathname.match(/^\/r\/([A-Za-z0-9_-]{4,64})$/);
  return match?.[1] ?? null;
}

async function logTap(env: Env, cardId: string, request: Request): Promise<void> {
  const country = request.cf?.country ?? null;
  const colo = request.cf?.colo ?? null;

  await env.TAP_EVENTS
    .prepare(
      `INSERT INTO tap_events (card_id, tapped_at, country, colo)
       VALUES (?1, datetime('now'), ?2, ?3)`
    )
    .bind(cardId, country, colo)
    .run();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const requestUrl = new URL(request.url);
    const cardId = getCardId(requestUrl.pathname);
    if (!cardId) return new Response("Not Found", { status: 404 });

    const destination = await env.CARD_DESTINATIONS.get(cardId);
    if (!destination) return new Response("Card not configured", { status: 404 });
    if (!isAllowedDestination(destination)) {
      return new Response("Invalid destination", { status: 500 });
    }

    ctx.waitUntil(logTap(env, cardId, request).catch(() => undefined));

    return new Response(null, {
      status: 302,
      headers: {
        Location: destination,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  },
};

export { getCardId, isAllowedDestination };
