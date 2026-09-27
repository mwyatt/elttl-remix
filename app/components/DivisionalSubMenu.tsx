import LinkButton from "~/components/LinkButton";
import classNames from "classnames";

export default function DivisionalSubMenu ({ year, division, hasGrid = true }) {
  return (
    <div className={classNames({
      'rounded text-center gap-2 flex flex-col': true,
      "grid sm:grid-cols-3": hasGrid
    })}>
      <LinkButton to={`/result/${year}/${division}/league`} theme={'secondary'} className={'block'}>
        League Table
      </LinkButton>
      <LinkButton to={`/result/${year}/${division}/merit`} theme={'secondary'} className={'block'}>
        Merit Table
      </LinkButton>
      <LinkButton to={`/result/${year}/${division}/doubles-merit`} theme={'secondary'} className={'block'}>
        Doubles Merit Table
      </LinkButton>
    </div>
  )
}
