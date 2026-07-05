import {sql} from "drizzle-orm";
import ContentStatus from "~/constants/ContentStatus";

export async function getPressByTitleLikeAndPublishedAfter(
  db: any,
  titleFragment: string,
  datePublished: { unix: () => number }
) {
  const contents = await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
      AND title LIKE ${`%${titleFragment}%`}
      AND timePublished > ${datePublished.unix()}
      AND status = ${ContentStatus.PUBLISHED}
    ORDER BY timePublished DESC
  `);

  return contents;
}

export async function getPressBySlugLike(
  db: any,
  slug: string
) {
  const contents = await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
      AND slug LIKE ${`%${slug}%`}
  `);

  return contents;
}

export async function getAllPublishedPress(
  db: any,
) {
  return await db.all(sql`
    SELECT *
    FROM content
    WHERE type = ${"press"}
    AND status = ${ContentStatus.PUBLISHED}
  `);
}