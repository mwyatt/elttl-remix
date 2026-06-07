import { createRequestHandler, RouterContextProvider } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log("worker fetch", new URL(request.url).pathname);

    // Create the provider instance
    const context = new RouterContextProvider();

    // Store Cloudflare bindings on it
    context.set("cloudflare", { env, ctx });

    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;