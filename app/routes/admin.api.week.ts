import {requireAdmin} from "~/auth/session.server";
import {getDbFromContext} from "~/db-context.server";
import {persistWeeks} from "~/repositories/week.repository.server";
import {StatusCodes} from "http-status-codes";

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request);
  const db = getDbFromContext(context);
  const { weeks, fixtures } = await request.json()

  // @todo differentiate if required in the future === PUT
  // const method = request.method.toUpperCase()

  try {
    await persistWeeks(db, weeks, fixtures)
  } catch (error) {
    console.error('Error saving weeks:', error)
    return Response.json({
      message: error.message
    }, { status: StatusCodes.UNPROCESSABLE_ENTITY })
  }

  return Response.json({
    message: 'Weeks saved successfully!'
  }, { status: StatusCodes.OK })
}
