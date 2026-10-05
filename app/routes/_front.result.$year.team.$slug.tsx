import type { Route } from "./+types/_front.result.$year.team.$slug";
import { getDbFromContext } from "~/db-context.server";
import { StatusCodes } from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Link } from "react-router";
import SubHeading from "~/components/SubHeading";
import { linkStyles } from "~/styles/ui-classes";
import MainHeading from "~/components/MainHeading";
import { homeNightMap } from "~/constants/Team";
import WeeksTimeline from "~/components/WeeksTimeline";
import { buildMeta } from "~/constants/MetaData";
import { getKvFromContext } from "~/kv-context.server";
import { getCoreTeamInformation } from "~/services/team.service.server";
import {getCurrentYear, parseYearNameGetYear} from "~/repositories/year.repository.server";
import ContentBody from "~/components/ContentBody";
import LinkButton from "~/components/LinkButton";
import {doesYearSupportWeeks} from "~/libraries/year";
import FixtureCard from "~/components/FixtureCard";

export function meta({ params }: Route.MetaArgs) {
  const { year, slug } = params;

  // Convert slug to readable team name (e.g., "hyndburn-a" → "Hyndburn A")
  const teamName = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return buildMeta({
    title: `${teamName} – ${year} Team Overview & Results`,
    description: `View the full team overview for ${teamName} in the ${year} season, including division details, venue, home night, registered players, weekly fixtures, and fulfilled match results.`,
  });
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const kv = getKvFromContext(context);
  const { year, slug } = params;
  const currentYear = await parseYearNameGetYear(db, year);
  const activeYear = await getCurrentYear(db);

  const data = await getCoreTeamInformation(kv, db, currentYear.id, slug);

  data.yearIsCurrentYear = activeYear.name === year;

  return Response.json(data, { status: StatusCodes.OK });
}

export default function _frontResultYearTeamSlug({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { team, players, fixtures, weeks, yearIsCurrentYear } = loaderData;
  const { year } = params;

  return (
    <ContentBody>
      <Breadcrumbs
        items={[
          { name: "Results", href: "/result" },
          { name: year, href: `/result/${year}` },
          { name: team.name },
        ]}
      />

      <MainHeading name={team.name} />

      <div className="">
        <div className="flex-1">
          <SubHeading name="General Information" />
          <p className="my-2">
            Team in the{" "}
            <Link
              className={linkStyles.join(" ")}
              to={`/result/${year}/${team.divisionSlug}`}
            >
              {team.divisionName}
            </Link>{" "}
            division playing at the{" "}
            <Link
              className={linkStyles.join(" ")}
              to={`/result/${year}/venue/${team.venueSlug}`}
            >
              {team.venueName}
            </Link>{" "}
            venue on a <strong>{homeNightMap[team.homeWeekday]}</strong> night.
          </p>

          {team.secretaryName && (
            <p>
              Secretary is{" "}
              <Link
                className={linkStyles.join(" ")}
                to={`/result/${year}/player/${team.secretarySlug}`}
              >
                {team.secretaryName}
              </Link>
            </p>
          )}
          {!team.secretaryName && <p>There is no team secretary currently.</p>}

          {yearIsCurrentYear && (
            <div className="flex justify-end mt-4">
                      <LinkButton
              to={`#timeline-current-week`}
              theme={'secondary'}
            >
              View Current Week
            </LinkButton>
            </div>
          )}

          <SubHeading name="Registered Players" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border border-stone-300 p-3 rounded"
              >
                <div className="flex-2">
                  <Link
                    to={`/result/${year}/player/${player.slug}`}
                    className={linkStyles.join(" ")}
                    key={player.slug}
                  >
                    {player.name}
                  </Link>
                </div>
                <div className="flex-1 text-right">
                  <span className="float-right text-tertiary-500">
                    <span className={'text-stone-400'}>Rank</span> {player.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {weeks.length > 0 && (
              <WeeksTimeline
                yearName={year}
                weeks={weeks}
                teamSlug={team.slug}
              />
          )}
        </div>
        <div className="flex-1">

          {/* <SubHeading name='Directions' /> */}
          {/* <DirectionsButton url={data.venue.location} /> */}

          {!doesYearSupportWeeks(year) && (
            <>
          <SubHeading name="Fixtures" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 ">
            {fixtures.map((fixture, index) => (
              <FixtureCard
                key={index}
                year={year}
                teamLeft={{
                  name: fixture.teamLeftName,
                  slug: fixture.teamLeftSlug,
                  score: fixture.scoreLeft,
                }}
                teamRight={{
                  name: fixture.teamRightName,
                  slug: fixture.teamRightSlug,
                  score: fixture.scoreRight,
                }}
                timeFulfilled={fixture.timeFulfilled}
              />
            ))}
          </div>
          </>
          )}
        </div>
      </div>
    </ContentBody>
  );
}
