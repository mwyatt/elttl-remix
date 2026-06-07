import type { RouterContextProvider } from "react-router";
import { getDb } from "~/db.server";
import { getCloudflareEnv } from "~/cloudflare-env.server";

export function getDbFromContext(context: RouterContextProvider) {
  return getDb(getCloudflareEnv(context));
}