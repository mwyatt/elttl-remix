import {afterAll, beforeAll, expect, test} from "vitest"
import {getTestDb, resetTestDb} from "~/test/db-test.server"
import createSeason from "~/services/createSeason.service.server";
import {getLatestYear} from "~/repositories/year.repository.server";

test('it can create a new season with a copy of the previous years data', async () => {
    const db = getTestDb()

  const yearsBefore = await db.all('SELECT * FROM tennisYear')
  expect(yearsBefore.length).toBe(2)
  const divisionsBefore = await db.all('SELECT * FROM tennisDivision')
  expect(divisionsBefore.length).toBe(4)
  const playersBefore = await db.all('SELECT * FROM tennisPlayer')
  expect(playersBefore.length).toBe(2)
  const teamsBefore = await db.all('SELECT * FROM tennisTeam')
  expect(teamsBefore.length).toBe(2)
  const venuesBefore = await db.all('SELECT * FROM tennisVenue')
  expect(venuesBefore.length).toBe(2)

  await createSeason(db)

  const yearsAfter = await db.all('SELECT * FROM tennisYear')
  expect(yearsAfter.length).toBe(3)

  // Get latest year and verify its name is correct, it should be 2025
  const latestYear = await getLatestYear(db)
  expect(latestYear.name).toBe('2025')

  const divisionsAfter = await db.all('SELECT * FROM tennisDivision')
  expect(divisionsAfter.length).toBe(6)
  const teamsAfter = await db.all('SELECT * FROM tennisTeam')
  expect(teamsAfter.length).toBe(3)
  const playersAfter = await db.all('SELECT * FROM tennisPlayer')
  expect(playersAfter.length).toBe(3)
  const venuesAfter = await db.all('SELECT * FROM tennisVenue')
  expect(venuesAfter.length).toBe(3)

  const options = await db.all('SELECT * FROM options WHERE name = \'year_id\'')
  expect(options.length).toBe(1)
  expect(options[0].value).toBe('13')
})

beforeAll(async () => {
    const db = getTestDb()

  await db.run('INSERT INTO tennisYear (id, name, value) VALUES (11, \'2023\', \'\');')
  await db.run('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await db.run('INSERT INTO `options` (id, name, value) VALUES (20, \'year_id\', \'12\');')

  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 11, 'Premier');
  `)
  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 11, 'First');
  `)
  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 12, 'Premier');
  `)
  await db.run(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 12, 'First');
  `)

  await db.run(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (1, 11, 'Ryan', 1960);
  `)
  await db.run(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (2, 12, 'Dylan', 1457);
  `)

  await db.run(`
  INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (2, 11, 'HTTC', 'httc', 2, 610, 5, 2);
  `)
  await db.run(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (7, 12, 'Rovers', 'rovers', 1, 42, 5, 1);
  `)

  await db.run(`  
  INSERT INTO tennisVenue (id, yearId, name, slug, location) VALUES (2, 11, 'Ramsbottom Cricket Club', 'ramsbottom-cricket-club', 'https://maps.app.goo.gl/Y6n2uF1T3vEC5Vc27');
  `)
  await db.run(`
INSERT INTO tennisVenue (id, yearId, name, slug, location) VALUES (1, 12, 'Burnley Boys Club', 'burnley-boys-club', 'https://maps.app.goo.gl/z3BZEWqnFK9PPwoK7');
  `)
})

afterAll(async () => {
  await resetTestDb()
})
