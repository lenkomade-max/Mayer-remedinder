export default async function handler(req, res) {
  const envSeen = {
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV || null,
  };

  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  let auth = { ok: false, error: "no url/token" };

  if (url && token) {
    try {
      const r = await fetch(`${url}/get/diag:ping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const txt = await r.text();
      auth = { ok: r.ok, status: r.status, body: txt?.slice(0, 200) };
    } catch (e) {
      auth = { ok: false, error: String(e) };
    }
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ envSeen, auth, urlHost: url ? new URL(url).host : null });
}
