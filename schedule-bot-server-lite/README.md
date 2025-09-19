# Schedule Bot Server (Lite, no APNs)
Endpoints:
- `GET /api/sync?userId=default` — returns current state
- `POST /api/patch?userId=default` — apply patch { ops: [...] }

Env vars (Vercel → Project → Settings → Environment Variables):
- KV_URL
- KV_REST_API_TOKEN
- KV_REST_API_READ_ONLY_TOKEN

How to test (no push):
1) Deploy to Vercel.
2) On iPhone app tap "Обновить" — it calls /api/sync.
3) From your ChatGPT bot call /api/patch with a body like:
   {
     "ops":[
       {"op":"add","task":{
         "id":"demo-1",
         "title":"Проверка",
         "note":"Пример",
         "due":"2025-12-31T23:59:00+04:00",
         "notify":true,
         "updatedAt":"2025-01-01T00:00:00+04:00"
       }}
     ]
   }
Then tap "Обновить" in the app → the task appears and a local notification will be scheduled.
