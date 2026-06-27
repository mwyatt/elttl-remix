import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearDivisionId} from "~/repositories/year.repository.server";
import {Link, useSearchParams} from "react-router";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import SubHeading from "~/components/SubHeading";
import InformationTable from "~/components/team/InformationTable";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import {getOtherSideCapitalized, getSidesCapitalized} from "~/constants/encounter";
import {getEncounterMerit} from "~/libraries/encounter.lib";
import { uniq } from 'lodash'
import {getShortPlayerName} from "~/libraries/player";
import EncounterStatus from "~/constants/EncounterStatus";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, division } = params
  const yearDivisionId = await getYearDivisionId(db, year, division)

  // @todo make DRY
  if (!yearDivisionId) {
    return Response.json(`Unable to find division with year name '${year}' and slug '${division}'`, { status: StatusCodes.NOT_FOUND })
  }

  const leagueTable = await db.all(sql`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight
        from tennisEncounter tte
      left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = ${yearDivisionId.yearId}
    and status = ${EncounterStatus.DOUBLES}
    and ttl.divisionId = ${yearDivisionId.divisionId}
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug
  `)

  const sides = getSidesCapitalized()
  let stats = {}

  for (const league of leagueTable) {
    for (const side of sides) {
      const teamSlug = league[`team${side}Slug`]
      if (!(teamSlug in stats)) {
        stats[teamSlug] = {
          team: {
            name: league[`team${side}Name`],
            slug: teamSlug
          },
          won: 0,
          draw: 0,
          loss: 0,
          played: 0,
          points: 0
        }
      }
      const score = parseInt(league[`score${side}`])
      const opposingScore = parseInt(league[`score${getOtherSideCapitalized(side)}`])
      stats[teamSlug].played++
      stats[teamSlug].points += score
      if (score === opposingScore) {
        stats[teamSlug].draw++
      } else if (score > opposingScore) {
        stats[teamSlug].won++
      } else {
        stats[teamSlug].loss++
      }
    }
  }

  // sort stats by points, then wins, then fewest games played
  stats = Object.values(stats).sort((a, b) => {
    if (a.points === b.points) {
      if (a.won === b.won) {
        return a.played - b.played // optional: fewest games played
      }
      return b.won - a.won // most wins
    }
    return b.points - a.points // most points
  })

  return Response.json({
    stats
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearDivisionDoublesMerit({ loaderData, params }: Route.ComponentProps) {
    const {
    stats
  } = loaderData;
  const { year, division } = params

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Doubles Merit', href: `/result/${year}/${division}/doubles-merit` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division Doubles Merit Table
      </h2>
      <p>This is the doubles merit table for the <span className='capitalize'>{division}</span> division.</p>
      <DivisionalSubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4'>Name</th>
            <th className='p-2 md:p-4'>W<span className='hidden sm:inline'>on</span></th>
            <th className='p-2 md:p-4'>D<span className='hidden sm:inline'>raw</span></th>
            <th className='p-2 md:p-4'>L<span className='hidden sm:inline'>oss</span></th>
            <th className='p-2 md:p-4'>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th className='p-2 md:p-4'>P<span className='hidden sm:inline'>oin</span>ts</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-t border-dashed'>
              <td className='p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} to={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className='p-2 md:p-4 text-center'>{stat.won}</td>
              <td className='p-2 md:p-4 text-center'>{stat.draw}</td>
              <td className='p-2 md:p-4 text-center'>{stat.loss}</td>
              <td className='p-2 md:p-4 text-center'>{stat.played}</td>
              <td className='p-2 md:p-4 text-center'>{stat.points}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}