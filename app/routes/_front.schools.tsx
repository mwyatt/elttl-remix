import type {Route} from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import {Link} from "react-router";
import {linkStyles} from "~/styles/ui-classes";
import {buildMeta} from "~/constants/MetaData";
import {getPlayerBySlug} from "~/libraries/player";
import QuickLink from "~/components/QuickLink";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Schools",
    description:
      "Information for schools interested in developing table tennis, including guidance for primary and secondary pupils and contact details for league representatives.",
  });
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

  const davidHeys = getPlayerBySlug('david-heys', players)
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