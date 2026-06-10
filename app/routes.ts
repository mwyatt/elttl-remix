import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/_front.tsx", [
    // index("routes/_front.home.tsx"),
    route("about-us", "routes/_front.about-us.tsx"),
      route("api/ping", "routes/api.ping.ts"),
  ]),

  route("admin/login", "routes/admin.login.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin._index.tsx"),
    // route("users", "routes/admin.users.tsx"),
  ]),
] satisfies RouteConfig;