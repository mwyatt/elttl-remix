import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearByName} from "~/repositories/year.repository.server";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import DirectionsButton from "~/components/DirectionsButton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, slug } = params

  // @todo DRY up
  const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    return Response.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const venues = await db.all(sql`
      SELECT id, name, slug, location
      FROM tennisVenue
      WHERE yearId = ${currentYear.id}
        AND slug = ${slug}
  `)

  if (venues.length === 0) {
    return Response.json(`Unable to find venue with slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const venue = venues[0]

  const teams = await db.all(sql`
      SELECT tt.name, tt.slug, tt.homeWeekday, LOWER(td.name) AS divisionSlug, td.name divisionName
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
      WHERE tt.yearId = ${currentYear.id}
        AND tt.venueId = ${venue.id}
  `)

  return Response.json({
    venue,
    teams
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearVenueSlug({ loaderData, params }: Route.ComponentProps) {
    const {
teams, venue
  } = loaderData;
  const { year, slug } = params

  return (
    <>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: venue.name }
          ]
        }
      />

      <MainHeading name={venue.name} />

      <div className='sm:flex gap-16'>

        <div className='flex-1'>

          <SubHeading name='Teams Playing Here' />
          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-3'>

            {teams.map((team) => (
              <Link
                to={`/result/${year}/team/${team.slug}`}
                className='p-4 border border-primary-500 text-primary-500 rounded'
                key={team.slug}
              >
                <span className='float-right text-gray-500 text-sm'>{team.divisionName}</span>
                <div>{team.name}</div>
              </Link>
            ))}
          </div>

        </div>
        <div className='flex-1'>
          <SubHeading name='Directions' />

          <DirectionsButton url={venue.location} />
          {/*<div className={`mt-16 p-4 bg-tertiary-500 text-white rounded bg-[url(/venue-${venue.slug}.jpg)] bg-cover bg-center bg-no-repeat flex-basis-1/3 md:basis-1/3 min-h-[175px]`} />*/}

        </div>

      </div>
    </>
  )
}