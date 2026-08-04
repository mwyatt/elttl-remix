import type {Route} from "./+types/api.ping";
import {getDbFromContext} from "~/db-context.server";
import createSeason from "~/services/createSeason.service.server";
import {requireAdmin} from "~/auth/session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request);

  const db = getDbFromContext(context);

  const season = await createSeason(db);

  return Response.json({
    message: 'Season created successfully and current year pointed to it.',
    newYearId: season.id,
    newYearName: season.name
  });
}
