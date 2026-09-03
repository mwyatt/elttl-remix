import {getDivisionLeagueTable} from "~/repositories/encounter.repository.server";
import {getOtherSideCapitalized, getSidesCapitalized} from "~/constants/encounter";

export const getTheDivisionLeagueTable = async (kv, db, yearId, divisionId) => {
    const leagueTable = await getDivisionLeagueTable(kv, db, yearId, divisionId)

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

  return stats
}
