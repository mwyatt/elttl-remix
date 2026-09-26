import SubHeading from "~/components/SubHeading";
import FixtureCard from "~/components/FixtureCard";
import { Link } from "react-router";
import { linkStyles } from "~/styles/ui-classes";

export const VetsCompetitionContent = () => {
  return (
    <>
      <p className="my-6">
        The Vets Competitions are usually played on one or more evenings in
        December and are open to all current league players &amp; Bat &amp; Chat
        regulars at HTTC and St Peters Burnley. Of late we have used the
        following categories:
      </p>
      <ul className="list-disc pl-6">
        <li>Younger Vets - 40 years and over</li>
        <li>Older Vets - 60 years and over</li>
      </ul>
    </>
  );
};

export const FredHoldenCupCompetitionContent = ({
  year,
  rounds,
  teamsBySlug,
}) => {
  return (
    <>
      <p className="my-6">
        The Fred Holden Trophy is contested by all the teams in the league, the
        competition is team handicapped.
      </p>
      <p className="my-6">
        It is a straightforward Knock out. A preliminary round will start the
        competition with the first round involving many teams from the league.
        It will then continue down to a final held at the end of the league
        programme.
      </p>
      {Array.isArray(rounds) && <hr />}
      {Array.isArray(rounds) &&
        rounds.map((round, index) => (
          <div key={index}>
            <SubHeading name={round.name} />
            <div className={"grid grid-cols-1  md:grid-cols-2 gap-4"}>
              {round.fixtures.map((fixture, index) => (
                <div
                  key={index}
                  className={
                    "border-stone-500 border text-stone-500 rounded shadow-md flex justify-center p-3 flex gap-4 items-center text-center"
                  }
                >
                  <div className={"w-1/3"}>
                    <Link
                      to={
                        "/result/" +
                        year +
                        "/team/" +
                        teamsBySlug[fixture.teamLeftSlug]?.slug
                      }
                      className={linkStyles.join(" ")}
                    >
                      {teamsBySlug[fixture.teamLeftSlug]?.name}
                    </Link>
                  </div>
                  <div>vs</div>
                  <div className={"w-1/3"}>
                    <Link
                      to={
                        "/result/" +
                        year +
                        "/team/" +
                        teamsBySlug[fixture.teamRightSlug]?.slug
                      }
                      className={linkStyles.join(" ")}
                    >
                      {teamsBySlug[fixture.teamRightSlug]?.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  );
};

export const DivisionalHandicapCompetitionContent = () => {
  return (
    <>
      <p className="my-6">
        We have recently reintroduced the Divisional Handicap Competitions to be
        played sometime in February. There is a Premier &amp; First Division
        Competition one evening and a Second and Third Division Competition
        another. Player handicaps will be taken from the latest individual
        ranking points and matches will be best of three games first to 21
        points.
      </p>
    </>
  );
};

export const AnnualClosedCompetitionContent = () => {
  return (
    <>
      <p className="my-6">
        This full day event normally takes place on a Sunday in February and is
        open to all current League Members.
      </p>
      <p className="my-6">
        The competitions usually include an open Singles and a Plate together,
        so far as possible, with either, Doubles, Handicapped Singles and/or,
        Handicapped Doubles. The Tournaments Secretary will decide on the exact
        format dependent on the number of entries and time available. Further
        details will be provided closer to the day.
      </p>
      <p className="my-6">
        Players will be required to pre-register for the day in advance.
        Individuals who turn up on the day without pre-registering will not be
        allowed to play. There will be a small entry fee.
      </p>
    </>
  );
};
