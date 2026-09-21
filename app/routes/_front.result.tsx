import type { Route } from "./+types/_front.result.$year";
import { getDbFromContext } from "~/db-context.server";
import { StatusCodes } from "http-status-codes";
import { sql } from "drizzle-orm";
import { Link } from "react-router";
import MainHeading from "~/components/MainHeading";
import { buildMeta } from "~/constants/MetaData";
import { getCurrentYear } from "~/repositories/year.repository.server";
import { getSeasonName } from "~/libraries/year";
import { buttonPrimaryStyles } from "~/styles/ui-classes";
import classNames from "classnames";

export function meta({ params }: Route.MetaArgs) {
  const { year } = params;

  return buildMeta({
    title: `${year} Divisions`,
    description: ``,
  });
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db);

  const divisions = await db.all(sql`
      SELECT id, name
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}
  `);

  return Response.json({ divisions, currentYear }, { status: StatusCodes.OK });
}

export default function _frontResult({
  loaderData,
  params,
}: Route.ComponentProps<typeof loader>) {
  const { divisions, currentYear } = loaderData;

  return (
    <>
      {/*<Breadcrumbs*/}
      {/*  items={[*/}
      {/*    { name: "Results", href: "/result" },*/}
      {/*    { name: year, href: `/result/${year}` },*/}
      {/*  ]}*/}
      {/*/>*/}
      <MainHeading name={`${getSeasonName(currentYear.name)}`} />
      <p>
        Here are all the divisions for the current season. To view the teams
        within each division, select one of the divisions below.
      </p>
      <div className="flex flex-col gap-2 mt-8">
        {divisions.map((division) => (
          <Link
            className={classNames({
              [buttonPrimaryStyles.join(" ")]: true,
              "block w-full": true,
            })}
            to={`/result/${currentYear.name}/${division.name.toLowerCase()}`}
            key={division.name}
          >
            {division.name} Division
          </Link>
        ))}
      </div>
    </>
  );
}
