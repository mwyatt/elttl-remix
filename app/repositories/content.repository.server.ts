import { sql } from "drizzle-orm";

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