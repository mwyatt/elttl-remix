import type { Route } from "./+types/_front.result";
import { getDbFromContext } from "~/db-context.server";
import { StatusCodes } from "http-status-codes";
import MainHeading from "~/components/MainHeading";
import { buildMeta } from "~/constants/MetaData";
import { getAllYears } from "~/repositories/year.repository.server";
import ContentBody from "~/components/ContentBody";
import ArchiveGrid from "~/components/ArchiveGrid";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Results by Season",
    description:
      "Browse all past and current seasons of the East Lancashire Table Tennis League, with quick access to yearly results, divisions, teams, fixtures, and performance summaries.",
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);

  const years = await getAllYears(db);

  return Response.json({ years }, { status: StatusCodes.OK });
}

export default function _frontResult({
  loaderData,
}: Route.ComponentProps<typeof loader>) {
  const { years } = loaderData;

  return (
    <ContentBody>
      <MainHeading name="Results Archive" />
      <p>Browse all all the results from seasons past and present.</p>
      <ArchiveGrid years={years} />
    </ContentBody>
  );
}
