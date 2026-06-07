import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

type Env = {
  TURSO_URL?: string;
  TURSO_AUTH_TOKEN?: string;
};

export function getDb(env: Env) {
  const url = env.TURSO_URL;
  if (!url) {
    throw new Error("Missing TURSO_URL in Cloudflare env bindings");
  }

  const client = createClient({
    url,
    authToken: env.TURSO_AUTH_TOKEN || undefined,
  });

  return drizzle(client);
}