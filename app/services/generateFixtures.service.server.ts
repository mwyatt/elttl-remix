import {getCurrentYear} from "~/repositories/year.repository.server";
import {sql} from "drizzle-orm"

export default async function generateFixtures (db) {
  const currentYear = await getCurrentYear(db);

  console.log(`Generating fixtures for year with id ${currentYear.id} and name ${currentYear.name}`)

  // @todo might need to toggle this if need to regen fixtures
  const ignoreExistingFixtures = false

  // Check if the year has fixtures and if so, throw an error
  if (!ignoreExistingFixtures) {
    const fixtures = await db.all(sql`
      SELECT COUNT(*) as count
      FROM tennisFixture
      WHERE yearId = ${currentYear.id}
    `)

    if (fixtures[0].count > 0) {
      throw new Error(`Year with ID ${currentYear.id} already has fixtures. Use 'ignoreExistingFixtures' to bypass this check.`)
    }
  }

  // Generate the fixtures by looking at the teams per division

  // Get all the divisions for the year
  const divisions = await db.all(sql`
    SELECT id, name
    FROM tennisDivision
    WHERE yearId = ${currentYear.id}
  `)

  // Get all the teams for the year
  const teams = await db.all(sql`
    SELECT id, name, divisionId
    FROM tennisTeam
    WHERE yearId = ${currentYear.id}
  `)

  await db.transaction(async (tx) => {

    // Remove all the existing fixtures and encounters
    await tx.run(sql`
      DELETE FROM tennisFixture
      WHERE yearId = ${currentYear.id}
    `)

    await tx.run(sql`
      DELETE FROM tennisEncounter
      WHERE yearId = ${currentYear.id}
    `)

    // Generate fixtures for each division
    for (const division of divisions) {
      const divisionTeams = teams.filter(team => team.divisionId === division.id)

      // Generate fixtures for each team in the division
      for (let i = 0; i < divisionTeams.length; i++) {
        for (let j = 0; j < divisionTeams.length; j++) {
          const homeTeam = divisionTeams[i]
          const awayTeam = divisionTeams[j]

          // Create a fixture if the teams are not the same
          if (homeTeam.id !== awayTeam.id) {
            await tx.run(sql`
              INSERT INTO tennisFixture (yearId, teamIdLeft, teamIdRight)
              VALUES (${currentYear.id}, ${homeTeam.id}, ${awayTeam.id})
            `)
          }
        }
      }
    }

    return;
  });

  return {
  }
}
