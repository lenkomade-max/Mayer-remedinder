import { createClient } from "@vercel/kv";

// Берём из любых доступных имён (и KV_*, и UPSTASH_*), чтобы не промахнуться
const url =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;

const token =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Бросаем понятную ошибку ещё до запроса, если чего-то нет
if (!url || !token) {
  throw new Error(
    "KV misconfigured: missing KV_REST_API_URL/UPSTASH_REDIS_REST_URL or KV_REST_API_TOKEN/UPSTASH_REDIS_REST_TOKEN"
  );
}

const kv = createClient({ url, token });
export default kv;
