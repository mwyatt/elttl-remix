import type {Route} from "./+types/_front.result.$year.venue.$slug";
import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import DirectionsButton from "~/components/DirectionsButton";
import {buildMeta} from "~/constants/MetaData";
import {parseYearNameGetYear} from "~/libraries/year";

export function meta({ params }: Route.MetaArgs) {
  const { year, slug } = params;

  // Convert slug to readable venue name (e.g., "hyndburn-table-tennis-centre" → "Hyndburn Table Tennis Centre")
  const venueName = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return buildMeta({
    title: `${venueName} – ${year} Venue Information & Teams`,
    description: `View venue details for ${venueName} in the ${year} season, including all teams playing here, their divisions, home nights, and directions to the venue.`,
  });
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, slug } = params
  const currentYear = await parseYearNameGetYear(db, year)

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

export default function _frontResultYearVenueSlug({ loaderData, params }: Route.ComponentProps<typeof loader>) {
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
        </div>

      </div>
    </>
  )
}