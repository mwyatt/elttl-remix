import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import dayjs from "dayjs";
import {getCurrentYear} from "~/repositories/year.repository.server";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)

  const players = await db.all(`
    SELECT
      id,
      yearId,
      nameFirst,
      nameLast,
      slug,
      tp.rank,
      phoneLandline,
      phoneMobile,
      ettaLicenseNumber,
      teamId
      FROM tennisPlayer tp
        WHERE tp.yearId = ${currentYear.id}
      order by tp.nameLast
  `)

  return {
    players
  }
}


export default function AdminPlayer({ loaderData }: Route.ComponentProps) {
      const { players } = loaderData

  return (
    <div className={'container mx-auto max-w-screen-sm'}>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl p-4'>Players</h2>
        <Link className='bg-primary-500 text-white px-2 py-1' to='/admin/player/create'>Create New Player</Link>
      </div>

      {players.map(player => (
        <div key={player.id} className='flex items-center p-2 border-t border-t-stone-200 hover:bg-stone-100'>
          <Link className='text-primary-500 underline flex-grow' to={`/admin/player/${player.id}`}>
            {player.nameFirst} {player.nameLast}
          </Link>
          <Link className='bg-stone-500 text-white px-2 py-1' to={`/admin/player/${player.id}`}>
            Edit
          </Link>
        </div>
      ))}
    </div>
  )

}