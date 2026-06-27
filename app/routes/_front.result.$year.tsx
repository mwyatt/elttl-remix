import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearByName} from "~/repositories/year.repository.server";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import InformationTable from "~/components/team/InformationTable";
import MainHeading from "~/components/MainHeading";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year } = params
  const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    return Response.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const divisions = await db.all(sql`
      SELECT id, name
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}
  `)

  const teams = await db.all(sql`
      SELECT tt.name, tt.slug, tt.divisionId teamDivisionId,
          tv.name venueName,
          tv.slug venueSlug,
          tp.slug secretarySlug,
          concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
          tp.phoneLandline secretaryPhoneLandline,
          tp.phoneMobile secretaryPhoneMobile
      FROM tennisTeam tt
           LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = ${currentYear.id}
           LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = ${currentYear.id}
        WHERE tt.yearId = ${currentYear.id}
  `)

  // Map teams to their divisions
  const teamsByDivisionId = {}
  teams.forEach(team => {
    const divisionId = team.teamDivisionId
    if (!teamsByDivisionId[divisionId]) {
      teamsByDivisionId[divisionId] = []
    }
    teamsByDivisionId[divisionId].push(team)
  })

  return Response.json({ divisions, teamsByDivisionId }, { status: StatusCodes.OK })
}

export default function _frontResultYear({ loaderData, params }: Route.ComponentProps) {
    const {
    divisions, teamsByDivisionId
  } = loaderData;
  const { year } = params

  return (
    <>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` }
          ]
        }
      />
      <MainHeading name={`${year} Team Information`} />
      <p>Here are all the teams registered in divisions for this season. To view all the fixtures for each division, please click the division links below.</p>
      <div className='flex gap-4 mt-8 flex-wrap'>
        {divisions.map((division) => (
          <Link className='px-6 py-3 border border-primary-500 rounded font-bold' to={`/result/${year}/${division.name.toLowerCase()}`} key={division.name}>
            {division.name} Division
          </Link>
        ))}
      </div>

      {divisions.map((division) => (
        <div key={division.id}>
          <SubHeading name={`${division.name} Division`} />
          <InformationTable yearName={year} teams={teamsByDivisionId[division.id]} key={division.name} />
        </div>
      ))}

    </>
  )
}