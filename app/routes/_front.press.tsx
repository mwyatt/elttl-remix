import type { Route } from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {Link, useSearchParams} from "react-router";
import {linkStyles} from "~/styles/ui-classes";
import MainHeading from "~/components/MainHeading";
import ContentStatus from "~/constants/ContentStatus";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";
import DatePretty from "~/components/DatePretty";
import {sql} from "drizzle-orm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
    const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const db = getDbFromContext(context);
  const limit = 10
  const offset = (page - 1) * limit

  const contents = await db.all(sql`
      SELECT title, timePublished, slug, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = 'press'
        and status = ${ContentStatus.PUBLISHED}
      order by timePublished desc
          LIMIT ${limit} OFFSET ${offset}
  `<any>)

  return Response.json({contents}, { status: StatusCodes.OK })
}

export default function _frontPress({ loaderData }: Route.ComponentProps) {
    const {
    contents
  } = loaderData;
  const [searchParams] = useSearchParams();
  let page = Number(searchParams.get("page") ?? "1");

  const pageMin = 1
  if (!page || isNaN(page) || parseInt(page) < pageMin) {
    page = pageMin
  }
  const nextPage = parseInt(page) + 1
  let prevPage = parseInt(page) - 1

  if (prevPage < pageMin) {
    prevPage = pageMin
  }

  return (
      <div className='max-w-[768px] mx-auto'>
        <Breadcrumbs items={
          [
            { name: 'News Updates' }
          ]
        }
        />
        <MainHeading name='News Updates' />
        <div className='flex justify-between my-6'>
          <Link className='flex items-center border border-primary-500 text-primary-500 py-1 pr-3 pl-2 rounded' to={`/press?page=${prevPage}`}>
            <BiCaretLeft size={21} className='mr-1' />
            Previous
          </Link>
          <Link className='flex items-center border border-primary-500 text-primary-500 py-1 pr-2 pl-3 rounded' to={`/press?page=${nextPage}`}>
            Next
            <BiCaretRight size={21} className='ml-2' />
          </Link>
        </div>
        {contents.map((content, index) => (
          <div className='p-4 border-b' key={index}>
            <p className='text-sm text-gray-500 mb-2'>
              <DatePretty time={content.timePublished} />
            </p>
            <h2><Link className={linkStyles.join(' ')} to={`/press/${content.slug}`}>{content.title}</Link></h2>
            <h3 className='mt-2'>{content.author}</h3>
          </div>
        ))}
      </div>
  )
}