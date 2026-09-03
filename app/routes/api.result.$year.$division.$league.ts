import type {Route} from "./+types/api.score-start";
import {StatusCodes} from "http-status-codes";
import {getDbFromContext} from "~/db-context.server";
import {getKvFromContext} from "~/kv-context.server";
import {parseYearDivisionId} from "~/libraries/year";
import {getTheDivisionLeagueTable} from "~/services/encounter.service.server";

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, division } = params
  const yearDivisionId = await parseYearDivisionId(db, year, division)
  const stats = await getTheDivisionLeagueTable(kv, db, yearDivisionId.yearId, yearDivisionId.divisionId)

  return Response.json(stats, { status: StatusCodes.OK })
}