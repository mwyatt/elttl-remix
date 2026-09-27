import { sql } from "drizzle-orm";
import type { Route } from "./+types/_front";
import React from "react";
import {
  BiBall,
  BiBook,
  BiBookOpen,
  BiCalendar,
  BiLogoFacebook,
  BiSolidInfoCircle,
} from "react-icons/bi";
import Address from "~/components/Address";
import { PiXLogoFill } from "react-icons/pi";
import { getCurrentYear } from "~/repositories/year.repository.server";
import { getDbFromContext } from "~/db-context.server";
import { Link, Outlet } from "react-router";
import Header from "~/components/Header";
import { getSeasonName } from "~/libraries/year";
import LinkButton from "~/components/LinkButton";

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db);
  const { year } = params;
  const isVisitingArchive = year !== undefined && currentYear.name !== year;
  const visitingYearName = year !== undefined ? year : currentYear.name;

  const divisions = await db.all<{ name: string }>(sql`  SELECT name
                                                         FROM tennisDivision
                                                         WHERE yearId = ${currentYear.id}`);

  const divisionsChildren = [];

  divisions.forEach((division) => {
    divisionsChildren.push({
      name: `${division.name} Division Overview`,
      url: `/result/${currentYear.name}/${division.name.toLowerCase()}`,
      children: [
        {
          name: "League Table",
          url: `/result/${currentYear.name}/${division.name.toLowerCase()}/league`,
        },
        {
          name: "Merit Table",
          url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit`,
        },
        {
          name: "Doubles Merit Table",
          url: `/result/${currentYear.name}/${division.name.toLowerCase()}/doubles-merit`,
        },
      ],
    });
  });

  const commonLinks = {
    prePractice: {
      name: "Prepaid Practice Scheme",
      url: "/prepaid-practice-scheme",
    },
    competitions: { name: "Competitions", url: "/competitions" },
    resultArchive: { name: "Results Archive", url: "/result-archive" },
    contactUs: { name: "Contact Us", url: "/contact-us" },
    townTeams: { name: "Town Teams", url: "/page/town-teams" },
    lancsCountyTTAssoc: {
      name: "Lancashire County TT Assoc",
      url: "https://lancashirecounty.ttleagues.com/page/affiliationtolancashirecountytta",
      target: "_blank",
    },
    gdpr: { name: "GDPR", url: "/gdpr" },
    diciplineProcedure: { name: "Code of Conduct", url: "/code-of-conduct" },
    safeguardingPolicy: {
      name: "Safeguarding Policy",
      url: "/safeguarding-guidance-2020.pdf",
      target: "_blank",
    },
  };

  return {
    currentYearName: currentYear.name,
    footLinks: [
      { area: 1, name: "About Us", url: "/about-us" },
      { area: 1, name: "Committee Members", url: "/committee-members" },
      { area: 1, name: "Coaching & Sessions", url: "/sessions" },
      { area: 1, ...commonLinks.prePractice },
      { area: 1, ...commonLinks.competitions },
      { area: 1, name: "Schools", url: "/schools" },
      { area: 1, name: "Constitution & Rules", url: "/constitution-and-rules" },
      { area: 2, ...commonLinks.lancsCountyTTAssoc },
      { area: 2, ...commonLinks.gdpr },
      { area: 2, ...commonLinks.diciplineProcedure },
      { area: 2, ...commonLinks.safeguardingPolicy },
      { area: 2, name: "Handicap Calculator", url: "/handicap-calculator" },
      { area: 2, name: "Results Archive", url: "/result-archive" },
      { area: 2, ...commonLinks.contactUs },
    ],
    menuPrimary: [
      {
        name: "The League",
        url: "/",
        children: [
          { name: "About Us", url: "/about-us" },
          {
            name: "Download Handbook",
            url: "/handbook-2026-2027.pdf",
            target: "_blank",
          },
          { name: "News Updates", url: "/press" },
          commonLinks.competitions,
          { name: "Contact us", url: "/contact-us" },
        ],
      },
      {
        name: "Results",
        url: "/result",
        children: divisionsChildren,
      },
    ],
    isVisitingArchive,
    visitingYearName,
  };
}

export default function FrontLayoutRoute({
  loaderData,
}: Route.ComponentProps<typeof loader>) {
  const appName = "East Lancashire Table Tennis League";
  const {
    currentYearName,
    visitingYearName,
    menuPrimary,
    footLinks,
    isVisitingArchive,
  } = loaderData;

  return (
    <div>
      <Header appName={appName} menuPrimary={menuPrimary} />

      {isVisitingArchive && (
        <div className="bg-amber-400 text-amber-900 text-center p-2 text-sm">
          You are viewing an archived season ({visitingYearName}). For the
          latest information, please visit the{" "}
          <Link
            className="underline font-bold"
            to={`/result/${currentYearName}/season`}
          >
            current season ({currentYearName})
          </Link>
          .
        </div>
      )}

      <div className={`max-w-[1440px] mx-auto`}>
        <Outlet />
      </div>

      <div className="mb-8 mt-16">
        <BannersSecondary currentYearName={currentYearName} />
      </div>

      <footer className="bg-tertiary-500">
        <div className="md:flex max-w-[1440px] mx-auto">
          <div className="basis-1/4 p-4 text-white">
            <div className="mb-1">
              <Link to="/contact-us" className="underline font-bold">
                &copy; {appName}
              </Link>
            </div>
            <Address />
          </div>
          <div className="basis-1/4 p-4">
            <nav className="bg-secondary-500 rounded">
              {footLinks
                .filter((item) => item.area === 1)
                .map((item) => (
                  <Link
                    className="block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white"
                    key={item.name}
                    to={item.url}
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="basis-1/4 p-4">
            <nav className="bg-secondary-500 rounded">
              {footLinks
                .filter((item) => item.area === 2)
                .map((item) => (
                  <Link
                    className="block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white"
                    key={item.name}
                    to={item.url}
                    target={item.target || "_self"}
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="basis-1/4 mt-4">
            <Link
              to="https://x.com/eastlancstt"
              target="_blank"
              className="p-2 bg-stone-100 rounded-full m-2 inline-block"
              rel="noreferrer"
            >
              <PiXLogoFill size={30} />
            </Link>
            <Link
              to="https://www.facebook.com/pages/East-Lancashire-Table-Tennis-League/118206128284149"
              target="_blank"
              className="p-2 bg-stone-100 rounded-full m-2 inline-block"
              rel="noreferrer"
            >
              <BiLogoFacebook size={30} />
            </Link>
            <Link
              to="http://tabletennisengland.co.uk/"
              target="_blank"
              className="inline-block m-2 w-32 h-auto"
              rel="noreferrer"
            >
              <img
                className="block w-20 md:w-32 h-auto"
                src="https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg"
                alt="Table Tennnis England logo"
                width={0}
                height={0}
              />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BannersSecondary({ currentYearName }: { currentYearName: string }) {
  const advertisements = [
    {
      title: "Get the Handbook",
      description: "Download this seasons handbook",
      action: "Download",
      target: "_blank",
      url: "/handbook-2026-2027.pdf",
      icon: <BiBookOpen />,
    },
    {
      title: `Season ${getSeasonName(currentYearName)}`,
      description: `The new ${getSeasonName(currentYearName)} season has begun`,
      action: "Season Overview",
      url: `/result/${currentYearName}/season`,
      icon: <BiCalendar />,
    },
    {
      title: "Service Rules",
      description:
        "Get familiar with the table tennis service rules we must all follow for fair play",
      action: "View Rules",
      url: "/service-rules",
      icon: <BiSolidInfoCircle />,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-4 lg:pl-4 lg:pr-4 px-4 sm:px-6">
      {advertisements.map((advertisement, index) => (
        <div
          key={index}
          className="flex flex-col p-4 bg-primary-100 text-secondary-700 flex-basis-1/3 md:basis-1/3 rounded relative"
        >
          <div className={"text-6xl absolute top-3 right-3 text-white"}>
            {advertisement.icon}
          </div>
          <h2 className="text-2xl font-bold mr-18">{advertisement.title}</h2>
          <p className="mt-2 text-lg grow mr-18">{advertisement.description}</p>
          <div className="mt-2 flex justify-end">
            {advertisement.action && (
              <LinkButton
                to={advertisement.url}
                target={advertisement.target || "_self"}
              >
                {advertisement.action}
              </LinkButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
