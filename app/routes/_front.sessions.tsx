import type {Route} from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";
import {linkStyles} from "~/styles/ui-classes";
import {sessionContacts, sessions, sessionVenues} from "~/constants/VenueSessions";
import {homeNightMap} from "~/constants/Team";
import dayjs from "dayjs";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Sessions"},
        {
            name: "description",
            content: "Find out about the various sessions available at our venues, including practice times and special events."
        },
    ];
}

export async function loader({context}: Route.LoaderArgs) {
    const db = getDbFromContext(context);
    const currentYear = await getCurrentYear(db)
    return {currentYear};
}

export default function _frontSessions({loaderData}: Route.ComponentProps) {
    const {
        currentYear,
    } = loaderData;

    const now = dayjs()

    const isToday = (day) => {
        const today = now.day()
        return parseInt(day) === today
    }

    return (
        <>
            <div className='max-w-[768px] mx-auto'>
                <MainHeading name='Coaching & Sessions'/>
                <p className='my-6'>Looking to play some table tennis? We have several venues in the surrounding area
                    with a session or two most days. Just turn up and pay on the day!</p>
                <p className='my-6'>Coaching for under 18s is now on Friday evenings. The coaching is facilitated by
                    Mick Moir who has been appointed to develop the sport in schools and across the community.</p>
                <p className='my-6'>Adults who wish to play, from beginners to experienced players, are welcome at our
                    Bat & Chat sessions. Advice will be available anyone who wants to improve their game.</p>
                <SubHeading name='Prepaid Practice Scheme'/>
                <p className='my-6 mb-12'>The League now offers an alternative to paying a fee for each practice session
                    at Hyndburn Table Tennis Centre or St. Peters in Burnley. Please find out more on the <Link
                        to='/prepaid-practice-scheme' className={linkStyles.join(' ')}>Prepaid Practice
                        Scheme</Link> page.</p>

                {Object.entries(sessions).map(([day, venueSessions]) => (
                    <div key={day}
                         className={`mb-12 ${isToday(day) ? 'border-primary-500 px-6 pb-4 border-2 rounded' : ''}`}>
                        <SubHeading name={homeNightMap[day]}/>
                        {Object.entries(venueSessions).map(([venueId, sessions]) => (
                            <div key={venueId} className='mb-4'>
                                <h3 className='text-lg mb-4'>
                                    <Link to={`/result/${currentYear.name}/venue/${sessionVenues[venueId].slug}`}
                                          className={linkStyles.join(' ')}>
                                        {sessionVenues[venueId].name}
                                    </Link>
                                </h3>
                                <ul className='list-disc list-inside pl-5'>
                                    {sessions.map((session, index) => (
                                        <li key={index}>
                                            {session.name}
                                            {session.cost && (
                                                <span
                                                    className='px-2 rounded bg-primary-500 text-white text-sm ml-2'>{session.cost}</span>
                                            )}
                                            {session.contactId && (
                                                <span className='ml-2 text-sm text-gray-500 text-base'>Contact: <Link
                                                    className={linkStyles.join(' ')}
                                                    to={`result/${currentYear.name}/player/${sessionContacts[session.contactId].slug}`}>{sessionContacts[session.contactId].name}</Link></span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}