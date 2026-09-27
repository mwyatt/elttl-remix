import type { Route } from "./+types/_front.home";
import { getCurrentYear } from "~/repositories/year.repository.server";
import { getDbFromContext } from "~/db-context.server";
import { WeekTypes } from "~/constants/Week";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { sql } from "drizzle-orm";
import Panel from "~/components/home/Panel";
import UpcomingEventWeek from "~/components/home/UpcomingEventWeek";
import ThisWeek from "~/components/home/ThisWeek";
import { Link } from "react-router";
import {
  allHomeButtonStyles,
  buttonPrimaryStyles,
  linkStyles,
} from "~/styles/ui-classes";
import SeasonTotals from "~/components/home/SeasonTotals";
import SessionsToday from "~/components/home/SessionsToday";
import FixtureCard from "~/components/FixtureCard";
import { buildMeta } from "~/constants/MetaData";
import { getLatestFixtures } from "~/repositories/fixture.repository.server";
import { getKvFromContext } from "~/kv-context.server";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDayWithSuffixOfMonth } from "~/libraries/date";
import { getWeekDate } from "~/libraries/week";
import { BiSolidInfoCircle } from "react-icons/bi";
import ContentBody from "~/components/ContentBody";
import LinkButton from "~/components/LinkButton";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Home",
    description:
      "Stay up to date with the East Lancashire Table Tennis League. View the latest fixtures, results, news updates, schedules, season statistics, sessions, competitions, all in one place.",
  });
}

export async function loader({ context }) {
  const db = getDbFromContext(context);
  const kv = getKvFromContext(context);
  const currentYear = await getCurrentYear(db);

  const latestPress = await db.all(sql`
      SELECT id, timePublished, title, slug
      FROM content
      WHERE type = 'press'
        AND status = 1
      ORDER BY timePublished DESC LIMIT 3
  `);

  const latestFixtures = await getLatestFixtures(kv, db, currentYear.id);

  dayjs.extend(relativeTime);

  latestPress.forEach((press) => {
    press.url = `/press/${press.slug}`;
    press.titleAttr = dayjs
      .unix(press.timePublished)
      .format("DD/MM/YYYY HH:mm");
    press.timePublishedRelative = dayjs.unix(press.timePublished).fromNow();
  });

  // Divisions - 4
  const divisions = await db.all(sql`
      SELECT id
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}
  `);
  const totalDivisions = divisions.length;

  // Teams playing in the 2025-2026 season - 32
  const teams = await db.all(sql`
      SELECT id
      FROM tennisTeam
      WHERE yearId = ${currentYear.id}
  `);
  const totalTeams = teams.length;

  // Players registered in the 2025-2026 season - 200
  const players = await db.all(sql`
      SELECT id
      FROM tennisPlayer
      WHERE yearId = ${currentYear.id}
  `);
  const totalPlayers = players.length;

  // Fixtures fulfilled in the 2025-2026 season - 100/200
  const fixtures = await db.all(sql`
      SELECT id
      FROM tennisFixture
      WHERE yearId = ${currentYear.id}
        AND timeFulfilled IS NOT NULL
  `);
  const totalFixturesFulfilled = fixtures.length;

  // total fixtures
  const totalFixtures = await db.all(sql`
      SELECT id
      FROM tennisFixture
      WHERE yearId = ${currentYear.id}
  `);
  const totalFixturesCount = totalFixtures.length;

  // this week
  // @todo could this just show the closest week?
  const weeks = await db.all(sql`
      SELECT id,
             timeStart,
             type
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
        AND timeStart < ${dayjs().unix()}
      ORDER BY timeStart DESC LIMIT 1

  `);

  let thisWeek = null;
  let weekFixtures = [];
  if (weeks.length > 0) {
    const theWeek = weeks[0];
    if (theWeek && theWeek.type === WeekTypes.fixture) {
      thisWeek = theWeek;
      const thisWeekFixtures = await db.all(sql`
          SELECT id
          FROM tennisFixture
          WHERE yearId = ${currentYear.id}
            AND weekId = ${thisWeek.id}
      `);
      weekFixtures = thisWeekFixtures;
    }
  }

  // this week
  const upcomingEventWeeks = await db.all(sql`
      SELECT id,
             timeStart,
             type
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
        AND type != ${WeekTypes.fixture}
        AND type != ${WeekTypes.catchup}
        AND type != ${WeekTypes.nothing}
      ORDER BY timeStart
          LIMIT 1;
  `);
  let upcomingEventWeek = null;
  if (upcomingEventWeeks.length > 0) {
    upcomingEventWeek = upcomingEventWeeks[0];
    upcomingEventWeek.dateStartWithSuffix = formatDayWithSuffixOfMonth(
      getWeekDate(upcomingEventWeek.type, upcomingEventWeek.timeStart),
    );
  }

  return Response.json(
    {
      latestPress,
      latestFixtures,
      currentYear: currentYear.name,
      seasonTotals: {
        divisions: totalDivisions,
        teams: totalTeams,
        players: totalPlayers,
        fixtures: {
          fulfilled: totalFixturesFulfilled,
          total: totalFixturesCount,
        },
      },
      thisWeek,
      upcomingEventWeek,
      weekFixtures,
    },
    { status: StatusCodes.OK },
  );
}

