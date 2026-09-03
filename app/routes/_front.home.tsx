import type {Route} from "./+types/_front.home";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {getDbFromContext} from "~/db-context.server";
import {NonEventTypes, WeekTypes} from "~/constants/Week";
import dayjs from "dayjs";
import {StatusCodes} from "http-status-codes";
import {sql} from "drizzle-orm";
import Panel from "~/components/home/Panel";
import UpcomingEventWeek from "~/components/home/UpcomingEventWeek";
import ThisWeek from "~/components/home/ThisWeek";
import {Link} from "react-router";
import {allHomeButtonStyles, buttonPrimaryStyles, linkStyles} from "~/styles/ui-classes";
import SeasonTotals from "~/components/home/SeasonTotals";
import SessionsToday from "~/components/home/SessionsToday";
import FixtureCard from "~/components/FixtureCard";
import ImageGallery from "~/components/home/ImageGallery";
import {buildMeta} from "~/constants/MetaData";
import {getLatestFixtures} from "~/repositories/fixture.repository.server";
import {getKvFromContext} from "~/kv-context.server";
import relativeTime from 'dayjs/plugin/relativeTime'

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: 'Home',
    description: "Stay up to date with the East Lancashire Table Tennis League. View the latest fixtures, results, news updates, schedules, season statistics, sessions, competitions, all in one place."
  })
}

export async function loader({context}) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const currentYear = await getCurrentYear(db)

  const latestPress = await db.all(sql`
      SELECT id, timePublished, title, slug
      FROM content
      WHERE type = 'press'
        AND status = 1
      ORDER BY timePublished DESC
      LIMIT 5
  `)

  const latestFixtures = await getLatestFixtures(kv, db, currentYear.id)

  dayjs.extend(relativeTime)

  latestPress.forEach((press) => {
    press.url = `/press/${press.slug}`
    press.titleAttr = dayjs.unix(press.timePublished).format('DD/MM/YYYY HH:mm')
    press.timePublishedRelative = dayjs.unix(press.timePublished).fromNow()
  })

  // Divisions - 4
  const divisions = await db.all(sql`
      SELECT id
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}
  `)
  const totalDivisions = divisions.length

  // Teams playing in the 2025-2026 season - 32
  const teams = await db.all(sql`
      SELECT id
      FROM tennisTeam
      WHERE yearId = ${currentYear.id}
  `)
  const totalTeams = teams.length

  // Players registered in the 2025-2026 season - 200
  const players = await db.all(sql`
      SELECT id
      FROM tennisPlayer
      WHERE yearId = ${currentYear.id}
  `)
  const totalPlayers = players.length

  // Fixtures fulfilled in the 2025-2026 season - 100/200
  const fixtures = await db.all(sql`
      SELECT id
      FROM tennisFixture
      WHERE yearId = ${currentYear.id}
        AND timeFulfilled IS NOT NULL
  `)
  const totalFixturesFulfilled = fixtures.length

  // total fixtures
  const totalFixtures = await db.all(sql`
      SELECT id
      FROM tennisFixture
      WHERE yearId = ${currentYear.id}
  `)
  const totalFixturesCount = totalFixtures.length

  // this week
  const weeks = await db.all(sql`
      SELECT id,
              timeStart,
              type
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
        AND timeStart = ${dayjs().startOf('week').unix()}
  `)

  let thisWeek = null
  let weekFixtures = []
  if (weeks.length > 0) {
    const theWeek = weeks[0]
    if (theWeek && theWeek.type === WeekTypes.fixture) {
      thisWeek = theWeek
      const thisWeekFixtures = await db.all(sql`
            SELECT id
            FROM tennisFixture
            WHERE yearId = ${currentYear.id}
              AND weekId = ${thisWeek.id}
        `)
      weekFixtures = thisWeekFixtures
    }
  }

  const typesSql = Object.values(NonEventTypes).join(',')

  // this week
  const upcomingEventWeeks = await db.all(sql`
      SELECT id,
              timeStart,
              type
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
        AND timeStart >= ${dayjs().unix()}
        AND type NOT IN(${typesSql})
      ORDER BY timeStart
LIMIT 1;
  `)
  let upcomingEventWeek = null
  if (upcomingEventWeeks.length > 0) {
    upcomingEventWeek = upcomingEventWeeks[0]
  }

  return Response.json({
    latestPress,
    latestFixtures,
    currentYear: currentYear.name,
    seasonTotals: {
      divisions: totalDivisions,
      teams: totalTeams,
      players: totalPlayers,
      fixtures: {
        fulfilled: totalFixturesFulfilled,
        total: totalFixturesCount
      }
    },
    thisWeek,
    upcomingEventWeek,
    weekFixtures
  }, { status: StatusCodes.OK })
}

