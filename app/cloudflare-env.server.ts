import type { RouterContextProvider } from "react-router";

type RuntimeEnv = {
  TURSO_URL?: string;
  TURSO_AUTH_TOKEN?: string;
};

export function getCloudflareEnv(context: RouterContextProvider): RuntimeEnv {
  const cf = context.get("cloudflare") as { env?: RuntimeEnv } | undefined;
  if (!cf?.env) {
    throw new Error("Missing cloudflare env in route context");
  }
  return cf.env;
}