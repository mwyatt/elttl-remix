import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {sql} from "drizzle-orm";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)

  const fixtures = await db.all(sql`
      SELECT 
          tf.id,
          td.name as divisionName,
          ttl.name as teamLeftName,
          ttr.name as teamRightName,
          tf.timeFulfilled
      FROM tennisFixture tf
      LEFT JOIN tennisTeam ttl ON ttl.id = tf.teamIdLeft and ttl.yearId = ${currentYear.id}
      LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight and ttr.yearId = ${currentYear.id}
      LEFT JOIN tennisDivision td ON td.id = ttl.divisionId and td.yearId = ${currentYear.id}
        WHERE tf.yearId = ${currentYear.id}
  `<any>)

  return {
    fixtures
  }
}


export default function AdminFixture({ loaderData }: Route.ComponentProps) {
      const { fixtures } = loaderData

  return (
    <div className={'container mx-auto max-w-screen-lg'}>
      <h2 className='text-2xl p-4'>Fixtures</h2>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='p-2'>ID</th>
            <th className='p-2'>Division</th>
            <th className='p-2'>Team Left</th>
            <th className='p-2'>Team Right</th>
            <th className='p-2'>Fulfilled</th>
            <th className='p-2' />
          </tr>
        </thead>
        <tbody>
          {fixtures.map(fixture => (
            <tr key={fixture.id} className='border-t border-t-stone-200 hover:bg-stone-100'>
              <td className='p-2'><Link to={`${fixture.id}`}>{fixture.id}</Link></td>
              <td className='p-2'>{fixture.divisionName}</td>
              <td className='p-2'>{fixture.teamLeftName}</td>
              <td className='p-2'>{fixture.teamRightName}</td>
              <td className='p-2'>{fixture.timeFulfilled ? 'Yes' : 'No'}</td>
              <td className='p-2'><Link to={`${fixture.id}`} className='bg-stone-500 text-white px-2 py-1'>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )

}