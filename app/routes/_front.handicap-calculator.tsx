import type {Route} from "./+types/_front.handicap-calculator";
import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import {StatusCodes} from "http-status-codes";
import {playerGetAll} from "~/repositories/player.repository.server";
import HandicapCalculator from "~/components/HandicapCalculator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Handicap Calculator" },
    { name: "description", content: "Use the East Lancashire Table Tennis League Handicap Calculator to compare players, view handicap differences, and see starting points for disadvantaged players in league matches." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)

  const players = await playerGetAll(db, currentYear.id)

  return Response.json({
    players
  }, { status: StatusCodes.OK })
}

export default function _frontHandicapCalculator({ loaderData }: Route.ComponentProps<typeof loader>) {
    const {
    players
  } = loaderData;

  return (
    <>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Handicap Calculator' />
        <p className='my-4'>Select two players to find out handicaps and what the disadvantaged player gets to start a game with:</p>
        <HandicapCalculator players={players} />
      </div>
    </>
  )
}