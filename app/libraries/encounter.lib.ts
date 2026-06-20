import { getOtherSideCapitalized, getSidesCapitalized, rankChangeMap } from '@/constants/encounter.js'
import EncounterStatus from '@/constants/EncounterStatus'

export function getRankChanges (
  scoreLeft,
  scoreRight,
  rankLeft,
  rankRight
) {
  const rankDifference = Math.abs(rankLeft - rankRight)
  const winnerKey = scoreLeft > scoreRight ? 0 : 1
  const favouriteKey = rankLeft > rankRight ? 0 : 1
  const favouriteWon = winnerKey === favouriteKey

  for (const [differenceThreshold, modifierGroups] of Object.entries(rankChangeMap)) {
    if (rankDifference <= differenceThreshold) {
      return [
        modifierGroups[favouriteWon ? 0 : 1][winnerKey === 0 ? 0 : 1],
        modifierGroups[favouriteWon ? 0 : 1][winnerKey === 1 ? 0 : 1]
      ]
    }
  }

  return new Error('No rank changes assigned')
}

export function doesEncounterHaveNoPlayer (encounter) {
  return (
    encounter.status === EncounterStatus.DOUBLES ||
    encounter.playerIdLeft === null ||
    encounter.playerIdRight === null ||
    encounter.playerIdLeft === 0 ||
    encounter.playerIdRight === 0
  )
}

export function getEncounterMerit (encounters) {
  const sides = getSidesCapitalized()
  let stats = {}

  for (const encounter of encounters) {
    for (const side of sides) {
      const playerSlug = encounter[`player${side}Slug`]
      const playerId = encounter[`player${side}Id`]
      if (!(playerSlug in stats)) {
        stats[playerSlug] = {
          player: {
            id: playerId,
            name: encounter[`player${side}Name`],
            slug: playerSlug,
            rank: encounter[`player${side}Rank`]
          },
          team: {
            name: encounter[`team${side}Name`],
            slug: encounter[`team${side}Slug`]
          },
          won: 0,
          lost: 0,
          difference: 0,
          encountersWon: 0,
          encountersLost: 0,
          played: 0,
          encounter: 0,
          average: 0
        }
      }

      const score = parseInt(encounter[`score${side}`])
      const opposingScore = parseInt(encounter[`score${getOtherSideCapitalized(side)}`])
      stats[playerSlug].won += score
      stats[playerSlug].played += (score + opposingScore)
      stats[playerSlug].encounter++
      stats[playerSlug].encountersWon += score > opposingScore ? 1 : 0
      stats[playerSlug].encountersLost += score < opposingScore ? 1 : 0
    }
  }

  // calculate average
  for (const playerSlug in stats) {
    stats[playerSlug].average = stats[playerSlug].won / stats[playerSlug].played
  }

  // calculate lost
  for (const playerSlug in stats) {
    stats[playerSlug].lost = stats[playerSlug].played - stats[playerSlug].won
  }

  // calculate difference
  for (const playerSlug in stats) {
    stats[playerSlug].difference = stats[playerSlug].won - stats[playerSlug].lost
  }

  // sort by average
  stats = Object.values(stats).sort((a, b) => {
    return b.average - a.average
  })

  return stats
}
