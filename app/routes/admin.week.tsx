import {getDbFromContext} from "~/db-context.server";
import {sql} from "drizzle-orm";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {persistWeeks} from "~/repositories/week.repository.server";
import {StatusCodes} from "http-status-codes";
import {WeekConfigurator} from "~/components/admin/week/WeekConfigurator";

export async function loader({ context, request }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)

  const weeks = await db.all(sql`
      SELECT id,
             timeStart,
             type
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
      order by timeStart
  `)

  const fixtures = await db.all(sql`
select
    tf.id,
     concat(ttl.name, ' vs ', ttr.name) AS fullName,
    ttl.id as teamLeftId,
    ttl.name as teamLeftName,
    ttl.homeWeekday,
    ttl.divisionId,
    ttr.id as teamRightId,
    ttr.name as teamRightName,
    tf.weekId
from tennisFixture tf
join tennisTeam ttl on tf.teamIdLeft = ttl.id
join tennisTeam ttr on tf.teamIdRight = ttr.id
      where tf.yearId = ${currentYear.id}
        and ttl.yearId = ${currentYear.id}
        and ttr.yearId = ${currentYear.id}
  `)

  const divisions = await db.all(sql`
select
    td.id,
    td.name
from tennisDivision td
      where td.yearId = ${currentYear.id}
  `)

  return Response.json({
    divisions,
    weeks,
    fixtures,
  })
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = getDbFromContext(context);
  const formData = await request.formData();
  const weeksJson = formData.get('weeks');
  const weeks = JSON.parse(weeksJson as string);
  const fixturesJson = formData.get('fixtures');
  const fixtures = JSON.parse(fixturesJson as string);

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

export default function AdminWeek({ loaderData }: Route.ComponentProps) {
  const {     divisions, weeks, fixtures,
 flashMessage } = loaderData

  return (
    <WeekConfigurator divisions={divisions} weeks={weeks} fixtures={fixtures} />
  )
}