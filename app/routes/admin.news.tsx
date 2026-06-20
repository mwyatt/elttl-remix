import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import ContentStatus from '~/constants/ContentStatus'
import dayjs from "dayjs";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);

  const news = await db.all(`
    SELECT
      id,
      title,
      slug,
      html,
      timePublished,
      status,
      userId
      FROM content c
      order by c.timePublished DESC
    limit 10
  `)

  return {
    news
  }
}


export default function AdminNews({ loaderData }: Route.ComponentProps) {
      const { news } = loaderData

  return (
    <div className={'container mx-auto max-w-screen-lg'}>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl p-4'>News</h2>
        <Link className='bg-primary-500 text-white px-2 py-1' to='/admin/news/create'>Create News</Link>
      </div>

      {news.map(newsItem => (
        <div key={newsItem.id} className='flex items-center p-2 border-t border-t-stone-200 hover:bg-stone-100'>
          <Link className='text-primary-500 underline flex-grow' to={`/admin/news/${newsItem.id}`}>
            {newsItem.title}
          </Link>
          <div className='mx-8'>
            {dayjs.unix(newsItem.timePublished).format('DD/MM/YYYY HH:mm')}
          </div>
          <div className='mx-8'>
            {newsItem.status === ContentStatus.PUBLISHED ? 'Published' : 'Unpublished'}
          </div>
          <Link className='bg-stone-500 text-white px-2 py-1' to={`/admin/news/${newsItem.id}`}>
            Edit
          </Link>
        </div>
      ))}
    </div>
  )
}