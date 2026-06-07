// @todo may remove, not used

import {getDbFromContext} from "~/db-context.server";

export async function getPlayersForYear(context: Route.LoaderArgs["context"], yearId: number, slugs: string[]) {
  const db = getDbFromContext(context);
  return playerGetBySlugs(db, yearId, slugs);
}