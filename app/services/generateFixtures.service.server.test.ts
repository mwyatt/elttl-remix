import {afterAll, beforeAll, expect, test} from "vitest"
import {getTestDb, resetTestDb} from "~/test/db-test.server"
import generateFixtures from "~/services/generateFixtures.service.server";
import {sql} from "drizzle-orm";

const yearId = 12
const teamCount = 3

test('it can generate fixtures for all the teams in all the divisions for the year', async () => {
      const db = getTestDb()

  const fixturesBefore = await db.all('SELECT * FROM tennisFixture')
  expect(fixturesBefore.length).toBe(0)

  await generateFixtures(db)

  const teams = await db.all(`SELECT * FROM tennisTeam WHERE yearId = ${yearId}`)
  expect(teams.length).toBe(teamCount)

  const fixturesAfter = await db.all('SELECT * FROM tennisFixture')
  expect(fixturesAfter.length).toBe(teamCount * (teamCount - 1)) // Each team plays every other team once
})

test('it will throw an error if there are fixtures already', async () => {
      const db = getTestDb()

  await db.run(`
    INSERT INTO tennisFixture (yearId, teamIdLeft, teamIdRight)
    VALUES (12, 1, 2)
  `)

  const fixturesBefore = await db.all('SELECT * FROM tennisFixture')
  expect(fixturesBefore.length).toBe(1) // Each team plays every other team once

  await expect(generateFixtures(db)).rejects.toThrow(
    `Year with ID 12 already has fixtures. Use 'ignoreExistingFixtures' to bypass this check.`
  )
})

// test('it can remove existing fixtures and encounters when forced to', async () => {
//       const db = getTestDb()
//
//   const fixturesBefore = await db.all('SELECT * FROM tennisFixture')
//   expect(fixturesBefore.length).toBe(teamCount * (teamCount - 1)) // Each team plays every other team once
//
//   await db.run(`
//           INSERT INTO tennisEncounter
//           (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
//           VALUES (${yearId}, ${fixturesBefore[0].id}, 1, 2, 0, 0, 3, 0, 'NONE')
//       `)
//
//   const encountersBefore = await db.all('SELECT * FROM tennisEncounter')
//   expect(encountersBefore.length).toBe(1)
//
//   await db.run(`
// INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (4, 12, 'Late Comers', 'late-comers', 1, 42, 5, 1);
//   `)
//   const newTeamCount = teamCount + 1
//
//   await generateFixtures(db)
//
//   const fixturesAfter = await db.all('SELECT * FROM tennisFixture')
//   expect(fixturesAfter.length).toBe(newTeamCount * (newTeamCount - 1)) // Each team plays every other team once
//
//   const encountersAfter = await db.all('SELECT * FROM tennisEncounter')
//   expect(encountersAfter.length).toBe(0)
// })

test('it will not remove fixture or encounter data from other years', async () => {
      const db = getTestDb()

    const fixturesAllBefore = await db.all('SELECT * FROM tennisFixture')

  // Create a fixture and encounter for a different year
  const result = await db.run(`
    INSERT INTO tennisFixture (yearId, teamIdLeft, teamIdRight)
    VALUES (11, 1, 2)
  `)

  const fixtureId = Number(result.lastInsertRowid)

  await db.run(`
    INSERT INTO tennisEncounter
    (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
    VALUES (11, ${fixtureId}, 1, 2, 0, 0, 3, 0, 'NONE')
  `)

  const fixturesBefore = await db.all('SELECT * FROM tennisFixture WHERE yearId = 11')
  expect(fixturesBefore.length).toBe(1)

  const encountersBefore = await db.all('SELECT * FROM tennisEncounter WHERE yearId = 11')
  expect(encountersBefore.length).toBe(1)


  // Generate fixtures for the current year
  await generateFixtures(db)

  const fixturesAfter = await db.all('SELECT * FROM tennisFixture WHERE yearId = 11')
  expect(fixturesAfter.length).toBe(1)

  const encountersAfter = await db.all('SELECT * FROM tennisEncounter WHERE yearId = 11')
  expect(encountersAfter.length).toBe(1)
})


afterEach(async () => {
    const db = getTestDb()
  await db.run(sql`DELETE FROM tennisFixture`)
})

beforeAll(async () => {
    const db = getTestDb()

  await db.run('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await db.run('INSERT INTO options (id, name, value) VALUES (20, \'year_id\', \'12\');')

  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 12, 'Premier');
  `)
  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 12, 'First');
  `)

  await db.run(`
  INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (1, 12, 'HTTC', 'httc', 2, 610, 5, 1);
  `)
  await db.run(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (2, 12, 'Rovers', 'rovers', 1, 42, 5, 1);
  `)
  await db.run(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (3, 12, 'Super Spins', 'super-spins', 1, 42, 5, 1);
  `)
})

afterAll(async () => {
  await resetTestDb()
})
