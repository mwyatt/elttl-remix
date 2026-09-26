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
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import ContentBody from "~/components/ContentBody";

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
    <ContentBody isNarrow>
      <MainHeading name={`Results`} />
      <div className="flex flex-col gap-2 mt-8">
        {divisions.map((division) => (
          <>
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
            <DivisionalSubMenu
              division={division.name.toLowerCase()}
              year={currentYear.name}
            />
          </>
        ))}
      </div>
    </ContentBody>
  );
}
