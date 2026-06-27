import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearByName} from "~/repositories/year.repository.server";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import {getShortPlayerName} from "~/libraries/player";
import {linkStyles} from "~/styles/ui-classes";
import RankChange from "~/components/player/RankChange";
import {getSideCapitalized, scorecardStructure, SIDE_LEFT, SIDE_RIGHT} from "~/constants/encounter";
import EncounterStatus from "~/constants/EncounterStatus";
import classNames from "classnames";
import FixtureEncounterChart from "~/components/FixtureEncounterChart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, teamLeftSlug, teamRightSlug } = params

  const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    return Response.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const teamLefts = await db.all(sql`
      select id, name, venueId
      from tennisTeam
      where slug = ${teamLeftSlug}
        and yearId = ${currentYear.id}
  `)

  if (teamLefts.length === 0) {
    return Response.json(`Unable to find teamLeft with slug '${teamLeftSlug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const teamLeft = teamLefts[0]

  const teamRights = await db.all(sql`
      select id, name
      from tennisTeam
      where slug = ${teamRightSlug}
        and yearId = ${currentYear.id}
  `)

  if (teamRights.length === 0) {
    return Response.json(`Unable to find teamRight with slug '${teamRightSlug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const teamRight = teamRights[0]

  const venuess = await db.all(sql`
      select name, slug
      from tennisVenue
      where id = ${teamLeft.venueId}
        and yearId = ${currentYear.id}
  `)
  const venue = venuess[0]

  const fixtures = await db.all(sql`
      select id, timeFulfilled
      from tennisFixture
      where teamIdLeft = ${teamLeft.id}
        and teamIdRight = ${teamRight.id}
        and yearId = ${currentYear.id}
  `)
  const fixture = fixtures[0]

  const encounters = await db.all(sql`
      select CONCAT(tp.nameFirst, ' ', tp.nameLast)   AS playerLeftName,
             tp.slug                                  AS playerLeftSlug,
             te.playerRankChangeLeft,
             te.scoreLeft,
             CONCAT(tpr.nameFirst, ' ', tpr.nameLast) AS playerRightName,
             tpr.slug                                 AS playerRightSlug,
             te.playerRankChangeRight,
             te.scoreRight,
             te.status
      from tennisEncounter te
               left join tennisPlayer tp on te.playerIdLeft = tp.id and tp.yearId = ${currentYear.id}
               left join tennisPlayer tpr on te.playerIdRight = tpr.id AND tpr.yearId = ${currentYear.id}
      where te.fixtureId = ${fixture.id}
        and te.yearId = ${currentYear.id}
  `)

  return Response.json({
    teamLeft,
    teamRight,
    venue,
    fixture,
    encounters
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearFixtureTeamLeftSlugTeamRightSlug({ loaderData, params }: Route.ComponentProps) {
    const {
    teamLeft,
    teamRight,
    venue,
    encounters
  } = loaderData;
  const { year, teamLeftSlug, teamRightSlug } = params

  const fixtureFulfilled = encounters.length > 0

  const getGrandTotal = (side) => {
    const sideCapitalized = getSideCapitalized(side)
    const sideScoreKey = `score${sideCapitalized}`
    let score = 0

    encounters.forEach((encounter) => {
      if (encounter.status === EncounterStatus.EXCLUDE) {
        return
      }
      score += parseInt(encounter[sideScoreKey])
    })

    return score
  }

  const getPlayerLink = (playerSlug, playerName, status, isAwayPlayer = false) => {
    if (status === EncounterStatus.DOUBLES) {
      return ''
    }
    if (!playerSlug) {
      return <span className='text-gray-500 line-through'>Absent<span className='hidden sm:inline'> Player</span></span>
    }
    return (
      <Link
        className={[
          linkStyles.join(' '),
          isAwayPlayer ? 'text-tertiary-500 border-b-tertiary-500' : ''
        ].join(' ')} to={`/result/${year}/player/${playerSlug}`}
      >
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
            { name: `${teamLeft.name} vs ${teamRight.name}` }
          ]
        }
      />

      <div className='max-w-[768px] mx-auto'>
        <MainHeading name={`${teamLeft.name} vs ${teamRight.name}`} />
        <p className='mb-8'>
          Home team venue
          {' '}
          <Link
            className={linkStyles.join(' ')}
            to={`/result/${year}/venue/${venue.slug}`}
          >{venue.name}
          </Link>
        </p>
        {!fixtureFulfilled && (
          <p>Fixture has not yet been fulfilled, please check back later.</p>
        )}
        {encounters.map((row, index) => (
          <div key={index} className='flex gap-4 mt-4 border-b border-dashed border-gray-300 pb-3'>
            <div className='w-2/6'>
              <span className={classNames({
                'max-md:hidden': scorecardStructure[index][0] !== EncounterStatus.DOUBLES,
                'mr-4': true
              })}
              >
                {scorecardStructure[index][0] === EncounterStatus.DOUBLES
                  ? 'Doubles'
                  : (
                    <>{scorecardStructure[index][0]} v {scorecardStructure[index][1]}</>
                    )}
              </span>

              {getPlayerLink(row.playerLeftSlug, row.playerLeftName, row.status)}
              <RankChange rankChange={row.playerRankChangeLeft} />
            </div>
            <div className='w-1/6 flex-grow font-bold text-right text-xl pr-4 border-r'>{row.scoreLeft}</div>
            <div className='w-1/6 flex-grow font-bold text-xl pl-2'>{row.scoreRight}</div>
            <div className='w-2/6 text-right'>
              <RankChange rankChange={row.playerRankChangeRight} />
              {getPlayerLink(row.playerRightSlug, row.playerRightName, row.status, true)}
            </div>
          </div>
        ))}
        {fixtureFulfilled && (
          <>
            <div className='text-4xl flex p-6 mb-12 gap-10 bg-white rounded-bl rounded-br border border-dashed border-stone-300 border-t-0'>
              <div className='w-1/2 text-right'>{getGrandTotal(SIDE_LEFT)}</div>
              <div className='w-1/2 '>{getGrandTotal(SIDE_RIGHT)}</div>
            </div>

            <SubHeading name='Performance' />
            <FixtureEncounterChart year={year} teamLeftName={teamLeft.name} teamRightName={teamRight.name} encounters={encounters} />
          </>
        )}
      </div>
    </>
  )
}