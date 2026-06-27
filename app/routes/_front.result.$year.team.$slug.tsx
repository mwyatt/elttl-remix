import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearByName} from "~/repositories/year.repository.server";
import {Link, useSearchParams} from "react-router";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import SubHeading from "~/components/SubHeading";
import InformationTable from "~/components/team/InformationTable";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";
import {getFixturesByTeamId} from "~/repositories/fixture.repository.server";
import MainHeading from "~/components/MainHeading";
import {homeNightMap} from "~/constants/Team";
import WeeksTimeline from "~/components/WeeksTimeline";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, slug } = params

  const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    return Response.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const teams = await db.all(sql`
      SELECT
          tt.id,
          tt.name,
          tt.slug,
          tt.homeWeekday,
          LOWER(td.name) AS divisionSlug,
          td.name divisionName,
          tv.name venueName,
          tv.slug venueSlug,
      concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
      tp.slug secretarySlug
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
               LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND td.yearId = tt.yearId
               LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
      WHERE tt.yearId = ${currentYear.id}
        AND tt.slug = ${slug}
  `)

  if (teams.length === 0) {
    return Response.json(`Unable to find team with slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const team = teams[0]

  const players = await db.all(sql`
      SELECT
          concat(nameFirst, ' ', nameLast) AS name,
          tennisPlayer.rank,
          slug
      FROM tennisPlayer
      WHERE yearId = ${currentYear.id}
        AND teamId = ${team.id}
  `)

  const fixtures = await db.all(sql`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight,
        timeFulfilled
        from tennisEncounter tte
      inner join tennisFixture ttf on ttf.id = tte.fixtureId
                                          and ttf.yearId = tte.yearId
                                          and (ttf.teamIdLeft = ${team.id} OR ttf.teamIdRight = ${team.id})
                                          and timeFulfilled is not null
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = ${currentYear.id}
    and status != 'exclude'
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `)

  const weeks = await getAllWeeksByYear(db, currentYear.id)
  const teamFixtures = await getFixturesByTeamId(db, currentYear.id, team.id)

  // Attach fixtures to weeks
  for (const week of weeks) {
    week.fixtures = teamFixtures.filter(fixture => fixture.weekId === week.id)
  }

  return Response.json({
    team,
    players,
    fixtures,
    weeks
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearTeamSlug({ loaderData, params }: Route.ComponentProps) {
    const {
team, players, fixtures, weeks
  } = loaderData;
  const { year, slug } = params

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: team.name }
          ]
        }
      />

      <MainHeading name={team.name} />

      <div className='md:flex gap-8'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <p className='my-2'>Team in the <Link className={linkStyles.join(' ')} to={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</Link> division playing at the <Link className={linkStyles.join(' ')} to={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</Link> venue on a <strong>{homeNightMap[team.homeWeekday]}</strong> night.</p>

          {team.secretaryName && (
            <p>Secretary is <Link className={linkStyles.join(' ')} to={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</Link></p>
          )}
          {!team.secretaryName && (
            <p>There is no team secretary currently.</p>
          )}

          {weeks.length > 0 && (
            <WeeksTimeline yearName={year} weeks={weeks} teamSlug={team.slug} />
          )}

        </div>
        <div className='flex-1'>
          <SubHeading name='Registered Players' />
          <div className=''>

            {players.map((player, index) => (
              <div key={index} className='flex p-4 gap-4 border-t border-dashed hover:bg-gray-100'>
                <div className='flex-2'>
                  <Link
                    to={`/result/${year}/player/${player.slug}`}
                    className={linkStyles.join(' ')}
                    key={player.slug}
                  >
                    {player.name}
                  </Link>
                </div>
                <div className='flex-1 text-right'>
                  <span className='float-right text-tertiary-500'>{player.rank}</span>
                </div>
              </div>
            ))}

          </div>

          {/* <SubHeading name='Directions' /> */}
          {/* <DirectionsButton url={data.venue.location} /> */}

          <SubHeading name='Fixtures Fulfilled' />
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3 '>

            {fixtures.map((fixture, index) => (
              <FixtureCard
                key={index}
                year={year}
                teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
                teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
                timeFulfilled={fixture.timeFulfilled}
              />
            ))}

          </div>

        </div>
      </div>

    </>
  )
}