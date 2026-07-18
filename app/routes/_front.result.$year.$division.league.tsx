import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {Link} from "react-router";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import {linkStyles} from "~/styles/ui-classes";
import {getOtherSideCapitalized, getSidesCapitalized} from "~/constants/encounter";
import {buildMeta} from "~/constants/MetaData";
import {parseYearDivisionId} from "~/libraries/year";
import {getDivisionLeagueTable} from "~/repositories/encounter.repository.server";
import {getKvFromContext} from "~/kv-context.server";

export function meta({ params }: Route.MetaArgs) {
  const { year, division } = params;
  const divisionName = capitalizeFirstLetter(division);

  return buildMeta({
    title: `${divisionName} Division League Table – ${year}`,
    description: `View the ${divisionName} division league table for the ${year} season, including team standings, wins, draws, losses, matches played, and total points across all league fixtures.`,
  });
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, division } = params
  const yearDivisionId = await parseYearDivisionId(db, year, division)

  const leagueTable = await getDivisionLeagueTable(kv, db, yearDivisionId.yearId, yearDivisionId.divisionId)

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

  // sort stats by points
  stats = Object.values(stats).sort((a, b) => {
    if (a.points === b.points) {
      return a.played - b.played
    }
    return b.points - a.points
  })

  return Response.json({
    stats
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearDivisionLeague({ loaderData, params }: Route.ComponentProps) {
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
            { name: 'League', href: `/result/${year}/${division}/league` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division League Table
      </h2>
      <p>This is the league table for the <span className='capitalize'>{division}</span> division.</p>
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
            <tr key={index} className='border-dashed border-t border-t-neutral-300 hover:bg-gray-100'>
              <td className='p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} to={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className='text-center p-2 md:p-4'>{stat.won}</td>
              <td className='text-center p-2 md:p-4'>{stat.draw}</td>
              <td className='text-center p-2 md:p-4'>{stat.loss}</td>
              <td className='text-center p-2 md:p-4'>{stat.played}</td>
              <td className='text-center p-2 md:p-4'>{stat.points}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}