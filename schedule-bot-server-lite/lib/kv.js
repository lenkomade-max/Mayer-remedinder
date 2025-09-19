import { createClient } from "@vercel/kv";

function pickRestCreds(env) {
  // 1) приоритетно стандартные имена
  if (env.KV_REST_API_URL && env.KV_REST_API_TOKEN) {
    return { url: env.KV_REST_API_URL.trim(), token: env.KV_REST_API_TOKEN.trim() };
  }
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return { url: env.UPSTASH_REDIS_REST_URL.trim(), token: env.UPSTASH_REDIS_REST_TOKEN.trim() };
  }
  // 2) поиск по любому префиксу: *_REST_API_URL + *_REST_API_TOKEN
  let urlKey = null, tokenKey = null;
  for (const k of Object.keys(env)) {
    if (k.endsWith("_REST_API_URL")) urlKey = k;
    if (k.endsWith("_REST_API_TOKEN")) tokenKey = k;
  }
  if (urlKey && tokenKey) {
    return { url: env[urlKey].trim(), token: env[tokenKey].trim() };
  }
  return { url: null, token: null };
}

const { url, token } = pickRestCreds(process.env);

if (!url || !token) {
  throw new Error("KV misconfigured: missing *_REST_API_URL / *_REST_API_TOKEN");
}

export default createClient({ url, token });
