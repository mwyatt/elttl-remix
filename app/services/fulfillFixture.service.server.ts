import { doesEncounterHaveNoPlayer, getRankChanges } from '~/libraries/encounter.lib'
import {
  getSideIndex,
  getSidesCapitalized,
  maxEncounters,
  minEncounters,
  SIDE_LEFT,
  SIDE_RIGHT
} from '~/constants/encounter'
import uniq from "lodash/uniq";
import filter from "lodash/filter";
import { playerGetMany } from '~/repositories/player.repository.server'
import {getCurrentYear} from "~/repositories/year.repository.server";
const TRACE_RANK_CHANGES = true

const logRankChange = (...args) => {
  if (TRACE_RANK_CHANGES) {
    console.debug('TRACE_RANK_CHANGES', ...args)
  }
}

export const getPlayerRanks = async (db, yearId, encounterStruct) => {
  const playerIds = uniq(getPlayerIdsFromEncounterStruct(encounterStruct))
  const players = await playerGetMany(db, yearId, playerIds)

  if (players.length !== playerIds.length) {
    throw new Error('Unable to find all involved players.')
  }

  // Create a map of player ranks for easy access
  const playerRanks = {}
  players.forEach((player) => {
    playerRanks[parseInt(player.id)] = player.rank
  })

  return playerRanks
}

export const getPlayerIdsFromEncounterStruct = (encounterStruct) => {
  return filter([
    encounterStruct[0].playerIdLeft,
    encounterStruct[2].playerIdLeft,
    encounterStruct[1].playerIdLeft,
    encounterStruct[1].playerIdRight,
    encounterStruct[0].playerIdRight,
    encounterStruct[2].playerIdRight
  ], value => value !== 0)
}

async function rollBackFixture (db, currentYearId, fixtureId) {

  // Find the existing encounters for this fixture
  const existingEncounters = await db.all(`
        SELECT
            id,
            playerIdLeft,
            playerIdRight,
            playerRankChangeLeft,
            playerRankChangeRight,
            scoreLeft,
            scoreRight,
            status
        FROM tennisEncounter
        WHERE yearId = ${currentYearId}
          and fixtureId = ${fixtureId}
    `)

  // We need the player ranks for the existing encounters to roll them back
  const playerRanks = await getPlayerRanks(db, currentYearId, existingEncounters)

  // reverse the order of encounters
  existingEncounters.reverse()

  // roll back the rank changes
  existingEncounters.map(async (encounter) => {
    for (const sideCapitalized of getSidesCapitalized()) {
      const playerId = parseInt(encounter[`playerId${sideCapitalized}`])

      if (!doesEncounterHaveNoPlayer(encounter)) {
        const playerRank = playerRanks[playerId]
        const playerRankChange = encounter[`playerRankChange${sideCapitalized}`]
        playerRanks[playerId] = playerRank - playerRankChange

        logRankChange('rolling back rank change:', { playerId, playerRank, playerRankChange }, playerRanks)
      }
    }
  })

  const encounterIdsSql = existingEncounters.map(encounter => encounter.id).join(',')

  await db.run(`
        DELETE FROM tennisEncounter
        WHERE yearId = ${currentYearId}
          and id in(${encounterIdsSql})
    `)

  return playerRanks
}

