import { kv } from "@vercel/kv";
export default kv;
// Storage:
// tasks:<userId> => { schema, timezone, updatedAt, tasks: Task[], deleted: string[] }
