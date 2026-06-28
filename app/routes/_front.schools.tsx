import type { Route } from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import {QuickLink} from "~/routes/_front.about-us";
import {Link} from "react-router";
import {linkStyles} from "~/styles/ui-classes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us" },
    { name: "description", content: "Our League has been running since 1974, originally being the Hyndburn Table Tennis League and becoming the East Lancashire Table Tennis League in 2001 in order to take in the wider East Lancashire area as various other local leagues ceased to exist." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)
  const players = await playerGetBySlugs(db, currentYear.id, [
    'david-heys',
  ])
  return { players, currentYearName: currentYear.name };
}

export default function _frontSchools({ loaderData }: Route.ComponentProps) {
    const {
    players,
    currentYearName
  } = loaderData;

  const getPlayerBySlug = (slug) => {
    return players.find((player) => player.slug === slug)
  }

  const davidHeys = getPlayerBySlug('david-heys')
  const davidHeysLink = <QuickLink href={`/result/${currentYearName}/player/${davidHeys.slug}`} name={davidHeys.name} />

  return (
    <>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Schools' />
        <p className='my-6'>A number of schools in the area actively encourage table tennis and have a table tennis club during or after school.</p>
        <p className='my-6'>If your school is interested in developing table tennis as an activity please contact {davidHeysLink}.</p>
        <p className='my-6'>We are happy to speak to table tennis enthusiasts from primary or secondary schools in either the mainstream or private sector.</p>
        <p className='my-6'>Please take a look at our <Link to='/sessions' className={linkStyles.join(' ')}>Sessions</Link> page for information on the currently available practice and coaching in the local area.</p>
      </div>
    </>
  )
}