import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";

export async function getPlayersForYear(context: Route.LoaderArgs["context"], yearId: number, slugs: string[]) {
  const db = getDbFromContext(context);
  return playerGetBySlugs(db, yearId, slugs);
}