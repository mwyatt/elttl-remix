import type { Route } from "./+types/api.result.$year.team.$slug";
import { StatusCodes } from "http-status-codes";
import { getDbFromContext } from "~/db-context.server";
import { getKvFromContext } from "~/kv-context.server";
import { getCoreTeamInformation } from "~/services/team.service.server";
import { parseYearNameGetYear } from "~/repositories/year.repository.server";

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const kv = getKvFromContext(context);
  const { year, slug } = params;
  const currentYear = await parseYearNameGetYear(db, year);

  const data = await getCoreTeamInformation(kv, db, currentYear.id, slug);

  return Response.json(data, { status: StatusCodes.OK });
}
