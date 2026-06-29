import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";
import {
    AnnualClosedCompetitionContent,
    DivisionalHandicapCompetitionContent,
    FredHoldenCupCompetitionContent,
    VetsCompetitionContent
} from "~/components/CompetitionsContent";
import {buildMeta} from "~/constants/MetaData";

export function meta({}) {
    return buildMeta({
        title: 'Annual League Competition',
        description: "Information about the competitions held by the league annually, including the Fred Holden Cup, Annual Closed Competition, and other events."
    })
}

export default function _frontCompetitions() {
    return (
        <div className='max-w-[768px] mx-auto'>
            <MainHeading name='Annual League Competition'/>
            <p className='my-6'>Each division is usually based on ten teams; each team will play each other twice (home
                and away).</p>
            <p className='my-6'>The format of the League is usually decided at the formation meeting in July/August.
                At the end of the season the top two teams in each division will be promoted.
            </p>
            <p className='my-6'>The bottom two in each division will be relegated. If a division has only nine teams
                then only one would be relegated but two promoted.</p>
            <p className='my-6 border border-stone-300 p-4 rounded'>The Committee reserve the right to vary this
                according to the number of teams who apply to play in the League
                and the constitution of the teams involved.
            </p>

            <SubHeading name='The Fred Holden (Handicap) Cup'/>
            <FredHoldenCupCompetitionContent/>

            <SubHeading name='Annual Closed Competition - The Big Day'/>
            <AnnualClosedCompetitionContent/>

            <SubHeading name='Other Competitions'/>

            <p className='my-6'>
                The format of these competitions will be determined by the Tournament Secretary, dependent on the number
                of entries received.
                Usually they will start as round robin before moving to a knockout stage.
            </p>
            <p className='my-6'>
                The exact dates of these competitions are given in the Handbook section of the Website at the start of
                each season.
            </p>

            <h3 className='text-lg font-semibold mb-3 mt-5'>The Vets Competitions</h3>
            <VetsCompetitionContent/>

            <h3 className='text-lg font-semibold mb-3 mt-5'>The Divisional Handicap Competitions</h3>
            <DivisionalHandicapCompetitionContent/>

            <h3 className='text-lg font-semibold mb-3 mt-5'>Hard Bat (Ping Pong) Competition and Summer League</h3>
            <p className='my-6'>
                Dependent upon the interest shown by current players these will be arranged if possible to take place
                after the end of the Annual League fixture programme.
            </p>
        </div>
    )
}