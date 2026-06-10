import type { Route } from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {Link} from "react-router";
import {linkStyles} from "~/styles/ui-classes";
import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";

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
    'mick-moir',
    'bryan-edwards',
    'darren-wright',
    'neil-hepworth',
    'colin-hooper',
    'trevor-elkington',
    'ian-pickles',
    'robin-willoughby',
    'harry-rawcliffe',
    'fred-wade',
    'adam-hek',
    'ged-simpson',
    'martin-ormsby',
    'bernard-milnes',
    'mike-turner',
    'catherine-lawson',
    'martin-wyatt',
    'grant-saggers',
    'colin-hooper',
    'shamir-bose',
    'chris-freely',
    'jason-pilling'
  ])
  return { players, currentYearName: currentYear.name };
}

export const QuickLink = ({ href, name, external = false }) => {
  return <Link className={linkStyles.join(' ')} to={href} target={external ? '_blank' : '_self'} rel='noreferrer'>{name === undefined ? href : name}</Link>
}

export default function AboutUsPage({ loaderData }: Route.ComponentProps) {
    const {
    players,
    currentYearName
  } = loaderData;

  const nextYearName = parseInt(currentYearName) + 1
  const handbookLink = <QuickLink href={`/handbook-${currentYearName}-${nextYearName}.pdf`} name='Handbook' external />

  const getPlayerBySlug = (slug) => {
    return players.find((player) => player.slug === slug)
  }

  const davidHeys = getPlayerBySlug('david-heys')
  const mickMoir = getPlayerBySlug('mick-moir')
  const bryanEdwards = getPlayerBySlug('bryan-edwards')
  const darrenWright = getPlayerBySlug('darren-wright')
  const neilHepworth = getPlayerBySlug('neil-hepworth')
  const colinHooper = getPlayerBySlug('colin-hooper')
  const trevorElkington = getPlayerBySlug('trevor-elkington')

  const davidHeysLink = <QuickLink href={`/result/${currentYearName}/player/${davidHeys.slug}`} name={davidHeys.name} />
  const mickMoirLink = <QuickLink href={`/result/${currentYearName}/player/${mickMoir.slug}`} name={mickMoir.name} />
  const bryanEdwardsLink = <QuickLink href={`/result/${currentYearName}/player/${bryanEdwards.slug}`} name={bryanEdwards.name} />
  const darrenWrightLink = <QuickLink href={`/result/${currentYearName}/player/${darrenWright.slug}`} name={darrenWright.name} />
  const neilHepworthLink = <QuickLink href={`/result/${currentYearName}/player/${neilHepworth.slug}`} name={neilHepworth.name} />
  const colinHooperLink = <QuickLink href={`/result/${currentYearName}/player/${colinHooper.slug}`} name={colinHooper.name} />
  const trevorElkingtonLink = <QuickLink href={`/result/${currentYearName}/player/${trevorElkington.slug}`} name={trevorElkington.name} />

  const coachingAndSessionsLink = <QuickLink href='/sessions' name='Coaching and Sessions' />
  const competitionsLink = <QuickLink href='/competitions' name='Competitions' />

  return (
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='About Us' />

        <p className='my-4'>Our League has been running since 1974, originally being the Hyndburn Table Tennis League and
          becoming the East Lancashire Table Tennis League in 2001 in order to take in the wider East Lancashire
          area as various other local leagues ceased to exist.
        </p>

        <p className='my-4'>Whether you are able-bodied or have a disability, an experienced player wishing to play competitive
          league table tennis, a beginner wishing to learn or just someone who wants to play for fun, our League
          provides facilities, opportunities, coaching and contacts in the East Lancashire area.
        </p>

        <p className='my-4'>For more information contact our Secretary {davidHeysLink} or any of our Committee Members (see annual {handbookLink}
          ) - or drop in at one of our Bat and Chat or Practice sessions at Hyndburn Leisure Centre or
          Burnley St. Peters Leisure Centre. First session is free for anyone who wants to come along and try us
          out!
        </p>

        <SubHeading name='Venues' />
        <SubHeading name='Fred Holden Table Tennis Centre at Hyndburn Leisure Centre' />

        <p className='my-4'>Here we have a dedicated Table Tennis Centre with a hall accommodating up to 10 tables where we run
          informal Bat and Chat Sessions, Practice Sessions and coaching, open to all.
        </p>
        <p className='my-4'>For further details and charges see {coachingAndSessionsLink} or contact {davidHeysLink}.</p>

        <SubHeading name='St. Peter’s Leisure Centre, Burnley' />

        <p className='my-4'>We have Bat and Chat and Practice Sessions with up to 10 tables available every week in the main Sports
          Hall as follows:
        </p>
        <p className='my-4'>For further details and charges see {coachingAndSessionsLink} or contact {davidHeysLink}.</p>

        <SubHeading name='Local Clubs' />

        <p className='my-4'>Several local clubs throughout East Lancashire are affiliated to the League and participate in the Annual
          League and other Competitions organised by the League. They have their own membership and practice
          arrangements and welcome newcomers. They include:
        </p>

        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>Kay St. Baptists, Rawtenstall - contact {trevorElkingtonLink}; website: <QuickLink href='https://www.kaystreet.co.uk/sport' external />
            </p>
          </li>
          <li>

            <p className='my-4'>Whalley Table Tennis Club, Village Hall, Whalley - contact {colinHooperLink}
            </p>
          </li>
          <li>

            <p className='my-4'>Doals Community Centre, Weir, Bacup - contact {neilHepworthLink}
            </p>
          </li>
          <li>

            <p className='my-4'>Vanguard Table Tennis Club, Burnley - contact {darrenWrightLink}; website: <QuickLink href='https://www.vanguardttclub.co.uk' external />
            </p>
          </li>
          <li>

            <p className='my-4'>Ramsbottom Cricket Club – contact {bryanEdwardsLink}
            </p>

          </li>
        </ul>

        <SubHeading name='League Participation and Membership' />

        <p className='my-4'>There is no obligation to become a League Member or participate in League Competitions but for those
          who wish to do so we operate an Annual League normally running between September and April -
          catering, currently over four Divisions, for a wide range of skill levels. There is a small individual League
          joining fee as well as a requirement to join <QuickLink href='http://tabletennisengland.co.uk/' name='Table Tennis England' external /> as a player member. In addition we run
          a number of other {competitionsLink} for League Members.
        </p>

        <p className='my-4'>For further details see {handbookLink} , {competitionsLink} and other League details on this website.
        </p>

        <SubHeading name='Coaching' />

        <p className='my-4'>
          Several of our members are qualified coaches who are happy provide advice and guidance when they
          are in attendance at Bat &amp; Chat and Practice Sessions, or by individual arrangement.
        </p>
        <p className='my-4'>
          Professional coaching for under 18s (Juniors) is available at Hyndburn Centre from {mickMoirLink} who has
          been appointed to develop the sport in schools and across the community. He will also provide adult
          coaching by arrangement. He can be contacted direct: {mickMoirLink} or we can put you in touch. See {coachingAndSessionsLink}.
        </p>
      </div>
  )
}