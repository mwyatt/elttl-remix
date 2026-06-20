import {useState} from 'react';
import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import { ScoreCardForm } from '~/components/admin/fixture/ScoreCardForm'
import {sql} from "drizzle-orm";
import { Form, redirect } from "react-router";
import {createFlashHeaders, getFlashMessage} from "~/auth/session.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import fulfillFixture from "~/services/fulfillFixture.service.server";

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const { id } = params

      if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentYear = await getCurrentYear(db)

    const fixtures = await db.all(sql`
      SELECT 
          tf.id,
          td.name as divisionName,
          ttl.id as teamLeftId,
          ttl.name as teamLeftName,
          ttr.name as teamRightName,
          ttr.id as teamRightId,
          tf.timeFulfilled
      FROM tennisFixture tf
      LEFT JOIN tennisTeam ttl ON ttl.id = tf.teamIdLeft and ttl.yearId = ${currentYear.id}
      LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight and ttr.yearId = ${currentYear.id}
      LEFT JOIN tennisDivision td ON td.id = ttl.divisionId and td.yearId = ${currentYear.id}
        WHERE tf.yearId = ${currentYear.id}
      and tf.id = ${id}
  `)

  const fixture = fixtures[0]

  const players = await db.all(sql`
      SELECT
          id,
          concat(nameFirst, ' ', nameLast) AS name,
          slug,
          tp.rank,
          teamId
      FROM tennisPlayer tp
      WHERE yearId = ${currentYear.id}
      order by nameLast
  `)

  const encounters = await db.all(sql`
      SELECT
          id,
          playerIdLeft,
          playerIdRight,
          scoreLeft,
          scoreRight,
          playerRankChangeLeft,
          playerRankChangeRight,
          playerRankChangeRight,
          status
      FROM tennisEncounter
      WHERE yearId = ${currentYear.id} and fixtureId = ${id}
  `)

  const { message, headers } = await getFlashMessage(request)

  return Response.json({
    fixture,
    encounters,
    players,
      flashMessage: message,
  }, {
      headers,
  })
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const db = getDbFromContext(context);
  const { id } = params

  const formData = await request.formData();
  const encounterStructJson = formData.get('encounterStruct');

  // Parse the JSON string into an object
  const encounterStruct = JSON.parse(encounterStructJson as string);

  let message = `Fixture ${id} fulfilled successfully!`

  try {
    await fulfillFixture(db, id, encounterStruct)
  } catch (error) {
    console.error('Error fulfilling fixture:', error)
    message = error.message
  }

const headers = await createFlashHeaders(request, message);

return redirect(`/admin/fixture/${id}`, { headers });
}

export default function AdminFixtureId({ loaderData }: Route.ComponentProps) {
  const {     fixture,
    encounters,
    players,
 flashMessage } = loaderData

  return (
    <>
            <h2 className='text-2xl p-4'>Fulfil Scorecard {fixture.id} - {fixture.teamLeftName} vs {fixture.teamRightName}</h2>
      <ScoreCardForm fixture={fixture} players={players} encounters={encounters} />
    </>
  )
}