import {requireAdmin} from "~/auth/session.server";
import {getDbFromContext} from "~/db-context.server";
import {updateWeek} from "~/repositories/week.repository.server";
import {StatusCodes} from "http-status-codes";

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request);
  const db = getDbFromContext(context);
  const { week, fixtures } = await request.json()

  // @todo differentiate if required in the future === PUT
  // const method = request.method.toUpperCase()

  try {
    await updateWeek(db, week, fixtures)
  } catch (error) {
    console.error('Error saving week:', error)
    return Response.json({
      message: error.message
    }, { status: StatusCodes.UNPROCESSABLE_ENTITY })
  }

  return Response.json({
    message: `Week ${week.id} saved successfully!`
  }, { status: StatusCodes.OK })
}
