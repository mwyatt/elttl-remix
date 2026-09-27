import {requireAdmin} from "~/auth/session.server";
import {getKvFromContext} from "~/kv-context.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request);
  const kv = getKvFromContext(context);

  console.warn('deleting cache keys')

  const results = await Promise.all([
      deleteKeysByPrefix(kv, `division-merit-encounters-`),
      deleteKeysByPrefix(kv, `division-league-table-`),
      deleteKeysByPrefix(kv, `doubles-merit-table-`),
      deleteKeysByPrefix(kv, `fixtures-by-team-id-`),
      deleteKeysByPrefix(kv, `fixtures-by-team-id-`),
      deleteKeysByPrefix(kv, `latest-fixtures-`),
      deleteKeysByPrefix(kv, `fixtures-by-week-id-`),
      deleteKeysByPrefix(kv, `encounters-by-player-id-`),
      deleteKeysByPrefix(kv, `teams-unfulfilled-fixtures-`),
      deleteKeysByPrefix(kv, `teams-fulfilled-fixtures-`)
  ]);

  console.log(results)

  return Response.json({ ok: true, msg: 'deleted cache' });
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
