import type {Route} from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";
import {buildMeta} from "~/constants/MetaData";
import {getPlayerBySlug} from "~/libraries/player";

export function meta({}: Route.MetaArgs) {
    return buildMeta({
        title: 'Committee Members',
        description: "View the full list of East Lancashire Table Tennis League committee members, including key roles, contact details, welfare and safeguarding officers, divisional representatives, and other officials who help run the League."
    })
}

export async function loader({context}: Route.LoaderArgs) {
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
    return {players};
}

export default function _frontCommitteeMembers({loaderData}: Route.ComponentProps) {
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

    const welfareOfficer = {
        name: 'Catherine Lawson',
        phoneLandline: '',
        phoneMobile: '07505 354318'
    }

    const committeeMembers = [
        {role: 'Hon. Chairman', player: getPlayerBySlug('ged-simpson', players)},
        {role: 'Hon. Vice Chairman', player: getPlayerBySlug('ian-pickles', players)},
        {role: 'Hon. Secretary', player: getPlayerBySlug('david-heys', players)},
        {role: 'Asst Secretary', player: null},
        {role: 'Hon. Treasurer', player: getPlayerBySlug('martin-ormsby', players)},
        {role: 'Hon. Fixtures Secretary', player: getPlayerBySlug('bernard-milnes', players)},
        {role: 'Assist. Fixtures Secretary', player: getPlayerBySlug('mike-turner', players)},
        {role: 'Centre Liaison Officer', player: getPlayerBySlug('robin-willoughby', players)},
        {role: 'Media Officer', player: getPlayerBySlug('adam-hek', players)},
        {role: 'Welfare Officer', player: welfareOfficer},
        {role: 'Web Designer', player: getPlayerBySlug('martin-wyatt', players)},
        {
            role: 'Handicap Officer',
            player: {
                name: 'Grant Saggers',
                phoneLandline: '',
                phoneMobile: '07939 367743'
            }
        },
        {role: 'Tournament Team', player: getPlayerBySlug('mike-turner', players)},
        {role: '', player: getPlayerBySlug('ian-pickles', players)},
        {role: 'Premier Div Rep', player: getPlayerBySlug('colin-hooper', players)},
        {role: 'First Div Rep', player: getPlayerBySlug('ian-pickles', players)},
        {role: 'Second Div Rep', player: getPlayerBySlug('robin-willoughby', players)},
        {role: 'Third Div Rep', player: getPlayerBySlug('fred-wade', players)},
        {role: 'InterLeague Secretary', player: getPlayerBySlug('jason-pilling', players)}
    ]

    const otherCommitteeMembers = [
        {player: getPlayerBySlug('shamir-bose', players)},
        {player: getPlayerBySlug('mick-moir', players)},
        {player: getPlayerBySlug('harry-rawcliffe', players)},
        {player: getPlayerBySlug('chris-freely', players)}
    ]

    return (
        <>
            <div className='max-w-[768px] mx-auto'>
                <MainHeading name='Committee Members'/>
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
                        <tr key={index} className='border-t border-t-neutral-300 border-dashed hover:bg-gray-100'>
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

                <SubHeading name='Other Committee Members'/>
                <table className='table-auto w-full mt-4 mb-12'>
                    <thead>
                    <tr className='text-left'>
                        <th className='p-2 md:p-4'>Name</th>
                        <th className='p-2 md:p-4'>Contact</th>
                    </tr>
                    </thead>
                    <tbody>
                    {otherCommitteeMembers.map((member, index) => (
                        <tr key={index} className='border-t border-t-neutral-300 border-dashed hover:bg-gray-100'>
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

                <SubHeading name='The Welfare Officer'/>
                <p className='my-4'>{welfareOfficer.name} is our Welfare Officer. If you have any concerns about an
                    issue relating to the safeguarding of a young
                    person or a vulnerable adult please contact Catherine on {welfareOfficer.phoneMobile}. <span
                        className='font-bold'>Please Note:</span> The League is clear that Parents have overall
                    responsibility for their Child’s
                    safety at all times.
                </p>

            </div>
        </>
    )
}