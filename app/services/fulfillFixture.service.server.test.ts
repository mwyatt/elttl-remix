import '@testing-library/jest-dom'
import { getConnection } from '@/lib/database'
import fulfillFixture, { getPlayerRanks } from '@/app/admin/api/fixture/[id]/fulfillFixture'
import EncounterStatus from '@/constants/EncounterStatus'
import { setup, tearDown } from '@/lib/testDatabase'
import { test, expect, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals'

const currentYearId = 12

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

const checkEncountersFulfilledAccordingToStruct = (encounters, encounterStruct, fixtureId) => {
  encounterStruct.forEach((encounterStructRow) => {
    expect(encounters.some(encounter => {
      return encounter.playerIdLeft === encounterStructRow.playerIdLeft &&
             encounter.playerIdRight === encounterStructRow.playerIdRight &&
             encounter.scoreLeft === encounterStructRow.scoreLeft &&
             encounter.scoreRight === encounterStructRow.scoreRight &&
             encounter.status === encounterStructRow.status &&
             encounter.fixtureId === fixtureId &&
             encounter.yearId === currentYearId
    })).toBeTruthy()
  })
}

test('it can fulfill a fixture and store the correct information', async () => {
  const connection = await getConnection()
  const fixtureId = 3721
  const encounterStruct = basicEncounterStruct

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(encounters.length).toBe(10)

  const [fixtures] = await connection.execute(`
    SELECT * FROM tennisFixture
    WHERE id = :fixtureId
  `, { fixtureId })
  expect(fixtures[0].timeFulfilled).toBeGreaterThan(0)

  connection.release()

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)
})

test('it can fulfill a fixture with absent players', async () => {
  const connection = await getConnection()
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

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(10)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].playerRankChangeLeft).toEqual(0)
  expect(encounters[0].playerRankChangeRight).toEqual(0)
  expect(encounters[4].playerRankChangeLeft).toEqual(0)
  expect(encounters[4].playerRankChangeRight).toEqual(0)
  expect(encounters[9].playerRankChangeLeft).toEqual(0)
  expect(encounters[9].playerRankChangeRight).toEqual(0)

  connection.release()
})

test('it can fulfill a fixture with status set', async () => {
  const connection = await getConnection()
  const fixtureId = 3719
  const encounterStruct = [
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: '' }
  ]

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[1].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[2].status).toEqual(EncounterStatus.NONE)

  connection.release()
})

test('it can rollback and fulfil the same fixture', async () => {
  const connection = await getConnection()

  const fixtureId = 3721

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [initialEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(initialEncounters.length).toBe(10)

  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' }
  ]

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(beforeEncounters.length).toBe(10)

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  connection.release()
})

test('it can rollback and unfulfill a fixture', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [initialEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(initialEncounters.length).toBe(10)

  await fulfillFixture(fixtureId, basicEncounterStruct, true)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(0)

  const [fixtures] = await connection.execute(`
    SELECT * FROM tennisFixture
    WHERE id = :fixtureId
  `, { fixtureId })
  expect(fixtures[0].timeFulfilled).toBe(0)

  // check ranks

  connection.release()
})

test('it cant rollback and unfulfill a fixture which has not been fulfilled yet', async () => {
  await expect(fulfillFixture(3721, basicEncounterStruct, true)).rejects.toThrow(
    'Cannot rollback a fixture that has not been fulfilled.'
  )
})

test('it can rollback and refulfill a fixture when it is already fulfilled', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(10)

  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(fixtureId, encounterStruct)

  const [refulfillEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(refulfillEncounters.length).toBe(3)

  connection.release()
})

test('it can rollback and refulfill a fixture with different players', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  // Player 2 will only be involved with the first fulfillment, but not the second
  const [initialPlayers] = await connection.execute(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = :playerId
  `, { playerId: 2 })
  expect(initialPlayers[0].rank).toBe(1457)

  // Player 7 will only be involved with the second fulfillment
  const [initialNewPlayers] = await connection.execute(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = :playerId
  `, { playerId: 7 })
  expect(initialNewPlayers[0].rank).toBe(1400)

  const firstEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' }
  ]

  await fulfillFixture(fixtureId, firstEncounterStruct)

  const secondEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 7, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' }
  ]

  await fulfillFixture(fixtureId, secondEncounterStruct)

  // Player 2 was involved with the first fulfillment, but not the second - their rank should result as unchanged
  const [unchangedPlayers] = await connection.execute(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = :playerId
  `, { playerId: 2 })
  expect(unchangedPlayers[0].rank).toBe(1457)

  // Player 7 was only involved with the second fulfillment - their rank should have changed
  const [newPlayers] = await connection.execute(`
      SELECT \`rank\`
      FROM tennisPlayer
      WHERE id = :playerId
  `, { playerId: 7 })
  expect(newPlayers[0].rank).toBe(1475)

  connection.release()
})

