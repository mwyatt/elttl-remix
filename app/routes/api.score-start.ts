import type {Route} from "./+types/api.score-start";
import {getDbFromContext} from "~/db-context.server";
import {
  getActivePublicFulfillments,
  startActiveFulfillment
} from "~/repositories/publicFixtureFulfillment.repository.server";
import {StatusCodes} from "http-status-codes";

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const db = getDbFromContext(context);
  const fixtureId = Number(url.searchParams.get("fixture-id"));
  const activePublicFulfillments = await getActivePublicFulfillments(db)

  // This fixture already has a session
  const activePublicFulfillment = activePublicFulfillments.find(fulfillment => fulfillment.fixtureId === fixtureId)
  if (activePublicFulfillment) {
      return Response.json({
    activePublicFulfillment
  }, { status: StatusCodes.CONFLICT });
  }

  // Has it expired?
  // @todo Can we safely assume an incomplete fulfillment attempt older than a day is not valid?
  // For now, we trust that people will start and complete these sessions in good faith

  const activeFulfillment = await startActiveFulfillment(db, fixtureId)

  return Response.json({
    activeFulfillment,
  }, { status: StatusCodes.OK });
}