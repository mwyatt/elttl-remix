export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us" },
    { name: "description", content: "Our League has been running since 1974, originally being the Hyndburn Table Tennis League and becoming the East Lancashire Table Tennis League in 2001 in order to take in the wider East Lancashire area as various other local leagues ceased to exist." },
  ];
}

export default function _frontConstitutionAndRules({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <div className='max-w-[768px] mx-auto'>
        <h1 className='text-2xl mb-4'>Constitution and Rules</h1>
        {/* @todo key and links to different areas of the rules */}
        {/* <div> */}
        {/*  <GeneralLink href={'#constitution'}>Constitution</GeneralLink> */}
        {/*  <GeneralLink href={'#constitution'}>Constitution</GeneralLink> */}
        {/* </div> */}
        <div className='text-sm'>
          <h2 id='constitution' className='text-xl mb-2 font-semibold text-center underline'>CONSTITUTION</h2>
          <h3 className='text-lg mb-2 font-semibold'>NAME AND GOVERNANCE</h3>
          <ol className='list-decimal list-inside'>
            <li className='my-4'>The League shall be called the EAST LANCASHIRE TABLE TENNIS LEAGUE (“the League”)</li>
          </ol>
          <p className='my-4'>1a. The affairs of the League shall be governed by a General Committee (“the Committee”)
            constituted as provided below.
          </p>
          <p className='my-4 font-bold'>Objects:</p>
          <ol>
            <li className='my-4'>2. The League shall be open to participation by clubs, teams and individuals in the
              East Lancashire
              district subject to the approval of the Committee.
            </li>
          </ol>
          <p className='my-4'>2a. The League shall be non- profit making and any surplus shall be ploughed back into the
            League
            and shall not be for the financial gain of any individual.
          </p>
          <p className='my-4'>2b. The principal purposes and functions of the League shall be to promote and support
            table tennis
            within the East Lancashire area, in particular by:
          </p>
          <ul className='list-disc pl-12 my-4'>
            <li>Running an annual league</li>
            <li>Running competitions, tournaments and other table tennis events</li>
            <li>Providing a central base for the League (currently at Hyndburn Sports Centre) with practice
              facilities open to League Members and to other persons interested in playing table tennis
              subject to the approval of the Committee
            </li>
            <li>Providing or arranging coaching and training facilities</li>
          </ul>
          <p className='my-4 font-bold'>Affiliation and Registration</p>
          <ol>
            <li className='my-4'>3. The League shall be affiliated to the English Table Tennis Association (“Table
              Tennis England” /
              “TTE”) and the Lancashire County Table Tennis Association (“LCTTA”) and shall comply with their
              rules and regulations.
            </li>
          </ol>
          <p className='my-4'>3a. Only TTE registered Compete and Compete Plus Members may play in the leagues,
            competitions
            and similar events run by the League,
          </p>
          <p className='my-4 font-bold'>Membership</p>
          <p className='my-4'>4. The members of the League (“League Members”) shall be:</p>
          <ol className='list-disc pl-12 my-4'>
            <li>All persons who register to play in the League during the season (which shall commence immediately
              <span className='hljs-keyword'>after</span> <span className='hljs-keyword'>the</span> Annual General Meeting
              (“AGM”) held <span className='hljs-keyword'>in</span> May each <span className='hljs-built_in'>year</span>
              <span className='hljs-keyword'>and</span> <span className='hljs-keyword'>end</span> <span className='hljs-keyword'>with</span>
              <span className='hljs-keyword'>the</span> AGM <span className='hljs-keyword'>the</span> following <span className='hljs-built_in'>year</span>) <span className='hljs-keyword'>and</span> who have paid all fees
              due <span className='hljs-keyword'>for</span> <span className='hljs-keyword'>that</span> Season <span className='hljs-keyword'>as</span> provided
              <span className='hljs-keyword'>by</span> <span className='hljs-keyword'>the</span> Rules <span className='hljs-keyword'>below</span> (“League
              Players”)
            </li>
            <li>Any former player members of the League or other persons who (in either case) are accepted by the
              Committee <span className='hljs-keyword'>as</span> Non-playing Members.
            </li>
          </ol>
          <p className='my-4'>4a. All applications for playing membership of the League shall be made in accordance with
            the Rules
            below only to the Fixtures Secretary, who shall decide upon the application unless overridden by the
            Committee.
          </p>
          <p className='my-4'>4b. All Fees shall be paid prior to the commencement (normally in September) of the Annual
            League
            Programme or immediately upon joining during the Programme in accordance with the Rules below
            and will include: TTE and LTTA registration, individual membership, team fees, and, for those playing out of
            Hyndburn Table Tennis Centre, room and table fees. Fees (other than TTE/ LCTTA registration
            fees) shall be fixed for the forthcoming Season at the AGM or, in default, by the Committee and may
            be varied by the Committee if necessary to meet unanticipated changes or eventualities.
          </p>
          <p className='my-4'>4c. All clubs, teams and individuals joining the League shall be deemed to accept this
            Constitution
            and Rules on admission.
          </p>
          <p className='my-4 font-bold'>The General Committee</p>
          <ol>
            <li className='my-4'>5. The Committee shall consist of the Officers and other Committee Members elected at
              the AGM or
              at an Extraordinary General Meeting (“EGM”) as provided below. Additional or replacement co-opted
              members may be included at the Committee&#39;s discretion.
            </li>
          </ol>
          <p className='my-4'>5a. Officers must be League Members and
            shall consist of a Chairman, Vice Chairman, League Secretary, Treasurer and Fixtures Secretary.
            Other Committee Members shall be those elected or co-opted under 5 to nominated positions (e.g.
            coaching, schools, development, ladies, juniors, club or team representatives, press and/or HTTC
            representative) and must be League Members.
          </p>
          <p className='my-4'>5b. All such Officers and Committee Members shall hold office for two Seasons from the AGM
            at
            which they were elected or, in the event of their being elected at an EGM or co-opted by the
            Committee, then for the remainder of the period of two Seasons running from the last AGM before
            they were so elected or co-opted. They shall be eligible for re-election. If they cease to be League
            Members they shall automatically retire from office.
          </p>
          <p className='my-4'>5c. The powers and duties of the Committee shall include:</p>
          <ul className='list-disc pl-12 my-4'>
            <li>Running and controlling the affairs of the League on behalf of the members.</li>
            <li>Keeping accurate accounts of the finances of the League through the Treasurer and producing
              an Annual Account at the AGM
            </li>
            <li>Deciding issues arising in the course of running the leagues, competitions and events
              organised by the League.
            </li>
            <li>Fining, suspending or expelling any player or club as deemed necessary if found guilty of
              misconduct or breach of this Constitution and Rules.
            </li>
          </ul>
          <p className='my-4'>5d. The Committee shall meet as and when decided at their last meeting or when called by
            the
            Chairman or League Secretary. Notice of such meetings shall be given orally or by email to all
            Committee Members at least 48 hours before the meeting. Should any Committee Member be
            absent, without reasonable excuse, from three meetings in any Season he or she shall be
            automatically retired.
          </p>
          <p className='my-4 font-bold'>Meetings</p>
          <ol>
            <li className='my-4'>6. All meetings of the League and of the Committee shall be chaired by the Chairman or,
              in his
              absence, the Vice Chairman or, in the absence of both, another Committee Member deputed by one
              of them. The decision of the chair of meeting on points of order shall be final. Except for Rule 8
              (Dissolution), all decisions reached will be by majority vote. Where votes are equal, the chair shall
              have a deciding vote. Five people entitled to vote shall form a quorum at all meetings.
            </li>
          </ol>
          <p className='my-4'>6a. AGM: The Annual General Meeting of the League shall be held during May each year on a
            date to
            be decided by the Committee. At least 21 days’ notice of the AGM date shall be given by publication
            on the noticeboard at the League’s central base together with email notice to all Committee Members
            and all Secretaries of clubs and teams participating in the League that season. All current League
            Members (as defined under 4 above) shall be entitled to attend the AGM and will be eligible to vote.
          </p>
          <p className='my-4'>6b. The AGM Agenda shall include the following:</p>
          <ul className='list-disc pl-12 my-4'>
            <li>Minutes of the previous AGM and any subsequent EGM</li>
            <li>Reports of the Officers, including Treasurer’s Report and audited Annual Account c.c.</li>
            <li>Election of Officers and Committee Members when the current holder’s term of office is
              expiring or to fill any vacancies
            </li>
            <li>Appointment of auditors</li>
            <li>Fixing the next Season’s fees and fines unless impracticable at this stage.</li>
            <li>Any amendments to this Constitution and Rules.</li>
            <li>Any matters of which any League Member has given written or email notice to the Secretary at
              least 14 days before the AGM.
            </li>
          </ul>
          <p className='my-4'>6c. EGM: An Extraordinary General Meeting (“EGM”) of the League to resolve any significant
            issues
            may be requested either by a majority vote at a Committee meeting or by at least 15 League
            Members giving written or e-mail notice to the League Secretary specifying the issue(s) in question.
            Upon such request the League Secretary shall call the EGM within 28 days by giving notice of not
            less than 21 days in the same manner as in 6a above for the AGM.
          </p>
          <p className='my-4 font-bold'>Change of Officers, Constitution or Rules</p>
          <ol>
            <li className='my-4'>7. No election of Officers or alteration to this Constitution and Rules may be made
              except at the AGM
              or an EGM called for that purpose. Any Constitution or Rule changes shall be submitted in writing to
              the League Secretary not less than 22 days before the AGM/EGM so as to allow these proposals to
              be considered &amp; circulated prior to the meeting. Either the Proposer or the Seconder must be present
              at the meeting to support their motion.
            </li>
          </ol>
          <p className='my-4 font-bold'>Dissolution</p>
          <ol>
            <li className='my-4'>8. The League may only be dissolved by successful motion at an AGM or EGM. Advance
              Notice of
              the motion must be given in accordance with the notice provisions at 6a/6c above. The motion should
              be presented at this meeting by a Proposer and Seconder both of whom must be present. For this
              motion to be passed, 75% of the League Members present and voting at the meeting must be in
              favour of dissolution.
            </li>
          </ol>
          <p className='my-4'>8a. In the event that the League is dissolved or otherwise wound up, any surplus assets
            (including
            funds) remaining after discharge of liabilities shall automatically be vested in TTE who shall hold them
            for a period of 6 years in trust to pay them to any organisation set up with objectives similar to those
            of the League (TTE during such period making every effort to promote and encourage the formation
            of such an organisation) and thereafter for the general purposes of TTE.
          </p>
          <h2 className='text-xl mb-2 font-semibold text-center underline' id='rules'>RULES</h2>
          <p className='my-4 font-bold'>Annual League</p>
          <ol>
            <li className='my-4'>9. The annual league competition will normally begin in September and will be a
              competition for
              teams arranged in divisions as provided below. The Fixtures Secretary will maintain and publish a
              running record of match points and results, individual points scores and an individual Merit Table.
            </li>
          </ol>
          <p className='my-4'>10. In the event that a situation arises that is not covered by the Rules, or a rule is
            unclear, or in other
            special circumstances accepted by the Committee, the Committee has the authority to make an
            overriding decision which is final. This does not constitute a precedent but may become a rule at the
            next AGM if considered appropriate.
          </p>
          <p className='my-4 font-bold'>Teams, Team Secretaries and Registration</p>
          <ol>
            <li className='my-4'>11. All players wishing to play in the annual league must be registered in a team of at
              least three.
              Each team must have a designated Team Secretary who shall be the contact point and organiser for
              that team but need not play for it. One person may be the Team Secretary for more than one team.
            </li>
            <li className='my-4'>12. All Team Secretaries must provide a telephone number where they can be contacted
              and an
              email address; (email will be the normal way that the Fixtures Secretary sends out and requests
              information to and from Team Secretaries). (IMPORTANT NOTE: however you contact each other,
              say to cancel or postpone games etc, if you use a text or email you must make sure an
              acknowledgment has been given back to you so you know they have received the cancellation
              information. Simply sending a text or email and assuming you have cancelled is not acceptable
              without confirming they have received it.)
            </li>
            <li className='my-4'>13. Any change of Team Secretary, Venue, Match night, address or telephone number shall
              be
              notified immediately to the Fixtures Secretary. In addition the opposition Team Secretaries shall be
              notified as soon as possible
            </li>
            <li className='my-4'>14. Teams from all divisions can have a team of up to eight players registered at any
              one time,
              however teams from within the lowest division may have up to 10 players registered at any one time.
            </li>
            <li className='my-4'>15. Each team shall register sufficient players to enable it to fulfil the entire
              League season and cup
              matches programme.
            </li>
          </ol>
          <p className='my-4'>16. Fees (per season) &amp; entry to the league: All Team Secretaries shall forward to the
            Fixtures
            Secretary their entry form indicating the team name, home night and venue, players to be registered,
            each player’s individual TTE registration number, and simultaneously send the fees due as indicated
            on the entry form to the Treasurer. For teams playing out of the Hyndburn Table Tennis Centre places
            at the centre shall be allocated on a first come first served basis. All teams playing from the Hyndburn
            Table Tennis Centre will be charged the agreed rate as fixed under 4b above and stated on the entry
            form for the season to cover table fees. The Team Secretary shall be responsible for all charges
            applicable to his/her team. Fees shall be paid by cheque, payable to “East Lancashire Table Tennis
            League”. Where cash is paid, a signed receipt must be obtained.
          </p>
          <p className='my-4'>17. Each division is based normally on having ten teams, each team will play home and
            away. At the
            end of the season the top two teams in each division will be promoted. The bottom two in each
            division will likely be relegated depending on the number of teams dropping out or new teams coming
            in. If a division has only nine teams then only one would be relegated but two promoted. The
            Committee may promote more than two teams in some circumstances and has discretion to decide
            where any newly formed teams should be placed as well as putting more than 10 teams in a division if
            it deems it necessary. The Committee also has the right (as per rule 18 ) to ‘promote’ any team whose
            make up of players through changes or additions to previous seasons, in the Committee’s opinion has
            changed their standard sufficiently to be too good for their original division. (NOTE: It will not be
            normal practice to demote teams who due to team personnel changes have become weaker, unless
            they had been automatically demoted, or at the start of a season were requesting to drop a division
            which would be subject to the discretion of the Committee).
          </p>
          <ol>
            <li className='my-4'>18. All players must be registered with both TTE and the League and have paid their
              membership
              fees before taking part in any match. Any player requesting to be registered with the League after the
              original entry form has been submitted and after the teams have been set in their divisions will be
              subject to approval by the Committee to ensure such a player does not unfairly change the nature of
              the competition. Only in exceptional circumstances will any new registrations be permitted after
              January 1st; once again the full approval of the Committee is required. The Committee may refuse a
              registration or impose limitations if for any reason they think a registration of a player will affect the
              spirit of fair competition. If any additional information is found subsequent to this registration the
              Committee have a right to impose, at a later date, any conditions that were not imposed at the time of
              registration where it is felt a distortion of fair competition has arisen mid-season. (NOTE: At the entry
              form stage teams can register any player they choose but the Committee retain the right to judge
              what standard and division any particular team should then be placed).
            </li>
            <li className='my-4'>19. During the season any transfers to another team are to be made in writing to the
              League
              Secretary for consideration by the Committee. If approval is given, the player can play for his/her new
              team four days later, providing that the transfer takes place before January 1st and no previous
              transfer by that player has taken place during that season. No transfers at all may take place after Jan
              1st, apart from when a player plays a 6th game as reserve for another team and thus becomes automatically
              transferred to the other team as in rule 20 below.
            </li>
          </ol>
          <p className='my-4'>19a. Any player having a handicap of 6 or less must play at least 25% of the remaining
            league
            matches otherwise any points won will be discounted. Playing in a doubles game does not qualify as
            a match.
          </p>
          <ol>
            <li className='my-4'>20. Any team can nominate reserves providing they are from a lower division or the same
              division and
              have a lower ranking number than the second highest ranked permanent registered squad player as
              known from the latest merit tables published on the league web at the date of the games a reserve is
              required (“the ranking provision”- if in doubt ring to check eligibility of reserve with the Fixtures
              Secretary
              before playing). A reserve can play for more than one team per division but if he/she plays for the same
              team <span className='font-bold'>more than 5 times</span> will automatically be transferred permanently to
              that team and can no longer
              play from that point on for any other team except in a higher division than the team he/she has joined.
              (Exception for Juniors – see Rule 20a below). Reserves under this rule do not have to be registered to
              the same club and can come from any team as long as they comply with rest of the conditions above.
            </li>
          </ol>
          <p className='my-4'>20a. Provided that the above ranking provision is complied with, Junior players can play
            up for any team
            in any division any number of times.
          </p>
          <p className='my-4'>20b. A team consisting wholly of Junior players may play all their fixtures at their home
            venue. In the
            event that both teams are all Juniors the normal home and away system will apply.
          </p>
          <p className='my-4'>20c. Adjustment to 20b above</p>
          <ul className='list-disc pl-12 my-4'>
            <li className='mt-2'>For the purposes of Rule 20b ELTTL will define Juniors as players under the age of 16
              on 1st September of the year that the season begins.
            </li>
            <li className='mt-2'>If a team is due to play a home match against an all Junior team and is fielding a
              team of at least two juniors of their own, that match will take place at their home
              venue.
            </li>
            <li className='mt-2'>
              Teams where this might apply must contact the appropriate team secretary listed in
              the Fixtures List for the Junior team concerned to inform them that at least two
              juniors will be playing and as such the match will be played at their home venue. This
              communication should take place a week prior to the fixture being played and
              should be arranged via a telephone call between both Secretaries and subsequently
              be confirmed by text/email.
            </li>
          </ul>
          <p className='my-4'>21. If a team resigns from the League, all points will be removed and all monies
            forfeited.
          </p>
          <ol>
            <li className='my-4'>22. To be included in the final Merit Table a player must play a minimum of 50% +1 of
              possible league
              matches during the season.
            </li>
          </ol>
          <p className='my-4 font-bold'>Matches and Points</p>
          <ol>
            <li className='my-4'>23. The current rules of table tennis as adopted by TTE and LCTTA shall apply to all
              matches in the
              League
            </li>
            <li className='my-4'>24. All matches shall ideally be played on the dates stated on the fixture list. If
              either team is unable to
              field a full team, they may request of the other team that the match is played on an alternative date. If
              an agreement to re-arrange cannot be reached between the teams, then it can be referred to the
              Committee to arbitrate. The Committee, at their discretion, may order the match re-scheduled, or may
              award points to either side depending on the common sense fairness of either the request to re-arrange,
              or the refusal to do so. (Note 24a below - no penalty if at least two weeks notice was given)
              When awarding points in accordance with this rule; the points for, should be based on an average
              over the season; the points against, should be nil.
            </li>
          </ol>
          <p className='my-4'>24a. A match can be postponed without penalty if more than 2 weeks notice is given to the
            other
            team. The opposition Team Secretary must agree to re-arrange the match.
          </p>
          <p className='my-4'>24b. A match can be postponed without penalty if a team cannot field three players due to
            a town
            team commitment. The opposition Team Secretary must agree to re-arrange the match.
          </p>
          <p className='my-4'>24c. No re-arrangements may be made or requested on the same days as the original fixture
            date,
            save in exceptional circumstances such as inclement weather.
          </p>
          <ol>
            <li className='my-4'>25. Any points won by an unregistered (See Notes on Affiliation and Membership)
              player(s) will not be
              counted nor awarded retrospectively. The opposition will be awarded the points as if that player(s)
              had not been present.
            </li>
            <li className='my-4'>26. The start time for matches shall be no later than 7.00pm at HTTC and at St Peters
              Burnley, 7.30pm at
              other venues. One player per team must be in attendance at the start time, the second by 45 minutes
              after and the third by 75 minutes after the start time. The order in which sets are played may be flexed
              accordingly and teams should cooperate reasonably to accommodate this, subject to which the opposing
              side can claim the points of those sets which could have been played if the opponent had been present in
              time. Any disputes regarding points to be claimed through this rule will be subject to the Committee who
              will have the final say on the matter.
            </li>
            <li className='my-4'>27. The Home team shall enter the playing order of its players on the scorecard first,
              then the away
              team. The game should then usually be played in the order of the card with discretion to leave
              doubles till the end unless by mutual agreement games are played out of order due to a player being
              delayed or someone needs to go early etc but this should not be abused. Either the player name or
              the player position, e.g. first, second, third in the team on the night, must be recorded on the
              scorecard for the doubles game.
            </li>
            <li className='my-4'>28. The match ball must be approved by both teams prior to the commencement of the
              match. In the
              event that an agreement cannot be reached a new ball must be used.
            </li>
            <li className='my-4'>29. The Home team’s Team Secretary has the sole responsibility to notify the Fixtures
              Secretary of
              the result of the match. Team Secretaries should always endeavour to ensure the scorecard is
              returned to the box in the Hyndburn Table Tennis Centre or posted to the Fixtures Secretary or a
              scanned copy emailed to the Fixtures Secretary no later than a week after the match was played.
              Very late and persistently late offenders may have penalty points deducted at the discretion of the
              Committee.
            </li>
            <li className='my-4'>30. In the event of two or more teams having the same number of points at the end of
              the season,
              their positions shall be re calculated and re adjusted by awarding two points for each match won and
              by awarding one point for every match ending in a draw. If still the same it will be decided by head to
              head statistics over the two games versus each other in the season.
            </li>
          </ol>
          <p className='my-4 font-bold'>Cup and Other Competitions</p>
          <ol>
            <li className='my-4'>31. Players from anywhere in the League can be signed on for a team in a cup match, but
              they can
              only play for one team in a season
            </li>
          </ol>
          <ol>
            <li className='my-4'>32. No player shall be eligible to take part in the ELTTL Closed Competition (the Big
              Day) unless they
              have played in at least three league or cup matches in the current season. For the Divisional Individual
              Handicap Competitions and the Vets Competitions this is reduced to at least two matches in the current
              season. No player shall be eligible to play in the semi-final stage of any team handicap competition
              unless they have already played in at least three league or cup matches in the current season. (Note:
              played in league or cup matches refers to the player playing in the singles, not just the doubles match)
            </li>
          </ol>
          <p className='my-4 font-bold'>Fred Holden Handicap Competition</p>
          <p className='my-4'>33. The Fred Holden Competition will be organised during the season. This will be
            organised on a
            team handicap basis. All teams will participate.
          </p>
          <p className='my-4'>33a. Fred Holden Cup matches have priority over the League matches and are counted as due
            to be
            played in the weeks set aside in the programme on the regular home night of the home team at the
            home team’s venue, or in the case of the semi-final and final stages in the same week as scheduled
            in the programme on a night to be agreed to be played at a neutral venue or at a venue agreed by the
            two teams involved.
          </p>
          <p className='my-4 font-bold'>Other competitions</p>
          <ol>
            <li className='my-4'>34. In a group or round robin competition, all members of the group shall compete
              against each other
              and shall gain two match points for a win, 1 point for a loss in a played match and 0 points for a loss
              in an unplayed or unfinished match. The ranking order shall be determined primarily by the number of
              match points gained. If two or more members of the same group have gained the same number of
              match points their relative positions shall be determined only by the results of the matches between
              them, by considering successively the number of match points, the ratio of wins to losses first in
              individual matches (for a team event), games and points, as far as is necessary to resolve the order. If
              at any step in the calculations the positions of one or more members of the group have been
              determined while the others are still equal, the results of the matches in which those members took
              part shall be excluded from any further calculations needed to resolve the equalities in accordance
              with the procedures above. If it is not possible to resolve the relative positions they shall be
              determined by lot. This does not apply to Fred Holden Cup matches
            </li>
          </ol>
        </div>
      </div>
    </>
  )
}