export default async function fulfillFixture (db, fixtureId, encounterStruct, rollbackOnly = false) {
  logRankChange('fulfilling fixture:', fixtureId, encounterStruct)

  const sidesCapitalized = getSidesCapitalized()

  if (encounterStruct.length > maxEncounters) {
    throw new Error(`Encounter structure exceeds maximum of ${maxEncounters} encounters. Received ${encounterStruct.length}.`)
  }

  const hasEncounterWithoutWinner = encounterStruct.some((encounter) => {
    return encounter[`score${sidesCapitalized[0]}`] !== 3 && encounter[`score${sidesCapitalized[1]}`] !== 3
  })

  if (hasEncounterWithoutWinner) {
    throw new Error('All encounters must have a winner with a score of 3.')
  }

  // @todo experiment with transaction, simulate failure part way through and check to see if db rolled back
  // await connection.beginTransaction()

  const currentYear = await getCurrentYear(db)

  const fixtures = await db.all(`
      SELECT 
          tf.id,
          tf.timeFulfilled
      FROM tennisFixture tf
        WHERE tf.yearId = ${currentYear.id}
      and tf.id = ${fixtureId}
  `)

  const fixture = fixtures[0]

  if (!fixture) {
    throw new Error(`Fixture with ID ${fixtureId} not found for year ${currentYear.id}.`)
  }

  if (!fixture.timeFulfilled && rollbackOnly) {
    throw new Error('Cannot rollback a fixture that has not been fulfilled.')
  }

  const nowEpoch = Date.now().toString()

  // Update the fixture time fulfilled
  const updateFixtureData = {
    yearId: currentYear.id,
    fixtureId,
    timeFulfilled: rollbackOnly ? 0 : nowEpoch.substring(0, nowEpoch.length - 3)
  }

  if (encounterStruct.length < minEncounters) {
    throw new Error('Encounter structure must contain at least 3 encounters to infer the player positions.')
  }

  let playerRanks = {}

  if (fixture.timeFulfilled) {
    playerRanks = await rollBackFixture(db, currentYear.id, fixtureId)
  }

  // We need the player ranks for the new encounter structure to apply the rank changes
  // Some of the players may not have existed in the previous structure, so we need to get all player ranks again
  // Merge the existing player ranks from the rollback with any new players
  const newPlayerRanks = await getPlayerRanks(db, currentYear.id, encounterStruct)
  playerRanks = { ...newPlayerRanks, ...playerRanks }

  logRankChange('player ranks after rollback and merge:', playerRanks)

  // Apply the new rank changes
  if (!rollbackOnly) {
    for (const encounter of encounterStruct) {
      let rankChanges = [0, 0]

      if (doesEncounterHaveNoPlayer(encounter)) {
        // 'Skipping apply rank changes for doubles or missing player'
      } else {
        logRankChange('getting rank changes:', [
          encounter,
          playerRanks[encounter.playerIdLeft],
          playerRanks[encounter.playerIdRight]
        ])

        rankChanges = getRankChanges(
          encounter.scoreLeft,
          encounter.scoreRight,
          playerRanks[encounter.playerIdLeft],
          playerRanks[encounter.playerIdRight]
        )

        for (const sideCapitalized of getSidesCapitalized()) {
          const sideIndex = getSideIndex(sideCapitalized)
          playerRanks[encounter[`playerId${sideCapitalized}`]] = playerRanks[encounter[`playerId${sideCapitalized}`]] + rankChanges[sideIndex]
        }

        logRankChange('applying new rank changes:', rankChanges, playerRanks)
      }

      const insertData = {
        yearId: currentYear.id,
        fixtureId,
        playerIdLeft: encounter.playerIdLeft,
        playerIdRight: encounter.playerIdRight,
        playerRankChangeLeft: rankChanges[getSideIndex(SIDE_LEFT)],
        playerRankChangeRight: rankChanges[getSideIndex(SIDE_RIGHT)],
        scoreLeft: encounter.scoreLeft,
        scoreRight: encounter.scoreRight,
        status: encounter.status
      }

      await db.run(`
            INSERT INTO tennisEncounter
            (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
            VALUES (:yearId, :fixtureId, :playerIdLeft, :playerIdRight, :playerRankChangeLeft, :playerRankChangeRight, :scoreLeft, :scoreRight, :status)
        `, {
              ':yearId': insertData.yearId,
    ':fixtureId': insertData.fixtureId,
    ':playerIdLeft': insertData.playerIdLeft,
    ':playerIdRight': insertData.playerIdRight,
    ':playerRankChangeLeft': insertData.playerRankChangeLeft,
    ':playerRankChangeRight': insertData.playerRankChangeRight,
    ':scoreLeft': insertData.scoreLeft,
    ':scoreRight': insertData.scoreRight,
    ':status': insertData.status ?? ''
      })
    }
  }

  await db.run(`
      UPDATE tennisFixture tf
      SET tf.timeFulfilled = :timeFulfilled
      WHERE tf.yearId = :yearId
        and id = :fixtureId
  `, {
    ':timeFulfilled': updateFixtureData.timeFulfilled,
    ':yearId': updateFixtureData.yearId,
    ':fixtureId': updateFixtureData.fixtureId
  })

  logRankChange('player ranks before update:', playerRanks)

  // Update player ranks in memory
  for (const playerId in playerRanks) {
    const playerRank = playerRanks[playerId]
    await db.run(`
          UPDATE tennisPlayer tp
          SET tp.rank = ${playerRank}
          WHERE yearId = ${currentYear.id}
            and id = ${parseInt(playerId)}
      `)
  }

  // @todo experiment with this, transaction, to avoid database issues
  // await connection.commit()
}
