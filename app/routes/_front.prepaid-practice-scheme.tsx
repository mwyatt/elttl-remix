import MainHeading from "~/components/MainHeading";
import {linkStyles} from "~/styles/ui-classes";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Prepaid Practice Scheme"},
        {
            name: "description",
            content: "Save money on regular practice sessions at Hyndburn Table Tennis Centre or St. Peters with the League’s annual prepaid scheme. Learn how the season ticket works and compare costs for single‑venue or combined access."
        },
    ];
}

export default function _frontPrepaidPracticeScheme({loaderData}: Route.ComponentProps) {
    return (
        <>
            <div className='max-w-[768px] mx-auto'>
                <MainHeading name='Prepaid Practice Scheme'/>
                <p className='my-6'>The League now offers an alternative to paying a fee for each practice session at
                    Hyndburn Table Tennis Centre or St. Peters in Burnley.</p>
                <p className='my-6'>If you go frequently (2, 3 or even 4 times per week) it might be cheaper and more
                    convenient to pay annually.</p>
                <p className='my-6'>For more information on the practice sessions available please see the <Link
                    className={linkStyles.join(' ')} to='/sessions'>Sessions</Link> page.</p>
                <p className='my-6'>The annual fee (Season Ticket) is <span
                    className='px-2 rounded bg-primary-500 text-white mx-1'>£250</span> per year. Annual competitions (
                    e.g. Big Day, Hard Bat etc) and League matches are excluded from this scheme.</p>
                <p className='my-6'>If you are interested in this scheme please contact any committee member and they
                    will pass your information on.</p>
                <p className='my-6'>Harry Rawcliffe will also put a sheet up in the Centre for players to register their
                    interest.</p>
                <p className='my-6'>This scheme has been extended to include St. Peters. Players at Burnley can now
                    pay <span className='px-2 rounded bg-primary-500 text-white mx-1'>£200</span> per year at St. Peters
                    only.</p>
                <p className='my-6'>For combined Hyndburn Table Tennis Centre and St. Peters access the cost is <span
                    className='px-2 rounded bg-primary-500 text-white mx-1'>£350</span> per year.</p>
            </div>
        </>
    )
}