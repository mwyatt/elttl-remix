import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import {StatusCodes} from "http-status-codes";
import {playerGetAll} from "~/repositories/player.repository.server";
import HandicapCalculator from "~/components/HandicapCalculator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us" },
    { name: "description", content: "Our League has been running since 1974, originally being the Hyndburn Table Tennis League and becoming the East Lancashire Table Tennis League in 2001 in order to take in the wider East Lancashire area as various other local leagues ceased to exist." },
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

export default function _frontHandicapCalculator({ loaderData }: Route.ComponentProps) {
    const {
    players
  } = loaderData;

  return (
    <>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='Handicap Calculator' />
        <p className='my-4'>Select two players to find out handicaps and what the disadvantaged player gets to start a game with:</p>
        <HandicapCalculator players={players} />
      </div>
    </>
  )
}