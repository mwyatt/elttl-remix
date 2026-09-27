import { allHomeButtonStyles } from "~/styles/ui-classes";
import { Link } from "react-router";
import { getSeasonName } from "~/libraries/year";
import LinkButton from "~/components/LinkButton";

const Panel = ({ name, total, url }) => (
  <Link
    to={url}
    className="flex-wrap flex p-6 grow text-xl flex-col items-center gap-2 rounded bg-secondary-500 text-white"
  >
    <span className="text-5xl font-semibold">{total}</span>
    {name}
  </Link>
);

export default function SeasonTotals({ yearName, totals }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h2 className="text-2xl grow">Season {getSeasonName(yearName)}</h2>
        <div className="flex gap-2">
          <LinkButton
            to={`/result/${yearName}`}
            theme={'secondary'}
            size={'small'}
          >
            Team Information
          </LinkButton>
          <LinkButton
            to={`/result/${yearName}/season`}
            theme={'secondary'}
            size={'small'}
          >
            Season Overview
          </LinkButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Panel
          name="Divisions"
          url={`/result/${yearName}`}
          total={totals.divisions}
        />
        <Panel name="Teams" url={`/result/${yearName}`} total={totals.teams} />
        <Panel
          name="Players"
          url={`/result/${yearName}`}
          total={totals.players}
        />
        <Panel
          name="Fixtures Fulfilled"
          url={`/result/${yearName}/season`}
          total={
            <span>
              {totals.fixtures.fulfilled}
              <span className="opacity-50">/{totals.fixtures.total}</span>
            </span>
          }
        />
      </div>
    </div>
  );
}
