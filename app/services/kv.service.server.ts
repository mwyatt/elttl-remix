import {getPlayerIdsFromEncounterStruct} from "~/services/fulfillFixture.service.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {playerGetMany} from "~/repositories/player.repository.server";
import uniq from "lodash/uniq";

export const clearFixtureFulfillKvs = async (kv, db, fixtureId, encounterStruct) => {
    console.log('running clearFixtureFulfillKvs')

  const currentYear = await getCurrentYear(db)

    const fixtures = await db.all(`
      SELECT 
          tf.id,
          tf.timeFulfilled,
          tt.divisionId,
          tf.teamIdLeft,
          tf.teamIdRight,
          tf.weekId
      FROM tennisFixture tf
      LEFT JOIN tennisTeam tt ON tf.teamIdLeft = tt.id AND tf.yearId = tt.yearId
      WHERE tf.yearId = ${currentYear.id}
      and tf.id = ${fixtureId}
  `)

  const fixture = fixtures[0]

  const playerIds = uniq(getPlayerIdsFromEncounterStruct(encounterStruct))
  const players = await playerGetMany(db, currentYear.id, playerIds)

  console.log({fixture, players, playerIds, encounterStruct, fixtureId, currentYear})

  // About 17 keys refreshed, even if 5 fulfilled per night that is 85 keys or so well within the 1000 write limit
  const results = await Promise.all([
      deleteKeysByPrefix(kv, `division-merit-encounters-${currentYear.id}-${fixture.divisionId}`),
      deleteKeysByPrefix(kv, `division-league-table-${currentYear.id}-${fixture.divisionId}`),
      deleteKeysByPrefix(kv, `doubles-merit-table-${currentYear.id}-${fixture.divisionId}`),
      deleteKeysByPrefix(kv, `fixtures-by-team-id-${currentYear.id}-${fixture.teamIdLeft}`),
      deleteKeysByPrefix(kv, `fixtures-by-team-id-${currentYear.id}-${fixture.teamIdRight}`),
      deleteKeysByPrefix(kv, `latest-fixtures-${currentYear.id}`),
      deleteKeysByPrefix(kv, `fixtures-by-week-id-${currentYear.id}-${fixture.weekId}`),
      ...playerIds.map(playerId => deleteKeysByPrefix(kv, `encounters-by-player-id-${currentYear.id}-${playerId}`)),
      deleteKeysByPrefix(kv, `teams-unfulfilled-fixtures-${currentYear.id}-${fixture.teamIdLeft}`),
      deleteKeysByPrefix(kv, `teams-unfulfilled-fixtures-${currentYear.id}-${fixture.teamIdRight}`),
      deleteKeysByPrefix(kv, `teams-fulfilled-fixtures-${currentYear.id}-${fixture.teamIdLeft}`),
      deleteKeysByPrefix(kv, `teams-fulfilled-fixtures-${currentYear.id}-${fixture.teamIdRight}`)
  ]);

  console.log('deleting cache for fixture', {fixtureId, encounterStruct, results})

  return results;
}

async function deleteKeysByPrefix(
  kv: KVNamespace,
  prefix: string,
  concurrency = 20
) {
  let cursor: string | undefined = undefined;
  let deleted = 0;

  do {
    const page = await kv.list({ prefix, cursor, limit: 1000 });
    const names = page.keys.map(k => k.name);

    console.log({prefix, page, names})

    // Delete in controlled parallel batches
    for (let i = 0; i < names.length; i += concurrency) {
      const chunk = names.slice(i, i + concurrency);
      await Promise.all(chunk.map(name => kv.delete(name)));
      deleted += chunk.length;
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return deleted;
}