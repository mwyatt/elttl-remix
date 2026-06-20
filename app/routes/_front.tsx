import { sql } from "drizzle-orm";
import type { Route } from "./+types/_front";
import React from 'react'
import { BiLogoFacebook } from 'react-icons/bi'
import Header from '@/components/Header'
import Address from '@/components/Address'
import { PiXLogoFill } from 'react-icons/pi'
import CookieBanner from '@/components/CookieBanner'
// import { CookieBannerConsentChoiceKey } from '@/constants/Cookies'
import {getCurrentYear} from "@/repositories/year.repository.server";
import {getDbFromContext} from "@/db-context.server";
import {Link, Outlet} from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db);

    // @todo cookies
  // const cookieStore = await cookies()
  // const isCookieBannerDismissed = cookieStore.get(CookieBannerConsentChoiceKey)?.value.length > 0


    const divisions = await db.all<{ name: string }>(sql`  SELECT name
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}`);

  const divisionsChildren = []

  divisions.forEach((division) => {
    divisionsChildren.push({
      name: `${division.name} Division Overview`,
      url: `/result/${currentYear.name}/${division.name.toLowerCase()}`,
      children: [
        { name: 'League Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/league` },
        { name: 'Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit` },
        { name: 'Doubles Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/doubles-merit` }
      ]
    })
  })

  const advertisementsSecondary = [
    {
      title: 'Get the Handbook',
      description: 'Download this seasons handbook.',
      action: 'Download',
      url: '/handbook-2025-2026.pdf'
    },
    {
      title: 'Fixtures Generated 2025',
      description: 'The fixtures have been generated for the 2025 season, take a look!',
      action: 'Season Overview',
      url: `/result/${currentYear.name}/season`
    },
    {
      title: 'Results Archive',
      description: 'Your stats, never forgotten! See the previous seasons scores.',
      action: 'View',
      url: '/result/'
    }
  ]

  const commonLinks = {
    prePractice: { name: 'Prepaid Practice Scheme', url: '/prepaid-practice-scheme' },
    competitions: { name: 'Competitions', url: '/competitions' },
    resultArchive: { name: 'Results Archive', url: '/result' },
    contactUs: { name: 'Contact Us', url: '/contact-us' },
    townTeams: { name: 'Town Teams', url: '/page/town-teams' },
    lancsCountyTTAssoc: {
      name: 'Lancashire County TT Assoc',
      url: 'https://lancashirecounty.ttleagues.com/page/affiliationtolancashirecountytta',
      target: '_blank'
    },

    // @todo get assets - sftp could be easiest method to store initially
    // would be ideal to allow updating of these for logged in users
    gdpr: { name: 'GDPR', url: '/gdpr' },
    diciplineProcedure: { name: 'Code of Conduct', url: '/code-of-conduct' },
    safeguardingPolicy: { name: 'Safeguarding Policy', url: '/safeguarding-guidance-2020.pdf', target: '_blank' }
  }

  return {
    currentYearName: currentYear.name,
    footLinks: [
      { area: 1, name: 'About Us', url: '/about-us' },
      { area: 1, name: 'Committee Members', url: '/committee-members' },
      { area: 1, name: 'Coaching & Sessions', url: '/sessions' },
      { area: 1, ...commonLinks.prePractice },
      { area: 1, ...commonLinks.competitions },
      { area: 1, name: 'Schools', url: '/schools' },
      { area: 1, name: 'Constitution & Rules', url: '/constitution-and-rules' },
      { area: 2, ...commonLinks.lancsCountyTTAssoc },
      { area: 2, ...commonLinks.gdpr },
      { area: 2, ...commonLinks.diciplineProcedure },
      { area: 2, ...commonLinks.safeguardingPolicy },
      { area: 2, name: 'Handicap Calculator', url: '/handicap-calculator' },
      { area: 2, ...commonLinks.contactUs }
    ],
    menuPrimary: [
      {
        name: 'The League',
        url: '/',
        children: [
          { name: 'About Us', url: '/about-us' },
          { name: 'Download Handbook', url: '/handbook-2025-2026.pdf', target: '_blank' },
          { name: 'Press Releases', url: '/press' },
          commonLinks.competitions,
          { name: 'Contact us', url: '/contact-us' }
        ]
      },
      {
        name: 'Results', url: '/result', children: divisionsChildren
      }
    ],
    advertisementsSecondary
  }
}

export default function FrontLayoutRoute({ loaderData }: Route.ComponentProps) {
  const appName = 'East Lancashire Table Tennis League'
  const {
    currentYearName,
    menuPrimary,
    footLinks,
    advertisementsSecondary
  } = loaderData

  const isCookieBannerDismissed = false
  const visitingYearName = ''

  // @todo this is passed through via the url params (get the year portion if it exists)
  const isVisitingArchive = visitingYearName !== undefined && (currentYearName !== visitingYearName)

    // @todo these were set based on page before
    const paddedContent = true
    const maxWidth = true

  return (
    <div>
      <Header appName={appName} menuPrimary={menuPrimary} />

      {isVisitingArchive && (
        <div className='bg-amber-400 text-amber-900 text-center p-4'>
          You are viewing an archived season ({visitingYearName}). For the latest information, please visit the{' '}
          <Link className='underline font-bold' to={`/result/${currentYearName}/season`}>
            current season ({currentYearName})
          </Link>.
        </div>
      )}

      <div className={`${paddedContent ? 'p-4 sm:p-8' : ''} ${maxWidth ? 'max-w-[1440px] mx-auto' : ''} bg-white/80`}>
        <Outlet />
      </div>

      <div className='ml-4 mr-4 mb-8 mt-16'>
        <div className='max-w-[1440px] mx-auto flex flex-col md:flex-row gap-4 lg:pl-4 lg:pr-4'>
          {advertisementsSecondary.map((advertisement, index) => (
            <div key={index} className='p-4 bg-stone-300 text-secondary-700 bg-[url(/table-lip.png)] bg-right-bottom bg-no-repeat flex-basis-1/3 md:basis-1/3 rounded'>
              <h2 className='mb-4 text-2xl font-bold'>{advertisement.title}</h2>
              <p className='my-3 text-lg'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                {advertisement.action && (
                  <Link
                    className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize'
                    to={advertisement.url}
                  >{advertisement.action}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className='bg-tertiary-500'>
        <div className='md:flex max-w-[1440px] mx-auto'>
          <div className='basis-1/4 p-4 text-white'>
            <div className='mb-1'><Link to='/contact-us' className='underline font-bold'>&copy; {appName}</Link></div>
            <Address />
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 1).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  to={item.url}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 2).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  to={item.url}
                  target={item.target || '_self'}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 mt-4'>
            <Link to='https://x.com/eastlancstt' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <PiXLogoFill size={30} />
            </Link>
            <Link to='https://www.facebook.com/pages/East-Lancashire-Table-Tennis-League/118206128284149' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <BiLogoFacebook size={30} />
            </Link>
            <Link to='http://tabletennisengland.co.uk/' target='_blank' className='inline-block m-2 w-32 h-auto' rel='noreferrer'>
              <img
                className='block w-20 md:w-32 h-auto' src='https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg' alt='Table Tennnis England logo'
                width={0} height={0}
              />
            </Link>
          </div>
        </div>
      </footer>

      <CookieBanner isCookieBannerDismissed={isCookieBannerDismissed} />
    </div>
  )
}
