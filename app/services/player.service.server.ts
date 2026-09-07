import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {StatusCodes} from "http-status-codes";
import {sql} from "drizzle-orm";
import {getPlayerEncounters} from "~/repositories/encounter.repository.server";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";
import {getFixturesByTeamId} from "~/repositories/fixture.repository.server";

export async function getPlayersForYear(context: Route.LoaderArgs["context"], yearId: number, slugs: string[]) {
  const db = getDbFromContext(context);
  return playerGetBySlugs(db, yearId, slugs);
}

export async function getCorePlayerInformation(kv, db, yearId, playerSlug) {
    const players = await db.all(sql`
      SELECT tp.id,
             concat(nameFirst, ' ', nameLast) AS name,
             tp.slug,
             tp.rank,
             tp.phoneMobile,
             tp.phoneLandline,
             teamId,
             tt.name                          AS teamName,
             tt.slug                          AS teamSlug,
             tt.divisionId
      FROM tennisPlayer tp
               left join tennisTeam tt on tp.teamId = tt.id and tt.yearId = tp.yearId
      WHERE tp.yearId = ${yearId}
        AND tp.slug = ${playerSlug}
  `)

  if (players.length === 0) {
    return Response.json(`Unable to find player within year name '${yearId}' and slug '${playerSlug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const player = players[0]

  const encounters = await getPlayerEncounters(kv, db, yearId, player.id)

  const weeks = await getAllWeeksByYear(db, yearId)
  const teamFixtures = await getFixturesByTeamId(kv, db, yearId, player.teamId)

  // Attach fixtures to weeks
  for (const week of weeks) {
    week.fixtures = teamFixtures.filter(fixture => fixture.weekId === week.id)
  }

  return {
    player,
    encounters,
    fixtures: teamFixtures,
    weeks
  }
}