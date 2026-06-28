import {getDbFromContext} from "~/db-context.server";
import {playerGetBySlugs} from "~/repositories/player.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";
import {QuickLink} from "~/routes/_front.about-us";

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
    'ian-pickles',
    'adam-hek',
    'fred-wade',
    'robin-willoughby',
  ])
  return { players, currentYearName: currentYear.name };
}

export default function _frontCommitteeMembers({ loaderData }: Route.ComponentProps) {
    const {
    players,
    currentYearName
  } = loaderData;

  const getPlayerBySlug = (slug) => {
    return players.find((player) => player.slug === slug)
  }

  const ianPickles = getPlayerBySlug('ian-pickles')
  const ianPicklesLink = <QuickLink href={`/result/${currentYearName}/player/${ianPickles.slug}`} name={ianPickles.name} />
  const adamHek = getPlayerBySlug('adam-hek')
  const adamHekLink = <QuickLink href={`/result/${currentYearName}/player/${adamHek.slug}`} name={adamHek.name} />
  const fredWade = getPlayerBySlug('fred-wade')
  const fredWadeLink = <QuickLink href={`/result/${currentYearName}/player/${fredWade.slug}`} name={fredWade.name} />
  const robinWillo = getPlayerBySlug('robin-willoughby')
  const robinWilloLink = <QuickLink href={`/result/${currentYearName}/player/${robinWillo.slug}`} name={robinWillo.name} />

  return (
    <>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='Code of Conduct' />
        <SubHeading name='East Lancashire Table Tennis League (“ELTTL”) CODE OF CONDUCT' />
        <SubHeading name='Including Complaints and Disciplinary Process' />

        <SubHeading name='APPLICATION' />

        <p className='my-4'>This Code applies to all persons (whether or not they are current ELTTL Members)
          participating in table tennis and/or related activities run or arranged by or on behalf of
          ELTTL. It should be read and applied in the context of, and with due regard to, ELTTL’s
          Constitution and Rules.
        </p>

        <SubHeading name='CODE OF CONDUCT' />

        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>Members of ELTTL, officials, players and participators are expected to conduct
              themselves at all times in an appropriate manner with due respect for other
              players, officials, spectators, parents and guardians and to refrain from any
              behaviour likely to bring the sport into disrepute.
            </p>
          </li>
        </ul>
        <p className='my-4'>The following types of offence would be considered a breach of this Code of
          Conduct, and may lead to sanctions. The list below is not intended to be
          comprehensive and any other conduct which may breach the above general
          principle may be dealt with under the Process set out below:
        </p>
        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>Offensive racial, sexual or other discriminatory language or conduct</p>
          </li>
          <li>
            <p className='my-4'>Displays of bad temper, swearing or shouting</p>
          </li>
          <li>
            <p className='my-4'>Unsportsmanlike behaviour towards opponents</p>
          </li>
          <li>
            <p className='my-4'>Discourteous or abusive behaviour to match officials, other players, or members of the public within a match setting</p>
          </li>
          <li>
            <p className='my-4'>Abuse of equipment</p>
          </li>
          <li>
            <p className='my-4'>Non-compliance with instructions of event officials or organisers</p>
          </li>
          <li>
            <p className='my-4'>Deliberate or consistent breach of ELTTL Rules</p>
          </li>
          <li>
            <p className='my-4'>Deliberately falsifying a points score or match result or taking part in match fixing</p>
          </li>
          <li>
            <p className='my-4'>Deliberately avoiding payment of practice session fees</p>
          </li>
          <li>
            <p className='my-4'>Conduct endangering safety</p>
          </li>
          <li>
            <p className='my-4'>Consumption of alcohol during a match</p>
          </li>
          <li>
            <p className='my-4'>Use of drugs or other illegal or performance-enhancing substances.</p>
          </li>
          <li>
            <p className='my-4'>Conduct endangering the welfare of any minor</p>
          </li>
          <li>
            <p className='my-4'>Abuse of authority or power by any ELTTL Committee Member or other
              participating official
            </p>
          </li>
        </ul>

        <SubHeading name='COMPLAINTS and DISCIPLINARY PANEL' />

        <p className='my-4'>At the AGM of ELTTL, or otherwise at a meeting of the General Committee, a Complaints
          and Disciplinary Panel (“the Panel”) will be appointed on an annual or ad-hoc basis
          consisting of no less than three General Committee Members other than the Chairman
          (one of whom shall be appointed as the Panel Chairman) and one other non-executive
          ELTTL representative member.
        </p>
        <p className='my-4'>The Sub-Committee for each specific case will consist of all or a minimum of three Panel
          members appointed by the Panel Chairman. No person involved in or with direct
          knowledge of the incident or matter which is the subject of the case shall be appointed.
        </p>

        <SubHeading name='PROCESS' />

        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>The time limits and formal requirements set out below may be subject to
              reasonable modification by the Chairman or the Panel Chairman to accommodate
              the circumstances of the case and ensure that persons involved in the process are
              afforded a fair and reasonable opportunity to participate and be fairly treated.
            </p>
          </li>
          <li>
            <p className='my-4'>Any person may make an oral or written complaint of an alleged breach of the
              Code of Conduct to any General Committee Member of the ELTTL who must refer it
              to the General Committee Chairman (“the Chairman”).
            </p>
          </li>
          <li>
            <p className='my-4'>The Chairman will initially investigate the complaint and decide whether it falls
              within this Code of Conduct. The Chairman may seek to resolve the complaint
              informally or may deem it serious enough to be referred to the Panel. Any such
              investigation and referral by the Chairman shall be carried out within 21 days of
              receipt of the complaint. If at that stage the Chairman considers that the
              circumstances are of a sufficiently serious nature to warrant it, the Chairman may
              temporarily suspend the accused from participation in matches and/or other ELTTL
              activities.
            </p>
          </li>
          <li>
            <p className='my-4'>The complainant and/or the accused shall also have the right within 28 days of the
              initial complaint to request in writing that the matter be referred formally to the
              Panel. In that event the person so requesting shall provide a summary of their
              case in writing to the Chairman who will within 14 days refer it to the Panel
              Chairman accompanied by any written comments or report which the Chairman
              may decide to make.
            </p>
          </li>
          <li>
            <p className='my-4'>Within 7 days of receipt of any such referral, the Panel Chairman will provide the
              accused and the complainant with copies of all such written submissions (including
              any report of the Chairman). They shall be given the opportunity to submit, within
              14 days, any further written representations which they may wish to make.
            </p>
          </li>
          <li>
            <p className='my-4'>Within a further 14 days the Panel Chairman will appoint and convene a hearing of
              the Panel Sub-Committee for the case. At least 14 days written or e-notice of the
              hearing will be given to the accused, the complainant and the Chairman along with
              copies of all written submissions. At the hearing the Panel Sub-Committee will
              consider the written submissions and, if they are present or represented, will hear
              oral representations from the Complainant, the accused and the Chairman or other representative of the ELTTL General Committee, any of whom may call witnesses.
              The standard of proof will be the balance of probability.
            </p>
          </li>
          <li>
            <p className='my-4'>Except in cases a) or b) below, a written decision will be issued by the Panel Sub-
              Committee unless all parties agree to accept an oral decision given at the hearing.

              The written decision will be posted or e-sent to the accused within 14 days of the
              hearing and all decisions will be reported to the General Committee and recorded.
            </p>
          </li>
          <li>
            <p className='my-4'>The Panel Sub-Committee may impose any one or more of the following sanctions:</p>
            <ol className='list- pl-6'>
              <li data-list-text='a)'>
                <p className='my-4'>a) A directive to the accused to make an oral or written apology to the
                  complainant and/or the ELTTL General Committee (default of which will
                  itself be deemed a further breach of conduct)
                </p>
              </li>
              <li data-list-text='b)'>
                <p className='my-4'>b) An oral warning</p>
              </li>
              <li data-list-text='c)'>
                <p className='my-4'>c) A written warning</p>
              </li>
              <li data-list-text='d)'>
                <p className='my-4'>d) Monetary compensation for damage to equipment or premises</p>
              </li>
              <li data-list-text='e)'>
                <p className='my-4'>e) A fine payable to ELTTL</p>
              </li>
              <li data-list-text='f)'>
                <p className='my-4'>f) Suspension from participation in practice sessions and/or league matches and/or cup matches and/or other events or competitions run by ELTTL either for a period of time or for a specified number and type of occasions.</p>
              </li>
              <li data-list-text='g)'>
                <p className='my-4'>g) Termination of ELTTL membership</p>
              </li>
              <li data-list-text='h)'>
                <p className='my-4'>h) Such other sanction as the Disciplinary Committee may in its discretion deem appropriate to the circumstances</p>
              </li>
            </ol>
          </li>
          <li>
            <p className='my-4'>Any person who receives two warnings including one written warning will automatically be excluded from ELTTL membership and participation unless and until readmitted by specific permission of the General Committee.</p>
          </li>
        </ul>

        <h2 className='font-semibold mb-4 mt-6'>APPEAL</h2>
        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>An accused person may appeal against any sanction other than a) or b) above
              by giving written notice stating the grounds of appeal to the Panel Chairman
              within 28 days of accepting an oral decision or being sent a written decision.
            </p>
          </li>
          <li>
            <p className='my-4'>A complainant may appeal against a decision not to sanction the accused
              person
            </p>
          </li>
          <li>
            <p className='my-4'>Unless there are exceptional circumstances an appeal will normally only be
              justified if new evidence/circumstances are demonstrated to alter/mitigate
              the decision of the Panel Sub-Committee
            </p>
          </li>
          <li>
            <p className='my-4'>The appeal will be heard by the General Committee, or at least a quorum
              thereof, not including anyone involved in the Panel Sub-Committee hearing.
              The appeal hearing will if possible be arranged within 28 days of receipt of
              the notice of appeal. The precise process will be at the discretion of the
              General Committee depending upon the circumstances and with the intention

              that it will be fair and reasonable to all parties. Those hearing the appeal
              may confirm, set aside, reduce or increase any sanctions previously imposed.
            </p>
          </li>
          <li>
            <p className='my-4'>Further appeals may be possible to either Lancashire County Table Tennis
              Association and/or Table Tennis England if applicable and in accordance with
              their rules.
            </p>
          </li>
        </ul>

        <SubHeading name='INAPPROPRIATE, UNREASONABLE OR VEXATIOUS COMPLAINTS' />

        <p className='my-4'>There may be circumstances when a complainant seeks to pursue a complaint
          unreasonably or when ELTTL has already taken reasonable action in response.
          ELTTL reserves the right to refuse to deal, or deal further, with a complaint if it
          considers it to be inappropriate, vexatious, unmeritorious or frivolous and this
          decision is at ELTTL’s sole discretion. For example:
        </p>

        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>a complaint which appears to fall outside the auspices of ELTTL and/or the
              application of this Code
            </p>
          </li>
          <li>
            <p className='my-4'>
              a complaint which appears to be without merit and intended to cause inconvenience, harassment or expense to ELTTL
            </p>
          </li>
          <li>
            <p className='my-4'>
              a complaint which appears to have no serious purpose or value and/or where investigating it would be out of proportion to the seriousness of the issues complained about

            </p>
          </li>
          <li>
            <p className='my-4'>
              an investigated complaint on which it is considered that no further action can usefully be taken and only new and substantive issues would merit a response.
            </p>
          </li>
        </ul>
        <p className='my-4'>Any refusal decision of this kind will be made initially by the Chairman who will then call a meeting of the General Committee as soon as possible to confirm or overrule that decision.
        </p>

        <hr />

        <p className='my-4 '>Note: The following have been appointed initially to the Complaints and Disciplinary
          Panel: {ianPicklesLink} (Chairman), {adamHekLink}, {fredWadeLink}, and {robinWilloLink} to serve until any other appointment is made.
        </p>

      </div>
    </>
  )
}