// Cloudflare Worker for Web3 English app cross-device sync
// Routes:
//   GET  /sync?key=<deviceKey>        → returns {state, srs, wordcache, updatedAt}
//   POST /sync?key=<deviceKey>        → body: {state, srs, wordcache}
//   GET  /                            → health check

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS }
  });
}

function validKey(key) {
  return typeof key === "string" && /^[A-Za-z0-9_-]{16,128}$/.test(key);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === "/") {
      return json({ ok: true, service: "web3en-sync" });
    }

    if (url.pathname !== "/sync") {
      return json({ error: "not found" }, 404);
    }

    const key = url.searchParams.get("key");
    if (!validKey(key)) return json({ error: "invalid key" }, 400);
    if (env.ALLOWED_KEY && key !== env.ALLOWED_KEY) return json({ error: "forbidden" }, 403);
    const kvKey = `user:${key}`;

    if (request.method === "GET") {
      const raw = await env.SYNC.get(kvKey);
      if (!raw) return json({ empty: true });
      try { return json(JSON.parse(raw)); }
      catch { return json({ error: "corrupt" }, 500); }
    }

    if (request.method === "POST") {
      let body;
      try { body = await request.json(); }
      catch { return json({ error: "bad json" }, 400); }
      const payload = {
        state: body.state ?? null,
        srs: body.srs ?? null,
        wordcache: body.wordcache ?? null,
        updatedAt: Date.now()
      };
      const s = JSON.stringify(payload);
      if (s.length > 1_000_000) return json({ error: "payload too large" }, 413);
      await env.SYNC.put(kvKey, s);
      return json({ ok: true, updatedAt: payload.updatedAt });
    }

    return json({ error: "method not allowed" }, 405);
  }
};
