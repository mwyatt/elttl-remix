import {requireAdmin} from "~/auth/session.server";
import {getKvFromContext} from "~/kv-context.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request);
  const kv = getKvFromContext(context);

  console.warn('deleting cache keys')

  const response = await kv.delete('fixtures-by-team-id-14-7');

  console.log(response)

  return Response.json({ ok: true, msg: 'deleted cache' });
}
