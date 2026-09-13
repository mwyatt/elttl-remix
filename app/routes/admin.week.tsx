import type {Route} from "./+types/admin.week";
import {getDbFromContext} from "~/db-context.server";
import {sql} from "drizzle-orm";
import {getCurrentYear} from "~/repositories/year.repository.server";
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
     concat(ttl.fixtureMatrixIndex, ' v ', ttr.fixtureMatrixIndex) AS fullName,
    ttl.id as teamLeftId,
    ttl.name as teamLeftName,
    ttl.fixtureMatrixIndex as teamLeftMatrixIndex,
    ttl.homeWeekday,
    ttl.divisionId,
    ttr.id as teamRightId,
    ttr.name as teamRightName,
    ttr.fixtureMatrixIndex as teamRightMatrixIndex,
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

export default function AdminWeek({ loaderData }: Route.ComponentProps<typeof loader>) {
  const {     divisions, weeks, fixtures,
 flashMessage } = loaderData

  return (
    <WeekConfigurator divisions={divisions} weeks={weeks} fixtures={fixtures} />
  )
}