test('it will produce the right rank changes when fulfilling and fulfilling consecutively', async () => {
  const connection = await getConnection()
  const fixtureId = 3718

  await connection.execute('UPDATE tennisPlayer SET `rank` = 2500 WHERE id = 1;')
  await connection.execute('UPDATE tennisPlayer SET `rank` = 2600 WHERE id = 4;')

  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`SELECT * FROM tennisEncounter WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters[0].playerRankChangeLeft).toEqual(-5)
  expect(encounters[0].playerRankChangeRight).toEqual(8)

  const playerRanks = await getPlayerRanks(connection, 12, encounterStruct)

  expect(playerRanks[1]).toEqual(2495)
  expect(playerRanks[4]).toEqual(2608)

  const nextEncounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(fixtureId, nextEncounterStruct)

  const nextPlayerRanks = await getPlayerRanks(connection, 12, nextEncounterStruct)

  expect(nextPlayerRanks[1]).toEqual(2516)
  expect(nextPlayerRanks[4]).toEqual(2594)

  connection.release()
})

test('it will produce the right rank changes when rolling back', async () => {
  const connection = await getConnection()
  const fixtureId = 3718
  const encounterStruct = [
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 3, scoreRight: 2, status: '' },
    { playerIdLeft: 10, playerIdRight: 11, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (10, 12, 'Ryan', 2000);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (11, 12, 'Dylan', 2100);
  `)

  const playerRanks = await getPlayerRanks(connection, 12, encounterStruct)

  expect(playerRanks[10]).toBe(2000)
  expect(playerRanks[11]).toBe(2100)

  await fulfillFixture(fixtureId, encounterStruct)

  const secondPlayerRanks = await getPlayerRanks(connection, 12, encounterStruct)
  expect(secondPlayerRanks[10]).toBe(2010)
  expect(secondPlayerRanks[11]).toBe(2103)

  const [afterEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(afterEncounters.length).toBe(3)

  await fulfillFixture(fixtureId, encounterStruct)

  const [afterRollbackEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(afterRollbackEncounters.length).toBe(3)

  const thirdPlayerRanks = await getPlayerRanks(connection, 12, encounterStruct)
  expect(thirdPlayerRanks[10]).toBe(2010)
  expect(thirdPlayerRanks[11]).toBe(2103)

  connection.release()
})

test('it will throw an error if there are not enough / too many encounters submitted', async () => {
  const fixtureId = 3718
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(fixtureId, encounterStruct)).rejects.toThrow(
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
  await expect(fulfillFixture(fixtureId, tooManyEncounters)).rejects.toThrow(
    'Encounter structure exceeds maximum of 10 encounters. Received 11.'
  )
})

test('it will throw an error if the fixture could not be found', async () => {
  const fixtureId = 9999 // Non-existing fixture ID
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(fixtureId, encounterStruct)).rejects.toThrow(
    'Fixture with ID 9999 not found for year 12.'
  )
})

test('it keeps previous / existing encounter data intact during fulfillment and rollback', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  await fulfillFixture(3720, basicEncounterStruct)
  await fulfillFixture(3719, basicEncounterStruct)

  const [existingEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
  `)
  expect(existingEncounters.length).toBe(20)

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [encountersAfterAFulfillment] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != :fixtureId
  `, { fixtureId })

  expect(encountersAfterAFulfillment).toEqual(existingEncounters)

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [encountersAfterRollback] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != :fixtureId
  `, { fixtureId })

  expect(encountersAfterRollback).toEqual(existingEncounters)

  connection.release()
})

test('it will throw an error if one of the encounters does not have a winner', async () => {
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 2, status: '' }
  ]

  await expect(fulfillFixture(3721, encounterStruct)).rejects.toThrow(
    'All encounters must have a winner with a score of 3.'
  )
})

beforeAll(async () => {
  const connection = await setup()

  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await connection.execute('INSERT INTO options (id, name, value) VALUES (20, \'year_id\', \'12\');')

  connection.close()
})

beforeEach(async () => {
  const connection = await getConnection()

  const commands = [
      `INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
      VALUES (3721, 12, 1, 2, 0);`,
      `INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3720, 12, 1, 2, 0);`,
      `INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3719, 12, 1, 2, 0);`,
      `    INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3718, 12, 1, 2, 0);`,
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (1, 12, \'Ryan\', 1960);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (2, 12, \'Dylan\', 1457);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (3, 12, \'Scott\', 1895);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (4, 12, \'Dan\', 2012);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (5, 12, \'Ian\', 1829);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (6, 12, \'Francis\', 2029);',
      'INSERT INTO tennisPlayer (id, yearId, nameLast, `rank`) VALUES (7, 12, \'David\', 1400);'
  ]

  await Promise.all(commands.map(command => connection.query(command)))

  connection.release()
})

afterEach(async () => {
  const connection = await getConnection()

  await connection.execute('DELETE FROM tennisEncounter;')
  await connection.execute('DELETE FROM tennisFixture;')
  await connection.execute('DELETE FROM tennisPlayer;')

  connection.release()
})

afterAll(tearDown)
