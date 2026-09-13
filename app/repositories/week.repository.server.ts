import {sql} from "drizzle-orm";
import {getCurrentYear} from "~/repositories/year.repository.server";

export async function getAllWeeksByYear (db, yearId) {

  const weeks = await db.all(sql`
      SELECT
          id,
          timeStart,
          type
      FROM tennisWeek
      WHERE yearId = ${yearId}
      ORDER BY timeStart ASC
  `)

  return weeks
}

export async function persistWeeks (db, weeks, fixtures) {
  const currentYear = await getCurrentYear(db)

  // clear all weekIds from tennisFixture table
  await db.run(sql`
      UPDATE tennisFixture
      SET weekId = NULL
      WHERE yearId = ${currentYear.id}
  `)

  // clear all weeks from tennisWeek table
  await db.run(sql`
      DELETE
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
  `)

  // insert weeks into this year
  for (const week of weeks) {
    await db.run(sql`
        INSERT INTO tennisWeek (id, yearId, timeStart, type)
        VALUES (
                ${week.id},
                ${currentYear.id},
                ${week.timeStart},
                ${week.type}
               )
    `)
  }

  // Group fixture IDs by weekId
  const weekToFixtureIds = {}
  for (const fixture of fixtures) {
    if (!weekToFixtureIds[fixture.weekId]) {
      weekToFixtureIds[fixture.weekId] = []
    }
    weekToFixtureIds[fixture.weekId].push(fixture.id)
  }

  // Update fixtures in batches per weekId
  await db.transaction(async (tx) => {
    for (const [weekId, fixtureIds] of Object.entries(weekToFixtureIds)) {
      if (fixtureIds.length === 0) continue

      for (const fixtureId of fixtureIds) {
        await tx.run(sql`
          UPDATE tennisFixture
          SET weekId = ${Number(weekId)}
          WHERE id = ${fixtureId}
            AND yearId = ${currentYear.id}
        `)
      }
    }
  })
}

export async function updateWeek (db, week, fixtures) {
  const currentYear = await getCurrentYear(db)

  await db.transaction(async (tx) => {
    const weekFound = await tx.all(sql`
        SELECT
            id
        FROM tennisWeek
        WHERE yearId = ${currentYear.id}
        AND id = ${week.id}
    `)

    if (weekFound.length !== 1) {
      throw new Error(`${weekFound.length} week found.`)
    }

    // Clear all instances of this week id from tennisFixture table
    await tx.run(sql`
        UPDATE tennisFixture
        SET weekId = NULL
        WHERE yearId = ${currentYear.id}
        AND weekId = ${week.id}
    `)

    // Update the week
    await tx.run(sql`
        UPDATE tennisWeek
        SET timeStart = ${week.timeStart}, 
            type = ${week.type}
        WHERE yearId = ${currentYear.id}
        AND id = ${week.id}
    `)

    if (fixtures.length !== 0) {
      for (const fixture of fixtures) {
        await tx.run(sql`
          UPDATE tennisFixture
          SET weekId = ${fixture.weekId}
          WHERE id = ${fixture.id}
          AND yearId = ${currentYear.id}
        `)
      }
    }
  })
}

