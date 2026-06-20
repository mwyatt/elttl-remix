import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/_front.tsx", [
    // index("routes/_front.home.tsx"),
    route("about-us", "routes/_front.about-us.tsx"),
    route("api/update-password-local", "routes/api.update-password-local.ts"),
  ]),

  route("admin/login", "routes/admin.login.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin._index.tsx"),

    route("report/players-playing-up", "routes/admin.players-playing-up-report.tsx"),

    route("news", "routes/admin.news.tsx"),
    route("news/:id", "routes/admin.news.$id.tsx"),

    route("player", "routes/admin.player.tsx"),
    route("player/:id", "routes/admin.player.$id.tsx"),

    route("fixture", "routes/admin.fixture.tsx"),
    route("fixture/:id", "routes/admin.fixture.$id.tsx"),
  ]),
] satisfies RouteConfig;