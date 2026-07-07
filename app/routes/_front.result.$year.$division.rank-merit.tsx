import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import {getRankMeritEncountersByDivisionId} from "~/repositories/encounter.repository.server";
import {buildMeta} from "~/constants/MetaData";
import {parseYearDivisionId} from "~/libraries/year";
import {getOtherSideCapitalized, getSidesCapitalized} from "~/constants/encounter";
import {
  baseMerit,
  convertRankChangeToDifficultyScore,
  difficultyFactor,
  meritScore,
  participationFactor
} from "~/libraries/merit.lib";
import {playerGetMany} from "~/repositories/player.repository.server";

export function meta({ params }: Route.MetaArgs) {
  const { year, division } = params;
  const divisionName = capitalizeFirstLetter(division);

  return buildMeta({
    title: `${divisionName} Division Merit Table – ${year}`,
    description: `View the ${divisionName} division merit table for the ${year} season, including player rankings, wins, matches played, averages, encounter counts, and team information across all league fixtures.`,
  });
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, division } = params
  const yearDivisionId = await parseYearDivisionId(db, year, division)
  const sides = getSidesCapitalized()
  const encounters = await getRankMeritEncountersByDivisionId(db, yearDivisionId.yearId, yearDivisionId.divisionId)

  let stats = {}
  let playerIds = {}

  for (const encounter of encounters) {
    for (const side of sides) {
      const playerId = encounter[`playerId${side}`]
      playerIds[playerId] = playerId
      if (!(playerId in stats)) {
        stats[playerId] = {
          playerId,
          won: 0,
          lost: 0,
          difference: 0,
          encountersWon: 0,
          encountersLost: 0,
          played: 0,
          encounter: 0,
          average: 0,
          difficultyScores: [],
        }
      }

      const score = parseInt(encounter[`score${side}`])
      const opposingScore = parseInt(encounter[`score${getOtherSideCapitalized(side)}`])
      stats[playerId].won += score
      stats[playerId].played += (score + opposingScore)
      stats[playerId].encounter++
      stats[playerId].encountersWon += score > opposingScore ? 1 : 0
      stats[playerId].encountersLost += score < opposingScore ? 1 : 0
      stats[playerId].difficultyScores.push(convertRankChangeToDifficultyScore(encounter[`playerRankChange${side}`]))
    }
  }

  // @todo calculate this using fulfilled fixtures
  const totalPossibleMatches = 18
  const totalPossibleEncounters = totalPossibleMatches * 3
  const statsArray = Object.values(stats)
  const players = await playerGetMany(db, yearDivisionId.yearId, Object.values(playerIds))

  let ranked = statsArray
    .map(stat => ({
      ...stat,
      difficultyFactor: difficultyFactor(stat.difficultyScores),
      participationFactor: participationFactor(stat.encounter, totalPossibleEncounters),
      baseMerit: baseMerit(stat.won, stat.played),
      player: players.find(p => p.id === stat.playerId)
    }))

  ranked = ranked
    .map(stat => ({
      ...stat,
      meritScore: meritScore(stat.baseMerit, stat.difficultyFactor, stat.participationFactor),
    }))
    .sort((a, b) => b.meritScore - a.meritScore);

  return Response.json({
    stats: ranked
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearDivisionMerit({ loaderData, params }: Route.ComponentProps) {
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
            { name: 'Merit Table', href: `/result/${year}/${division}/merit` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division Merit Table v2
      </h2>
      <p>This is the merit table for the <span className='capitalize'>{division}</span> division.</p>
      <DivisionalSubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4'>Name</th>
            <th className='p-2 md:p-4'>Av<span className='hidden sm:inline'>era</span>g<span className='hidden sm:inline'>e</span></th>
            <th className='p-2 md:p-4'>Difficulty</th>
            <th className='p-2 md:p-4'>Participation</th>
            <th className='p-2 md:p-4'>Merit</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-t border-t-neutral-300 border-dashed hover:bg-gray-100'>
              <td className='p-2 md:p-4'>
                  <span>{stat.player.name}</span>
              </td>
              <td className='p-2 md:p-4 text-center'>{stat.baseMerit}</td>
              <td className='p-2 md:p-4 text-center'>{stat.difficultyFactor}</td>
              <td className='p-2 md:p-4 text-center'>{stat.participationFactor}</td>
              <td className='p-2 md:p-4 text-center'>{stat.meritScore}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}