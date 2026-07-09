import type {RouterContextProvider} from "react-router";

export function getKvFromContext(context: RouterContextProvider) {
  const cf = context.get("cloudflare")
  return cf.kv
}