import type { Route } from "./+types/_front.result.$year.player.$slug";
import { getDbFromContext } from "~/db-context.server";
import { StatusCodes } from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Link } from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import { getShortPlayerName } from "~/libraries/player";
import { linkStyles } from "~/styles/ui-classes";
import RankChange from "~/components/player/RankChange";
import { buildMeta } from "~/constants/MetaData";
import { getKvFromContext } from "~/kv-context.server";
import { getCorePlayerInformation } from "~/services/player.service.server";
import { parseYearNameGetYear } from "~/repositories/year.repository.server";
import ContentBody from "~/components/ContentBody";
import ContentPanel from "~/components/ContentPanel";
import LinkButton from "~/components/LinkButton";

export function meta({ params }: Route.MetaArgs) {
  const { year, slug } = params;

  // Convert slug to a readable name (e.g., "john-smith" → "John Smith")
  const playerName = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return buildMeta({
    title: `${playerName} – ${year} Player Performance & Results`,
    description: `View detailed performance results for ${playerName} in the ${year} season, including encounters, scores, rank changes, team information.`,
  });
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const kv = getKvFromContext(context);
  const { year, slug } = params;
  const currentYear = await parseYearNameGetYear(db, year);

  const data = await getCorePlayerInformation(kv, db, currentYear.id, slug);

  return Response.json(data, { status: StatusCodes.OK });
}

export default function _frontResultYearPlayerSlug({
  loaderData,
  params,
}: Route.ComponentProps<typeof loader>) {
  const { player, encounters, division } = loaderData;
  const { year, slug } = params;

  const getPlayerLink = (playerSlug, playerName) => {
    if (playerSlug === slug) {
      return (
        <>
          <span className="sm:hidden text-tertiary-500">
            {getShortPlayerName(playerName)}
          </span>
          <span className="hidden sm:inline text-tertiary-500">
            {playerName}
          </span>
        </>
      );
    }
    return (
      <Link
        className={linkStyles.join(" ")}
        to={`/result/${year}/player/${playerSlug}`}
      >
        <span className="sm:hidden">{getShortPlayerName(playerName)}</span>
        <span className="hidden sm:inline">{playerName}</span>
      </Link>
    );
  };

  return (
    <ContentBody isNarrow>
      <Breadcrumbs
        items={[
          { name: "Results", href: "/result" },
          { name: year, href: `/result/${year}` },
          { name: player.name },
        ]}
      />

      <MainHeading name={player.name} />
      <div className="mt-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {player.teamSlug && (
          <ContentPanel extraClassNames={'text-2xl flex flex-col gap-6'}>
            <p>            {"Plays for "}
            <Link
              className={linkStyles.join(" ")}
              to={`/result/${year}/team/${player.teamSlug}`}
            >
              {player.teamName}
            </Link>
</p>
            <div className={'flex justify-end items-end grow'}>
            <LinkButton to={`/result/${year}/team/${player.teamSlug}`} className="text-base" theme={'secondary'}>
              {"View Team"}
            </LinkButton>
            </div>
          </ContentPanel>
          )}
          {!player.teamSlug && (
          <ContentPanel extraClassNames={'text-2xl flex flex-col gap-6'}>
            <p>Not currently registered with a team.</p>
          </ContentPanel>
          )}
          {division && (
          <ContentPanel extraClassNames={'text-2xl flex flex-col gap-6'}>
            <p>            {"Plays in the "}
            <Link
              className={linkStyles.join(" ")}
              to={`/result/${year}/${division.name.toLowerCase()}/`}
            >
              {division.name} Division
            </Link>
</p>
            <div className={'flex justify-end items-end grow'}>
            <LinkButton to={`/result/${year}/${division.name.toLowerCase()}/`} className="text-base" theme={'secondary'}>
              {"View Division"}
            </LinkButton>
            </div>
          </ContentPanel>
          )}
          <ContentPanel extraClassNames={'text-3xl flex justify-center items-center'}>
            <p>{"Rank "}
            <span className="font-bold">{player.rank}</span></p>
          </ContentPanel>
          {encounters.length > 0 && (
            <ContentPanel extraClassNames={'text-xl flex justify-center items-center'}>
              <p>

              {"Has had "}
              <span className="font-bold text-xl">{encounters.length}</span>
              {" encounters with other players so far this season."}
              </p>
            </ContentPanel>
          )}

          {(player.phoneLandline || player.phoneMobile) && (
            <ContentPanel extraClassNames={'text-2xl'}>
              {player.phoneLandline && (
                <p className="mb-2">
                  {"Landline "}
                  <Link
                    className={linkStyles.join(" ")}
                    to={`tel:${player.phoneLandline}`}
                  >
                    {player.phoneLandline}
                  </Link>
                </p>
              )}
              {player.phoneMobile && (
                <p className="mb-2">
                  {"Mobile "}
                  <Link
                    className={linkStyles.join(" ")}
                    to={`tel:${player.phoneMobile}`}
                  >
                    {player.phoneMobile}
                  </Link>
                </p>
              )}
            </ContentPanel>
          )}
        </div>

        {encounters.length > 0 && (

        <div>
          <SubHeading name="Performance" />

            <div className="grid grid-cols-10">
              {encounters.map((encounter, index) => (
                <div key={index} className="contents">
                  <div className="col-span-4 pt-3 border-t border-dashed border-t-stone-300 pb-3">
                    {getPlayerLink(
                      encounter.playerLeftSlug,
                      encounter.playerLeftName,
                    )}
                    <RankChange rankChange={encounter.playerRankChangeLeft} />
                  </div>
                  <div className=" text-right pt-3 border-t border-dashed border-t-stone-300 pb-3 pr-2">
                    {encounter.scoreLeft}
                  </div>
                  <div className=" pt-3 border-t border-dashed border-t-stone-300 pb-3 pl-2">
                    {encounter.scoreRight}
                  </div>
                  <div className="col-span-4  pt-3 border-t border-dashed border-t-stone-300 pb-3 text-right">
                    <RankChange rankChange={encounter.playerRankChangeRight} />
                    {getPlayerLink(
                      encounter.playerRightSlug,
                      encounter.playerRightName,
                    )}
                  </div>
                </div>
              ))}
            </div>
        </div>
        )}
      </div>
    </ContentBody>
  );
}
