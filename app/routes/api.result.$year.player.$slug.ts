import type {Route} from "./+types/api.result.$year.player.$slug";
import {StatusCodes} from "http-status-codes";
import {getDbFromContext} from "~/db-context.server";
import {getKvFromContext} from "~/kv-context.server";
import {parseYearNameGetYear} from "~/libraries/year";
import {getCorePlayerInformation} from "~/services/player.service.server";

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, slug } = params
  const currentYear = await parseYearNameGetYear(db, year)

  const data = await getCorePlayerInformation(kv, db, currentYear.id, slug)

  return Response.json(data, { status: StatusCodes.OK })
}