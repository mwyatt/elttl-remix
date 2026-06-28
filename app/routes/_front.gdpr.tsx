import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import MainHeading from "~/components/MainHeading";
import {QuickLink} from "~/routes/_front.about-us";
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
  return { currentYearName: currentYear.name };
}

export default function _frontGdpr({ loaderData }: Route.ComponentProps) {
    const {
    currentYearName
  } = loaderData;

  const nextYearName = parseInt(currentYearName) + 1
  const handbookLink = <QuickLink href={`/handbook-${currentYearName}-${nextYearName}.pdf`} name='Handbook' external />

  return (
    <>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='General Data Protection Rights Policy' />

        <p className='my-4'>This outlines the privacy rights of every EU citizen and the ways in which an individual’s
          ‘Personal Data’ can and can’t be used.
        </p>

        <p className='my-4'>Personal data is information about an individual such as name, address, phone number,
          email addresses, D.O.B etc. Other categories of personal data may also apply.
        </p>

        <SubHeading name='General Principles of GDPR ' />

        <ol className='list-decimal pl-12'>
          <li>
            <p className='my-4'>GDPR sets out rules about how personal Information (data) can be obtained, how it can
              be used and how it is stored.
            </p>
          </li>
          <li>
            <p className='my-4'>Should a member consent to the holding of his or her data, this must be communicated
              to them at the time the data is obtained.
            </p>
          </li>
          <li>
            <p className='my-4'>Clubs and leagues must explain to members the legal basis for the use of the data. If
              relying on the member’s consent to use data, it should be easy for an individual to
              withdraw their consent. The chance to review their consent should be given on a regular
              basis (e.g. yearly).
            </p>
          </li>
          <li>
            <p className='my-4'>Data must be kept safe and secure and must be kept accurate and up to date. </p>
          </li>
          <li>
            <p className='my-4'>An individual can request a copy of all of the personal information held about them
              (this
              is called a Subject Access Request) and must be allowed to have all of their data deleted
              or returned to them, if they so wish, within a month.
            </p>
          </li>
          <li>
            <p className='my-4'>Each club or league should consider the appointment of a Data Protection Officer (DPO)
              or identify someone to manage the requirements of the role. The DPO will advise on the
              GDPR, monitor compliance and represent the club on engagement with the Data
              Protection Commissioner.
            </p>
          </li>
        </ol>

        <SubHeading name='East Lancashire Table Tennis League Data Privacy Policy  ' />

        <ol className='list-decimal pl-12'>
          <li>
            <p className='my-4 font-bold'>About this Policy
            </p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>This policy explains when and why we (East Lancashire Table Tennis
                  League) collect personal information about our members and instructors,
                  how we use it and how we keep it secure and your rights in relation to it.
                </p>
              </li>
              <li>
                <p className='my-4'>We may collect, use and store your personal data, as described in this Data
                  Privacy Policy and as described when we collect data from you.
                </p>
              </li>
              <li>
                <p className='my-4'>We reserve the right to amend this Data Privacy Policy from time to time
                  without prior notice. We may be required to amend this Data Privacy Policy
                  due to regulations. For any significant changes you will be notified but you
                  are advised to check <QuickLink href='https://tabletennis365.com/lancashire' external /> for the latest
                  Privacy Policy.
                </p>
              </li>
              <li>
                <p className='my-4'>We will always comply with the General Data Protection Regulation (GDPR)
                  when dealing with your personal data. Further details on the GDPR can be
                  found at the website for the Information Commissioner (<QuickLink href='https://ico.org.uk/concerns/' name='www.ico.gov.uk' external />).
                  For the purposes of the GDPR, we will be the “controller” of all personal
                  data we hold about you.
                </p>
              </li>
            </ol>

          </li>

          <li>
            <p className='my-4 font-bold'>Who are we?
            </p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>We are the East Lancashire Table Tennis League. We can be contacted via our Hon.
                  Secretary (see {handbookLink})
                </p>
              </li>
            </ol>

          </li>

          <li>
            <p className='my-4 font-bold'>What information we collect and why
            </p>
            <table className='table-auto w-full mb-6'>
              <tbody>
                <tr className='border-b'>
                  <td className='p-2'>
                    Member’s/ Secretary’s
                    name, address, post code,
                    email address TTiD, etc
                  </td>
                  <td className='p-2'>
                    Managing the Member’s
                    membership of the
                    League and National
                    Governing Body
                  </td>
                  <td className='p-2'>Performing the League’s
                    contract with the Member. For
                    the purposes of our legitimate
                    interests in the confines of the
                    East Lancashire area.
                    Verifying membership of TTE
                    via TT365
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Date of birth / age related
                    information
                  </td>
                  <td className='p-2'>Managing membership
                    categories which are
                    age related
                  </td>
                  <td className='p-2'>see above
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Gender
                  </td>
                  <td className='p-2'>Reporting Information to
                    Table Tennis England
                  </td>
                  <td className='p-2'>For the purposes of the
                    legitimate interests of Table
                    Tennis England to maintain
                    diversity data required by
                    funders
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Member’s name, TTID
                  </td>
                  <td className='p-2'>Managing competition
                    and event entries and
                    results
                    Publishing
                    results and ranking
                  </td>
                  <td className='p-2'>For the purposes of our
                    legitimate interests in holding
                    competitions and events for
                    the benefit of members. For
                    the purposes of our legitimate
                    interests in promoting the
                    County/Leagues/Clubs
                    For the legitimate interest to
                    providing relevant tournament
                    and player information to Table
                    Tennis England and providing
                    communications to players
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Photos and videos of
                    members
                  </td>
                  <td className='p-2'>Putting on the website
                    and social media pages
                    and using in press
                    releases
                  </td>
                  <td className='p-2'>Consent. We will seek the
                    consent on their leagues/clubs
                    membership application form
                    and each membership
                    renewal form.
                    The member may withdraw
                    their consent at any time by
                    contacting us by e-mail or
                    letter
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Member’s name and
                    e-mail address
                  </td>
                  <td className='p-2'>Creating and managing
                    the online key members
                    directory
                  </td>
                  <td className='p-2'>Consent. We will seek the
                    consent on their membership
                    application form and each
                    membership renewal form.
                    The member may withdraw
                    their consent at any time by
                    contacting us by e-mail or
                    letter
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Coach’s name address,
                    email addresses, phone
                    numbers and relevant
                    qualifications and/or
                    experience
                  </td>
                  <td className='p-2'>Managing the coaching
                    at the Clubs/Leagues
                  </td>
                  <td className='p-2'>For the purposes of our
                    legitimate interests in
                    ensuring that we can contact
                    those offering instruction and
                    provide details of coaches to
                    members
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2'>Associate Members and
                    former members: their
                    names and addresses
                  </td>
                  <td className='p-2'>To inform them of activities
                    events etc relevant to the
                    sport of Table Tennis
                  </td>
                  <td className='p-2'>For the purposes of our
                    legitimate interests in
                    operating the League
                  </td>
                </tr>
              </tbody>
            </table>
          </li>

          <li>
            <p className='my-4 font-bold'>How we protect your personal data
            </p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>We will not transfer your personal data outside the EU without your consent. </p>
              </li>
              <li><p className='my-4'>We will not transfer your personal data outside the EU without your consent. </p>
              </li>
              <li>
                <p className='my-4'>Please note however that where you are transmitting information to us over
                  the internet this can never be guaranteed to be 100% secure.
                </p>
              </li>
              <li>
                <p className='my-4'>We will notify you promptly in the event of any breach of your personal data
                  which might expose you to serious risk.
                </p>
              </li>
            </ol>

          </li>

          <li>
            <p className='my-4 font-bold'>Who else has access to the information you provide us?</p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>We will never sell your personal data. We will not share your personal data
                  with any third parties without your prior consent (which you are free to
                  withhold) except where required to do so by law or as set out in the table
                  above or paragraph 5.2 below.
                </p>
              </li>
              <li>
                <p className='my-4'>We may pass your personal data to third parties who are service providers,
                  agents and subcontractors to us for the purposes of completing tasks and
                  providing services to you on our behalf (e.g. to print newsletters and send
                  you mailings).
                </p>
              </li>
              <li>
                <p className='my-4'>However, we disclose only the personal data that is necessary for the third
                  party to deliver the service and we have a contract in place that requires
                  them to keep your information secure and not to use it for their own
                  purposes.
                </p>
              </li>
            </ol>

          </li>
          <li>
            <p className='my-4 font-bold'>How long do we keep your information?
            </p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>We will hold your personal data on our systems for as long as you are a
                  member of the League and for as long afterwards as it is in the League’s
                  legitimate interest to do so or for as long as is necessary to comply with our
                  legal obligations. We will review your personal data every year to establish
                  whether we are still entitled to process it. If we decide that we are not
                  entitled to do so, we will stop processing your personal data except that we
                  will retain your personal data in an archived form in order to be able to
                  comply with future legal obligations.
                </p>
              </li>
              <li>
                <p className='my-4'> We securely destroy all financial information once we have used it and no
                  longer need it.
                </p>
              </li>
            </ol>

          </li>
          <li>
            <p className='my-4 font-bold'>Your rights
            </p>
            <ol className='list-decimal pl-12'>
              <li>
                <p className='my-4'>You have rights under the GDPR:</p>
                <p className='my-4'>(a) to access your personal data</p>
                <p className='my-4'>(b) to be provided with information about how your personal data is processed</p>
                <p className='my-4'>(c) to have your personal data corrected</p>
                <p className='my-4'>(d) to have your personal data erased in certain circumstances</p>
                <p className='my-4'>(e) to object to or restrict how your personal data is processed</p>
                <p className='my-4'>(f) to have your personal data transferred to yourself or to another business in
                  certain circumstances.
                </p>
              </li>
              <li>
                <p className='my-4'>You have the right to take any complaints about how we process your
                  personal data to the Information Commissioner:
                </p>
                <p className='my-4 text-center'>

                  <QuickLink href='https://ico.org.uk/concerns/' external /><br />
                  0303 123 1113.<br />
                  Information Commissioner&apos;s Office<br />
                  Wycliffe House<br />
                  Water Lane<br />
                  Wilmslow<br />
                  Cheshire SK9 5AF

                </p>
              </li>
            </ol>

          </li>
        </ol>
        <p className='my-4'>
          For more details, please address any questions, comments and requests regarding our
          data processing practices to our Hon. Secretary (see {handbookLink}).
        </p>
      </div>
    </>
  )
}