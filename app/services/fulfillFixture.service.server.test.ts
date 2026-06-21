import { test, expect, beforeAll, afterEach, afterAll, beforeEach } from "vitest"
import { getTestDb } from "~/test/db-test.server"
import { resetTestDb } from "~/test/reset-db.server"
import { sql } from "drizzle-orm"
import fulfillFixture, { getPlayerRanks } from '~/services/fulfillFixture.service.server'
import EncounterStatus from '~/constants/EncounterStatus'
import {getLatestYear} from "~/repositories/year.repository.server";

const basicEncounterStruct = [
  { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
  { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
  { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 1, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
  { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: EncounterStatus.DOUBLES },
  { playerIdLeft: 2, playerIdRight: 4, scoreLeft: 3, scoreRight: 1, status: '' },
  { playerIdLeft: 3, playerIdRight: 6, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 2, playerIdRight: 5, scoreLeft: 3, scoreRight: 1, status: '' },
  { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' }
]

const checkEncountersFulfilledAccordingToStruct = async (encounters, encounterStruct, fixtureId) => {
    const db = getTestDb()
  const latestYear = await getLatestYear(db)

  encounterStruct.forEach((encounterStructRow) => {
    expect(encounters.some(encounter => {
      return encounter.playerIdLeft === encounterStructRow.playerIdLeft &&
             encounter.playerIdRight === encounterStructRow.playerIdRight &&
             encounter.scoreLeft === encounterStructRow.scoreLeft &&
             encounter.scoreRight === encounterStructRow.scoreRight &&
             encounter.status === encounterStructRow.status &&
             encounter.fixtureId === fixtureId &&
             encounter.yearId === latestYear.id
    })).toBeTruthy()
  })
}

test('it can fulfill a fixture and store the correct information', async () => {
  const db = getTestDb()
  const fixtureId = 3721
  const encounterStruct = basicEncounterStruct

  await fulfillFixture(db, fixtureId, encounterStruct)

  const encounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)
  expect(encounters.length).toBe(10)

  const fixtures = await db.all(`
    SELECT * FROM tennisFixture
    WHERE id = ${fixtureId}
  `)
  expect(fixtures[0].timeFulfilled).toBeGreaterThan(0)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)
})

test('it can fulfill a fixture with absent players', async () => {
  const db = getTestDb()
  const fixtureId = 3720
  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: EncounterStatus.DOUBLES },
    { playerIdLeft: 2, playerIdRight: 4, scoreLeft: 3, scoreRight: 1, status: '' },
    { playerIdLeft: 3, playerIdRight: 6, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 5, scoreLeft: 3, scoreRight: 1, status: '' },
    { playerIdLeft: 0, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(db, fixtureId, encounterStruct)

  const encounters = await db.all(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters.length).toBe(10)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].playerRankChangeLeft).toEqual(0)
  expect(encounters[0].playerRankChangeRight).toEqual(0)
  expect(encounters[4].playerRankChangeLeft).toEqual(0)
  expect(encounters[4].playerRankChangeRight).toEqual(0)
  expect(encounters[9].playerRankChangeLeft).toEqual(0)
  expect(encounters[9].playerRankChangeRight).toEqual(0)
})

test('it can fulfill a fixture with status set', async () => {
  const db = getTestDb()
  const fixtureId = 3719
  const encounterStruct = [
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: '' }
  ]

  await fulfillFixture(db, fixtureId, encounterStruct)

  const encounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[1].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[2].status).toEqual(EncounterStatus.NONE)
})

test('it can rollback and fulfil the same fixture', async () => {
  const db = getTestDb()
  const fixtureId = 3721

  await fulfillFixture(db, fixtureId, basicEncounterStruct)

  const initialEncounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(initialEncounters.length).toBe(10)

  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' }
  ]

  const beforeEncounters = await db.all(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)
  expect(beforeEncounters.length).toBe(10)

  await fulfillFixture(db, fixtureId, encounterStruct)

  const encounters = await db.all(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)
})

