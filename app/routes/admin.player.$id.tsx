import {useState} from 'react';
import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import Feedback from '~/components/Feedback'
import {sql} from "drizzle-orm";
import { Form, redirect } from "react-router";
import {createFlashHeaders, getFlashMessage} from "~/auth/session.server";
import {getCurrentYear} from "~/repositories/year.repository.server";

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const { id } = params

      if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentYear = await getCurrentYear(db)
    let players = []

  const isCreate = id === 'create'

      if (isCreate) {
    players = [
      {
        id: 'create',
        nameFirst: '',
        nameLast: '',
        slug: '',
        rank: '',
        phoneLandline: '',
        phoneMobile: '',
        ettaLicenseNumber: '',
        teamId: 0
      }
    ]
  } else {
    players = await db.all(sql`
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
          and tp.id = ${id}
        order by tp.nameLast
    `<any>)
  }

  const teams = await db.all(`
      SELECT id, name, slug, homeWeekday, secretaryId, venueId, divisionId
      FROM tennisTeam
        WHERE yearId = ${currentYear.id}
      order by name
  `,)

  const { message, headers } = await getFlashMessage(request)

  return Response.json({
    player: players[0],
    teams,
      flashMessage: message,
  }, {
      headers,
  })
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const db = getDbFromContext(context);
  const { id } = params

  const formData = await request.formData();
  const player = {
    nameFirst: String(formData.get("nameFirst") ?? ""),
    nameLast: String(formData.get("nameLast") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    rank: String(formData.get("rank") ?? ""),
    phoneLandline: String(formData.get("phoneLandline") ?? ""),
    phoneMobile: String(formData.get("phoneMobile") ?? ""),
    ettaLicenseNumber: String(formData.get("ettaLicenseNumber") ?? ""),
    teamId: Number(formData.get("teamId") ?? 0),
  };

  const isCreate = id === 'create'
  let affectedPlayerId = id
  const currentYear = await getCurrentYear(db)

  if (isCreate) {
  const maxRows = await db.all<{ maxId: number | null }>(sql`    SELECT MAX(id) as maxId
    FROM tennisPlayer
  `);

  const nextId = (maxRows[0]?.maxId ?? 0) + 1;

    console.log({maxRows, nextId})

    const response = await db.run(sql`
         INSERT INTO tennisPlayer (
                                   id,
                 yearId,
                 nameFirst,
                 nameLast,
                 slug,
                 \`rank\`,
                 phoneLandline,
                 phoneMobile,
                 ettaLicenseNumber,
                 teamId
         )
         VALUES (
                 ${nextId},
                 ${currentYear.id},
                  ${player.nameFirst},
                  ${player.nameLast},
                  ${player.slug},
                  ${player.rank},
                  ${player.phoneLandline},
                  ${player.phoneMobile},
                  ${player.ettaLicenseNumber},
                  ${player.teamId}
                )
    `<any>)
    affectedPlayerId = nextId
    console.log(response)

  } else {
    await db.run(sql`
         UPDATE tennisPlayer
         SET 
             nameFirst = ${player.nameFirst},
             nameLast = ${player.nameLast},
             slug = ${player.slug},
             \`rank\` = ${player.rank},
             phoneLandline = ${player.phoneLandline},
             phoneMobile = ${player.phoneMobile},
             ettaLicenseNumber = ${player.ettaLicenseNumber},
             teamId = ${player.teamId}
        WHERE yearId = ${currentYear.id} and id = ${id}
    `<any>)
  }

const message = isCreate
  ? "Player created successfully!"
  : "Player updated successfully!";

const headers = await createFlashHeaders(request, message);

return redirect(`/admin/player/${affectedPlayerId}`, { headers });
}

export default function AdminPlayerId({ loaderData }: Route.ComponentProps) {
  const { player, teams, flashMessage } = loaderData
  const [playerData, setPlayerData] = useState(player)
  const isCreate = playerData.id === 'create'

  const handleChange = async (event) => {
    const { name, value } = event.target
    setPlayerData({
      ...playerData,
      [name]: value
    })
  }

  return (
    <>
      <Feedback message={flashMessage} />
              <Link className='bg-stone-500 text-white px-2 py-1' to='/admin/player'>
        Back
      </Link>
      <h2 className='text-2xl p-4'>{player.nameFirst}</h2>
              <Form method={'post'} className='flex flex-col gap-2 max-w-[1280px] mx-auto'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>First Name</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.nameFirst} name='nameFirst' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Last Name</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.nameLast} name='nameLast' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Slug</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.slug} name='slug' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Rank</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.rank} name='rank' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Landline</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.phoneLandline} name='phoneLandline' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Mobile</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.phoneMobile} name='phoneMobile' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>ETTA License Number</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.ettaLicenseNumber} name='ettaLicenseNumber' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Team</div>
            <select className='border border-tertiary-500 p-2' name='teamId' onChange={handleChange} value={playerData.teamId} required>
              <option key={0} value={0}>
                Choose a team
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type='submit' className='w-32 bg-primary-500 border-b-orange-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-orange-600'
        >
          {isCreate ? 'Create' : 'Update'}
        </button>
      </Form>
    </>
  )
}