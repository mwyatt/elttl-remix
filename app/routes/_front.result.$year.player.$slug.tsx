import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearByName} from "~/repositories/year.repository.server";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";
import {getFixturesByTeamId} from "~/repositories/fixture.repository.server";
import {getShortPlayerName} from "~/libraries/player";
import {linkStyles} from "~/styles/ui-classes";
import WeeksTimeline from "~/components/WeeksTimeline";
import RankChange from "~/components/player/RankChange";
import FixtureCard from "~/components/FixtureCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, slug } = params

  // @todo DRY up
  const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    return Response.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const players = await db.all(sql`
      SELECT tp.id,
             concat(nameFirst, ' ', nameLast) AS name,
             tp.slug,
             tp.rank,
             tp.phoneMobile,
             tp.phoneLandline,
             teamId,
             tt.name                          AS teamName,
             tt.slug                          AS teamSlug,
             tt.divisionId
      FROM tennisPlayer tp
               left join tennisTeam tt on tp.teamId = tt.id and tt.yearId = tp.yearId
      WHERE tp.yearId = ${currentYear.id}
        AND tp.slug = ${slug}
  `)

  if (players.length === 0) {
    return Response.json(`Unable to find player within year name '${year}' and slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const player = players[0]

  const fixtures = await db.all(sql`
      select ttl.name        teamLeftName,
             ttl.slug        teamLeftSlug,
             sum(scoreLeft)  scoreLeft,
             ttr.name        teamRightName,
             ttr.slug        teamRightSlug,
             sum(scoreRight) scoreRight,
             timeFulfilled
      from tennisEncounter tte
               inner join tennisFixture ttf on ttf.id = tte.fixtureId
          and ttf.yearId = tte.yearId
          and (ttf.teamIdLeft = ${player.teamId} OR ttf.teamIdRight = ${player.teamId})
          and timeFulfilled is not null
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = ${currentYear.id}
        and status != 'exclude'
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `)

  const encounters = await db.all(sql`
      select tte.id,
             scoreLeft,
             scoreRight,
             CONCAT(ttpl.nameFirst, ' ', ttpl.nameLast) playerLeftName,
             ttpl.slug                                  playerLeftSlug,
             CONCAT(ttpr.nameFirst, ' ', ttpr.nameLast) playerRightName,
             ttpr.slug                                  playerRightSlug,
             playerRankChangeLeft,
             playerRankChangeRight
      from tennisEncounter tte
               left join tennisPlayer ttpl on ttpl.id = tte.playerIdLeft and ttpl.yearId = tte.yearId
               left join tennisPlayer ttpr on ttpr.id = tte.playerIdRight and ttpr.yearId = tte.yearId
      where tte.yearId = ${currentYear.id}
        and (tte.playerIdLeft = ${player.id} OR tte.playerIdRight = ${player.id})
  `)

  const weeks = await getAllWeeksByYear(db, currentYear.id)
  const teamFixtures = await getFixturesByTeamId(db, currentYear.id, player.teamId)

  // Attach fixtures to weeks
  for (const week of weeks) {
    week.fixtures = teamFixtures.filter(fixture => fixture.weekId === week.id)
  }

  return Response.json({
    player,
    encounters,
    fixtures,
    weeks
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearPlayerSlug({ loaderData, params }: Route.ComponentProps) {
    const {
player, encounters, fixtures, weeks
  } = loaderData;
  const { year, slug } = params

  const getPlayerLink = (playerSlug, playerName) => {
    if (playerSlug === slug) {
      return (
        <>
          <span className='sm:hidden text-tertiary-500'>{getShortPlayerName(playerName)}</span>
          <span className='hidden sm:inline text-tertiary-500'>{playerName}</span>
        </>
      )
    }
    return (
      <Link className={linkStyles.join(' ')} to={`/result/${year}/player/${playerSlug}`}>
        <span className='sm:hidden'>{getShortPlayerName(playerName)}</span>
        <span className='hidden sm:inline'>{playerName}</span>
      </Link>
    )
  }

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: player.name }
          ]
        }
      />

      <MainHeading name={player.name} />
      <div className='lg:grid lg:grid-cols-8 gap-16'>
        <div className='lg:col-span-5'>
          <SubHeading name='General Information' />
          <p>
            {'Plays for the '}
            <Link
              className={linkStyles.join(' ')}
              to={`/result/${year}/team/${player.teamSlug}`}
            >
              {player.teamName}
            </Link>
            {' team with a rank of '}
            <span className='font-bold'>{player.rank}</span>
            {' and has had '}
            <span className='font-bold'>{encounters.length}</span>
            {' encounters with other players so far this season.'}
          </p>

          {(player.phoneLandline || player.phoneMobile) && (
            <>
              <SubHeading name='Contact Information' />
              {player.phoneLandline && (
                <p className='mb-2'>
                  {'Phone Landline: '}
                  <a
                    className='text-primary-500'
                    to={`tel:${player.phoneLandline}`}
                  >
                    {player.phoneLandline}
                  </a>
                </p>
              )}
              {player.phoneMobile && (
                <p className='mb-2'>
                  {'Phone Mobile: '}
                  <a
                    className='text-primary-500'
                    to={`tel:${player.phoneMobile}`}
                  >
                    {player.phoneMobile}
                  </a>
                </p>
              )}
            </>
          )}

          {weeks.length > 0 && (
            <WeeksTimeline yearName={year} weeks={weeks} teamSlug={player.teamSlug} />
          )}
        </div>

        <div className='lg:col-span-3'>

          <SubHeading name='Performance' />

          <div className='grid grid-cols-10'>

            {encounters.map((encounter, index) => (
              <div key={index} className='contents'>
                <div className='col-span-4 pt-3 border-t border-dashed border-t-stone-300 pb-3'>
                  {getPlayerLink(encounter.playerLeftSlug, encounter.playerLeftName)}
                  <RankChange rankChange={encounter.playerRankChangeLeft} />
                </div>
                <div
                  className=' text-right pt-3 border-t border-dashed border-t-stone-300 pb-3 pr-2'
                >{encounter.scoreLeft}
                </div>
                <div className=' pt-3 border-t border-dashed border-t-stone-300 pb-3 pl-2'>{encounter.scoreRight}</div>
                <div className='col-span-4  pt-3 border-t border-dashed border-t-stone-300 pb-3 text-right'>
                  <RankChange rankChange={encounter.playerRankChangeRight} />
                  {getPlayerLink(encounter.playerRightSlug, encounter.playerRightName)}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* @todo make this only fixtures that the player has been involved in */}
      <SubHeading name='Fulfilled Team Fixtures' />
      <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '>

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

    </>
  )
}