test('it can rollback and unfulfill a fixture', async () => {
  const db = getTestDb()
  const fixtureId = 3721

  await fulfillFixture(db, fixtureId, basicEncounterStruct)

  const initialEncounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(initialEncounters.length).toBe(10)

  await fulfillFixture(db, fixtureId, basicEncounterStruct, true)

  const encounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters.length).toBe(0)

  const fixtures = await db.all(sql`
    SELECT * FROM tennisFixture
    WHERE id = ${fixtureId}
  `)
  expect(fixtures[0].timeFulfilled).toBe(0)

  // @todo check ranks?
})

test('it cant rollback and unfulfill a fixture which has not been fulfilled yet', async () => {
    const db = getTestDb()

  await expect(fulfillFixture(db, 3721, basicEncounterStruct, true)).rejects.toThrow(
    'Cannot rollback a fixture that has not been fulfilled.'
  )
})

test('it can rollback and refulfill a fixture when it is already fulfilled', async () => {
  const db = getTestDb()
  const fixtureId = 3721

  await fulfillFixture(db, fixtureId, basicEncounterStruct)

  const encounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters.length).toBe(10)

  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(db, fixtureId, encounterStruct)

  const refulfillEncounters = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)

  expect(refulfillEncounters.length).toBe(3)
})

test('it can rollback and refulfill a fixture with different players', async () => {
  const db = getTestDb()
  const fixtureId = 3721

  // Player 2 will only be involved with the first fulfillment, but not the second
  const initialPlayers = await db.all(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = ${2}
  `)
  expect(initialPlayers[0].rank).toBe(1457)

  // Player 7 will only be involved with the second fulfillment
  const initialNewPlayers = await db.all(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = ${7}
  `)
  expect(initialNewPlayers[0].rank).toBe(1400)

  const firstEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' }
  ]

  await fulfillFixture(db, fixtureId, firstEncounterStruct)

  const secondEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 7, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' }
  ]

  await fulfillFixture(db, fixtureId, secondEncounterStruct)

  // Player 2 was involved with the first fulfillment, but not the second - their rank should result as unchanged
  const unchangedPlayers = await db.all(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = ${2}
  `)
  expect(unchangedPlayers[0].rank).toBe(1457)

  // Player 7 was only involved with the second fulfillment - their rank should have changed
  const newPlayers = await db.all(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = ${7}
  `)
  expect(newPlayers[0].rank).toBe(1475)
})

test('it will produce the right rank changes when fulfilling and fulfilling consecutively', async () => {
  const db = getTestDb()
  const fixtureId = 3718
  const latestYear = await getLatestYear(db)

  await db.run(sql`UPDATE tennisPlayer SET \`rank\` = 2500 WHERE id = 1;`)
  await db.run(sql`UPDATE tennisPlayer SET \`rank\` = 2600 WHERE id = 4;`)

  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(db, fixtureId, encounterStruct)

  const encounters = await db.all(`SELECT * FROM tennisEncounter WHERE fixtureId = ${fixtureId}
  `)

  expect(encounters[0].playerRankChangeLeft).toEqual(-5)
  expect(encounters[0].playerRankChangeRight).toEqual(8)

  const playerRanks = await getPlayerRanks(db, latestYear.id, encounterStruct)

  expect(playerRanks[1]).toEqual(2495)
  expect(playerRanks[4]).toEqual(2608)

  const nextEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(db, fixtureId, nextEncounterStruct)

  const nextPlayerRanks = await getPlayerRanks(db, latestYear.id, nextEncounterStruct)

  expect(nextPlayerRanks[1]).toEqual(2516)
  expect(nextPlayerRanks[4]).toEqual(2594)
})

