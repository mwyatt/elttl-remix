import { sql } from "drizzle-orm";
import ContentStatus from "~/constants/ContentStatus";

export async function getPressByTitleLikeAndPublishedBetween(
  db: any,
  titleFragment: string,
  datePublishedStart: { unix: () => number },
  datePublishedEnd: { unix: () => number },
) {
  const contents = await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
      AND title LIKE ${`%${titleFragment}%`}
      AND timePublished > ${datePublishedStart.unix()}
      AND timePublished < ${datePublishedEnd.unix()}
      AND status = ${ContentStatus.PUBLISHED}
    ORDER BY timePublished DESC
  `);

  return contents;
}

export async function getPressBySlugLike(db: any, slug: string) {
  const contents = await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
      AND slug LIKE ${`%${slug}%`}
  `);

  return contents;
}

export async function getAllPublishedPress(db: any) {
  return await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
    AND status = ${ContentStatus.PUBLISHED}
  `);
}
