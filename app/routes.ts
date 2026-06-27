import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("api/update-password-local", "routes/api.update-password-local.ts"),

  route("/", "routes/_front.tsx", [
    index("routes/_front.home.tsx"),

    route("press", "routes/_front.press.tsx"),
    route("press/:slug", "routes/_front.press.$slug.tsx"),

    route("about-us", "routes/_front.about-us.tsx"),
    route("competitions", "routes/_front.competitions.tsx"),
    route("contact-us", "routes/_front.contact-us.tsx"),

    route("result", "routes/_front.result.tsx"),
    route("result/:year", "routes/_front.result.$year.tsx"),

    route("result/:year/:division", "routes/_front.result.$year.$division.tsx"),
    route("result/:year/:division/league", "routes/_front.result.$year.$division.league.tsx"),
    route("result/:year/:division/merit", "routes/_front.result.$year.$division.merit.tsx"),
    route("result/:year/:division/doubles-merit", "routes/_front.result.$year.$division.doubles-merit.tsx"),

    route("result/:year/team/:slug", "routes/_front.result.$year.team.$slug.tsx"),
    route("result/:year/venue/:slug", "routes/_front.result.$year.venue.$slug.tsx"),
    route("result/:year/player/:slug", "routes/_front.result.$year.player.$slug.tsx"),
    route("result/:year/fixture/:teamLeftSlug/:teamRightSlug", "routes/_front.result.$year.fixture.$teamLeftSlug.$teamRightSlug.tsx"),
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
    route("fixture/:id/rollback", "routes/admin.fixture.$id.rollback.tsx"),

    route("week", "routes/admin.week.tsx"),
  ]),
] satisfies RouteConfig;