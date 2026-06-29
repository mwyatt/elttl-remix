import type {Route} from "./+types/about-us";
import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import DatePretty from "~/components/DatePretty";
import {sql} from "drizzle-orm";
import StyledContent from "~/components/StyledContent";
import {buildMeta} from "~/constants/MetaData";
import dayjs from "dayjs";

export function meta({loaderData}: Route.MetaArgs) {
    const {
        press
    } = loaderData;
    return buildMeta({
        title: press.title,
        description: `${press.title} - ${press.author} - ${dayjs.unix(press.timePublished)}`
    })
}

export async function loader({request, context, params}: Route.LoaderArgs) {
    const db = getDbFromContext(context)
    const {slug} = params

    const contents = await db.all(sql`
        SELECT title, html, timePublished, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
        FROM content
                 LEFT JOIN user ON content.userId = user.id
        WHERE type = 'press'
          AND slug = ${slug}
    `)

    if (contents.length === 0) {
        return Response.json(`Unable to find 'press' with slug '${slug}'`, {status: StatusCodes.NOT_FOUND})
    }

    return Response.json({press: contents[0]}, {status: StatusCodes.OK})
}

export default function _frontPressSlug({loaderData}: Route.ComponentProps) {
    const {
        press
    } = loaderData;

    return (
        <div className='max-w-[768px] mx-auto'>
            <Breadcrumbs items={
                [
                    {name: 'News Updates', href: '/press'},
                    {name: press.title, href: `/press/${press.slug}`}
                ]
            }
            />
            <h2 className='text-3xl mb-4'>{press.title}</h2>
            <p className='mb-4 text-stone-400'>
                Published <DatePretty time={press.timePublished}/>
                {press.author && (
                    ' by ' + press.author
                )}
            </p>
            <StyledContent html={press.html}/>
        </div>
    )
}