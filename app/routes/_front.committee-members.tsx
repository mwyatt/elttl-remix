import type { Route } from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
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
  return { players };
}

export default function _frontCommitteeMembers({ loaderData }: Route.ComponentProps) {
    const {
    players,
  } = loaderData;

    const getContact = (landline, mobile) => {
  if (landline && mobile) {
    return <span>{landline} / {mobile}</span>
  }
  if (landline) {
    return <span>{landline}</span>
  }
  if (mobile) {
    return <span>{mobile}</span>
  }
}

    // @todo dry up
  const getPlayerBySlug = (slug) => {
    return players.find((player) => player.slug === slug)
  }

  const welfareOfficer = {
    name: 'Catherine Lawson',
    phoneLandline: '',
    phoneMobile: '07505 354318'
  }

  const committeeMembers = [
    { role: 'Hon. Chairman', player: getPlayerBySlug('ged-simpson') },
    { role: 'Hon. Vice Chairman', player: getPlayerBySlug('ian-pickles') },
    { role: 'Hon. Secretary', player: getPlayerBySlug('david-heys') },
    { role: 'Asst Secretary', player: null },
    { role: 'Hon. Treasurer', player: getPlayerBySlug('martin-ormsby') },
    { role: 'Hon. Fixtures Secretary', player: getPlayerBySlug('bernard-milnes') },
    { role: 'Assist. Fixtures Secretary', player: getPlayerBySlug('mike-turner') },
    { role: 'Centre Liaison Officer', player: getPlayerBySlug('robin-willoughby') },
    { role: 'Media Officer', player: getPlayerBySlug('adam-hek') },
    { role: 'Welfare Officer', player: welfareOfficer },
    { role: 'Web Designer', player: getPlayerBySlug('martin-wyatt') },
    {
      role: 'Handicap Officer',
      player: {
        name: 'Grant Saggers',
        phoneLandline: '',
        phoneMobile: '07939 367743'
      }
    },
    { role: 'Tournament Team', player: getPlayerBySlug('mike-turner') },
    { role: '', player: getPlayerBySlug('ian-pickles') },
    { role: 'Premier Div Rep', player: getPlayerBySlug('colin-hooper') },
    { role: 'First Div Rep', player: getPlayerBySlug('ian-pickles') },
    { role: 'Second Div Rep', player: getPlayerBySlug('robin-willoughby') },
    { role: 'Third Div Rep', player: getPlayerBySlug('fred-wade') },
    { role: 'InterLeague Secretary', player: getPlayerBySlug('jason-pilling') }
  ]

  const otherCommitteeMembers = [
    { player: getPlayerBySlug('shamir-bose') },
    { player: getPlayerBySlug('mick-moir') },
    { player: getPlayerBySlug('harry-rawcliffe') },
    { player: getPlayerBySlug('chris-freely') }
  ]

  return (
    <>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='Committee Members' />
        <table className='table-auto w-full mt-4 mb-12'>
          <thead>
            <tr className='text-left'>
              <th className='p-2 md:p-4'>Role</th>
              <th className='p-2 md:p-4'>Name</th>
              <th className='p-2 md:p-4'>Contact</th>
            </tr>
          </thead>
          <tbody>
            {committeeMembers.map((member, index) => (
              <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
                <td className='p-2 md:p-4'>
                  {member.role}
                </td>
                <td className='p-2 md:p-4'>
                  {member.player && (
                    member.player.name
                  )}
                  {!member.player && (
                    'Vacant Post'
                  )}
                </td>
                <td className='p-2 md:p-4'>
                  {member.player && getContact(member.player.phoneLandline, member.player.phoneMobile)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubHeading name='Other Committee Members' />
        <table className='table-auto w-full mt-4 mb-12'>
          <thead>
            <tr className='text-left'>
              <th className='p-2 md:p-4'>Name</th>
              <th className='p-2 md:p-4'>Contact</th>
            </tr>
          </thead>
          <tbody>
            {otherCommitteeMembers.map((member, index) => (
              <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
                <td className='p-2 md:p-4'>
                  {member.player && (
                    member.player.name
                  )}
                </td>
                <td className='p-2 md:p-4'>
                  {member.player && getContact(member.player.phoneLandline, member.player.phoneMobile)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubHeading name='The Welfare Officer' />
        <p className='my-4'>{welfareOfficer.name} is our Welfare Officer. If you have any concerns about an issue relating to the safeguarding of a young
          person or a vulnerable adult please contact Catherine on {welfareOfficer.phoneMobile}. <span className='font-bold'>Please Note:</span> The League is clear that Parents have overall responsibility for their Child’s
          safety at all times.
        </p>

      </div>
    </>
  )
}