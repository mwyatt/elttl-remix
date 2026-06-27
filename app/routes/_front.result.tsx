import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import {Link} from "react-router";
import MainHeading from "~/components/MainHeading";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)

  const years = await db.all(`
      SELECT name
      FROM tennisYear
      ORDER BY id ASC
  `)

  return Response.json({years}, { status: StatusCodes.OK })
}

export default function _frontResult({ loaderData, params }: Route.ComponentProps) {
    const {
    years
  } = loaderData;

  return (
    <>
      <MainHeading name='Results by Season' />
      <p>Here are all the seasons past and present.</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8 text-center'>
        {years.map((season) => (
          <Link to={`/result/${season.name}`} key={season.name} className='px-6 py-3 border border-primary-500 rounded font-bold'>
            {season.name}
          </Link>
        ))}
      </div>
    </>
  )
}