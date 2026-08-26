import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [

    // API
    route("api/update-password-local", "routes/api.update-password-local.ts"),

    // route("score", "routes/score.tsx"),
    //     route("api/score/start", "routes/api.score-start.ts"),
    //     route("api/score/update", "routes/api.score-update.ts"),
    //
    // route("scorecard/:passcode", "routes/scorecardEntry.tsx"),

    // @todo
    // route("sitemap.xml", "routes/sitemap.xml.tsx"),

    route("/", "routes/_front.tsx", [

        index("routes/_front.home.tsx"),

        route("press", "routes/_front.press.tsx"),
        route("press/:slug", "routes/_front.press.$slug.tsx"),

        route("about-us", "routes/_front.about-us.tsx"),
        route("competitions", "routes/_front.competitions.tsx"),
        route("contact-us", "routes/_front.contact-us.tsx"),

        route("committee-members", "routes/_front.committee-members.tsx"),
        route("sessions", "routes/_front.sessions.tsx"),
        route("prepaid-practice-scheme", "routes/_front.prepaid-practice-scheme.tsx"),
        route("schools", "routes/_front.schools.tsx"),
        route("constitution-and-rules", "routes/_front.constitution-and-rules.tsx"),
        route("gdpr", "routes/_front.gdpr.tsx"),
        route("code-of-conduct", "routes/_front.code-of-conduct.tsx"),
        route("handicap-calculator", "routes/_front.handicap-calculator.tsx"),


        route("result", "routes/_front.result.tsx"),
        route("result/:year", "routes/_front.result.$year.tsx"),

        route("result/:year/season", "routes/_front.result.$year.season.tsx"),
        route("result/:year/week/:id", "routes/_front.result.$year.week.$id.tsx"),

        route("result/:year/:division", "routes/_front.result.$year.$division.tsx"),
        route("result/:year/:division/league", "routes/_front.result.$year.$division.league.tsx"),
        route("result/:year/:division/merit", "routes/_front.result.$year.$division.merit.tsx"),
        route("result/:year/:division/rank-merit", "routes/_front.result.$year.$division.rank-merit.tsx"),
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

        // @todo
        route("fixture", "routes/admin.fixture.tsx"),
        // route("fixture/:id", "routes/admin.fixture.$id.tsx"),
        // route("fixture/:id/rollback", "routes/admin.fixture.$id.rollback.tsx"),

        // @todo
        // route("week", "routes/admin.week.tsx"),

        route("api/create-season", "routes/admin.api.create-season.ts"),
    ]),
] satisfies RouteConfig;