test('it will produce the right rank changes when rolling back', async () => {
  const db = getTestDb()
    const latestYear = await getLatestYear(db)

  const fixtureId = 3718
  const encounterStruct = [
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 3, scoreRight: 2, status: '' },
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  await db.run(sql`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (10, ${latestYear.id}, 'Ryan', 2000);
  `)
  await db.run(sql`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (11, ${latestYear.id}, 'Dylan', 2100);
  `)

  const playerRanks = await getPlayerRanks(db, latestYear.id, encounterStruct)

  expect(playerRanks[10]).toBe(2000)
  expect(playerRanks[11]).toBe(2100)

  await fulfillFixture(db, fixtureId, encounterStruct)

  const secondPlayerRanks = await getPlayerRanks(db, latestYear.id, encounterStruct)
  expect(secondPlayerRanks[10]).toBe(2010)
  expect(secondPlayerRanks[11]).toBe(2103)

  const afterEncounters = await db.all(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)
  expect(afterEncounters.length).toBe(3)

  await fulfillFixture(db, fixtureId, encounterStruct)

  const afterRollbackEncounters = await db.all(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = ${fixtureId}
  `)
  expect(afterRollbackEncounters.length).toBe(3)

  const thirdPlayerRanks = await getPlayerRanks(db, latestYear.id, encounterStruct)
  expect(thirdPlayerRanks[10]).toBe(2010)
  expect(thirdPlayerRanks[11]).toBe(2103)
})

test('it will throw an error if there are not enough / too many encounters submitted', async () => {
  const db = getTestDb()
  const fixtureId = 3718
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(db, fixtureId, encounterStruct)).rejects.toThrow(
    'Encounter structure must contain at least 3 encounters to infer the player positions.'
  )

  const tooManyEncounters = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]
  await expect(fulfillFixture(db, fixtureId, tooManyEncounters)).rejects.toThrow(
    'Encounter structure exceeds maximum of 10 encounters. Received 11.'
  )
})

test('it will throw an error if the fixture could not be found', async () => {
  const db = getTestDb()
  const fixtureId = 9999 // Non-existing fixture ID
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(db, fixtureId, encounterStruct)).rejects.toThrow(
    /Fixture with ID 9999 not found for year/
  )
})

test('it keeps previous / existing encounter data intact during fulfillment and rollback', async () => {
  const db = getTestDb()
  const fixtureId = 3721

  await fulfillFixture(db, 3720, basicEncounterStruct)
  await fulfillFixture(db, 3719, basicEncounterStruct)

  const existingEncounters = await db.all(sql`
    SELECT * FROM tennisEncounter
  `)
  expect(existingEncounters.length).toBe(20)

  await fulfillFixture(db, fixtureId, basicEncounterStruct)

  const encountersAfterAFulfillment = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != ${fixtureId}
  `)

  expect(encountersAfterAFulfillment).toEqual(existingEncounters)

  await fulfillFixture(db, fixtureId, basicEncounterStruct)

  // @todo helper getters for these
  const encountersAfterRollback = await db.all(sql`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != ${fixtureId}
  `)

  expect(encountersAfterRollback).toEqual(existingEncounters)
})

test('it will throw an error if one of the encounters does not have a winner', async () => {
    const db = getTestDb()
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 2, status: '' }
  ]

  await expect(fulfillFixture(db, 3721, encounterStruct)).rejects.toThrow(
    'All encounters must have a winner with a score of 3.'
  )
})

beforeAll(async () => {
  await resetTestDb()
  const db = getTestDb()

  await db.run(sql`INSERT INTO tennisYear (name, value) VALUES (\'2024\', \'\');`)

  const latestYear = await getLatestYear(db)

  await db.run(sql`INSERT INTO options (id, name, value) VALUES (20, \'year_id\', ${latestYear.id});`)
})

beforeEach(async () => {
  const db = getTestDb()
  const latestYear = await getLatestYear(db)

  await db.run(sql`INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
        VALUES (3721, ${latestYear.id}, 1, 2, 0);`)
  await db.run(sql`INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
      VALUES (3720, ${latestYear.id}, 1, 2, 0);`)
  await db.run(sql`INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
      VALUES (3719, ${latestYear.id}, 1, 2, 0);`)
  await db.run(sql`INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
      VALUES (3718, ${latestYear.id}, 1, 2, 0);`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (1, ${latestYear.id}, \'Ryan\', 1960)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (2, ${latestYear.id}, \'Dylan\', 1457)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (3, ${latestYear.id}, \'Scott\', 1895)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (4, ${latestYear.id}, \'Dan\', 2012)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (5, ${latestYear.id}, \'Ian\', 1829)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (6, ${latestYear.id}, \'Francis\', 2029)`)
  await db.run(sql`INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (7, ${latestYear.id}, \'David\', 1400)`)
})

afterEach(async () => {
  const db = getTestDb()

  await db.run(sql`DELETE FROM tennisEncounter;`)
  await db.run(sql`DELETE FROM tennisFixture;`)
  await db.run(sql`DELETE FROM tennisPlayer;`)
})

afterAll(async () => {
  await resetTestDb()
})
