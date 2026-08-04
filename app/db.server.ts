import {type Config, createClient} from "@libsql/client";
import {drizzle, LibSQLDatabase} from "drizzle-orm/libsql";

type Env = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN?: string;
};

export function getDb(env: Env): LibSQLDatabase {
  const url = env.TURSO_URL;
  if (!url) {
    throw new Error("Missing TURSO_URL in Cloudflare env bindings");
  }

  const config: Config = {
    url,
    ...(env.TURSO_AUTH_TOKEN ? { authToken: env.TURSO_AUTH_TOKEN } : {}),
  };

  const client = createClient(config);

  return drizzle(client);
}