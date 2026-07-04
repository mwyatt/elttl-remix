import {getDbFromContext} from "~/db-context.server";
import {getAllYears} from "~/repositories/year.repository.server";
import {getAllDivisionsByYear} from "~/repositories/division.repository.server";
import {getAllTeamsByYear} from "~/repositories/team.repository.server";
import {playerGetAll} from "~/repositories/player.repository.server";
import {getAllVenuesByYear} from "~/repositories/venue.repository.server";
import {getAllPress} from "~/repositories/content.repository.server";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);

  const years = await getAllYears(db);

  let urls: string[] = [];

  for (const year of years) {
    urls.push(`/result/${year.name}`);

    const divisions = await getAllDivisionsByYear(db, year.id);
    const teams = await getAllTeamsByYear(db, year.id);
    const players = await playerGetAll(db, year.id);
    const venues = await getAllVenuesByYear(db, year.id);
    const weeks = await getAllWeeksByYear(db, year.id);

    divisions.forEach(div =>
      urls.push(`/result/${year.name}/${div.slug}`)
    );

    teams.forEach(team =>
      urls.push(`/result/${year.name}/team/${team.slug}`)
    );

    players.forEach(player =>
      urls.push(`/result/${year.name}/player/${player.slug}`)
    );

    venues.forEach(venue =>
      urls.push(`/result/${year.name}/venue/${venue.slug}`)
    );

    weeks.forEach(week =>
      urls.push(`/result/${year.name}/week/${week.id}`)
    );
  }

  const press = await getAllPress(db);
  press.forEach(article => urls.push(`/press/${article.slug}`));

  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (url) => `
        <url>
          <loc>https://www.example.com${url}</loc>
        </url>
      `
        )
        .join("")}
    </urlset>
  `.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export default function Sitemap() {
  return null; // never rendered
}