export default function HomePage({
  loaderData,
}: Route.ComponentProps<typeof loader>) {
  const {
    latestPress,
    latestFixtures,
    currentYear,
    seasonTotals,
    thisWeek,
    upcomingEventWeek,
    weekFixtures,
  } = loaderData;
  return (
    <ContentBody isHome>
      {upcomingEventWeek && (
        <Panel>
          <UpcomingEventWeek yearName={currentYear} week={upcomingEventWeek} />
        </Panel>
      )}
      <Panel>
        <ThisWeek
          yearName={currentYear}
          week={thisWeek}
          fixtures={weekFixtures}
        />
      </Panel>
      <Panel>
        <div className="flex items-center">
          <h2 className="text-2xl grow">News Updates</h2>
          <div>
            <LinkButton to="/press/" size={'small'} theme={'secondary'}>
              All News
            </LinkButton>
          </div>
        </div>
        {latestPress.map((press) => (
          <div
            className="py-4 border-b border-b-neutral-300 border-dashed"
            key={press.id}
          >
            <p className="text-sm text-gray-500 mb-2" title={press.titleAttr}>
              <span>{press.timePublishedRelative}</span>
            </p>
            <h3 className="text-lg">
              <Link className={linkStyles.join(" ")} to={press.url}>
                {press.title}
              </Link>
            </h3>
          </div>
        ))}
      </Panel>
      <Panel>
        <SessionsToday yearName={currentYear} />
      </Panel>
      <Panel extraClassNames={"md:col-span-2"}>
        <SeasonTotals totals={seasonTotals} yearName={currentYear} />
      </Panel>
      {latestFixtures.length > 0 && (
        <Panel extraClassNames={"md:col-span-2"}>
          <>
            <h2 className="text-2xl mb-6">Latest Fixtures</h2>
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {latestFixtures.map((fixture, index) => (
                <FixtureCard
                  key={index}
                  year={currentYear}
                  teamLeft={{
                    name: fixture.teamLeftName,
                    slug: fixture.teamLeftSlug,
                    score: fixture.scoreLeft,
                  }}
                  teamRight={{
                    name: fixture.teamRightName,
                    slug: fixture.teamRightSlug,
                    score: fixture.scoreRight,
                  }}
                  timeFulfilled={fixture.timeFulfilled}
                />
              ))}
            </div>
          </>
        </Panel>
      )}
      {/*<Panel>*/}
      {/*  <ImageGallery/>*/}
      {/*</Panel>*/}
      <Panel>
        <div className="flex flex-col gap-4 relative h-full">
          <BiSolidInfoCircle className={"absolute top-0 right-0 text-4xl"} />
          <h2 className="text-3xl font-bold">Service Rules</h2>
          <div className={"grow"}>
            <p>
              Get familiar with the table tennis service rules we must all
              follow for fair play.
            </p>
          </div>
          <div className="flex justify-end">
            <LinkButton to="/service-rules">
              View Rules
            </LinkButton>
          </div>
        </div>
      </Panel>
      <Panel>
        <div className="flex flex-col gap-4 h-full">
          <h2 className="text-2xl">Competitions Schedule</h2>
          <p className={"grow"}>
            Find out more about the various competitions being held this season.
          </p>
          <div className="flex justify-end">
            <LinkButton to="/competitions">
              Competitions
            </LinkButton>
          </div>
        </div>
      </Panel>
      <Panel>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">Handicap Calculator</h2>
          <p className={"grow"}>
            Want to know how many points start a player gets in a handicap
            match? Give our new handicap calculator a try!
          </p>
          <div className="flex justify-end">
            <LinkButton to="/handicap-calculator">
              Calculator
            </LinkButton>
          </div>
        </div>
      </Panel>
    </ContentBody>
  );
}