export default function HomePage({ loaderData }: Route.ComponentProps<typeof loader>) {
  const { latestPress, latestFixtures, currentYear, seasonTotals, thisWeek, upcomingEventWeek, weekFixtures } = loaderData
  return (
      <div className='sm:p-6 sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {upcomingEventWeek && (
          <Panel>
            <UpcomingEventWeek yearName={currentYear} week={upcomingEventWeek} />
          </Panel>
        )}
        <Panel>
          <ThisWeek yearName={currentYear} week={thisWeek} fixtures={weekFixtures} />
        </Panel>
        <Panel rowSpan={2}>
          <div className='flex items-center'>
            <h2 className='text-2xl grow'>News Updates</h2>
            <div>
              <Link className={allHomeButtonStyles.join(' ')} to='/press/'>All News</Link>
            </div>
          </div>
          {latestPress.map((press) => (
            <div className='py-4 border-b border-b-neutral-300 border-dashed' key={press.id}>
              <p
                className='text-sm text-gray-500 mb-2'
                title={press.titleAttr}
              >
                <span>{press.timePublishedRelative}</span>
              </p>
              <h3 className='text-lg'>
                <Link
                  className={linkStyles.join(' ')}
                  to={press.url}
                >
                  {press.title}
                </Link>
              </h3>
            </div>
          ))}
        </Panel>
        <Panel colSpan={2}>
          <SeasonTotals totals={seasonTotals} yearName={currentYear} />
        </Panel>
        <Panel>
          <SessionsToday yearName={currentYear} />
        </Panel>
          {latestFixtures.length > 0 && (
        <Panel colSpan={2}>
            <>
              <h2 className='text-2xl mb-6'>Latest Fulfilled Fixtures</h2>
              <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
                {latestFixtures.map((fixture, index) => <FixtureCard
                  key={index}
                  year={currentYear} teamLeft={{
                    name: fixture.teamLeftName,
                    slug: fixture.teamLeftSlug,
                    score: fixture.scoreLeft
                  }}
                  teamRight={{
                    name: fixture.teamRightName,
                    slug: fixture.teamRightSlug,
                    score: fixture.scoreRight
                  }}
                  timeFulfilled={fixture.timeFulfilled}
                                                        />)}
              </div>
            </>
        </Panel>
          )}
        <Panel>
          <ImageGallery />
        </Panel>
        <Panel>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Competitions Schedule</h2>
            <p>Find out more about the various competitions being held this season.</p>
            <div className='flex justify-end'>
              <Link className={buttonPrimaryStyles.join(' ')} to='/competitions'>Competitions</Link>
            </div>
          </div>
        </Panel>
        <Panel>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Handicap Calculator</h2>
            <p>Want to know how many points start a player gets in a handicap match? Give our new handicap calculator a try!</p>
            <div className='flex justify-end'>
              <Link className={buttonPrimaryStyles.join(' ')} to='/handicap-calculator'>Calculator</Link>
            </div>
          </div>
        </Panel>
        <Panel>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Handbook</h2>
            <p>Welcome to the season, download the handbook for fixtures and more.</p>
            <div className='flex justify-end'>
              <Link className={buttonPrimaryStyles.join(' ')} to='/handbook-2026-2027.pdf' target={'_blank'}>Download</Link>
            </div>
          </div>
        </Panel>
      </div>
  )
}
