import {useRef, useState} from 'react';
import Editor from 'react-simple-wysiwyg';
import { Link } from "react-router";
import {getDbFromContext} from "~/db-context.server";
import ContentStatus from '~/constants/ContentStatus'
import {ContentTypes} from '~/constants/Content'
import Feedback from '~/components/Feedback'
import dayjs from "dayjs";
import {sql} from "drizzle-orm";
import FullLoader from "~/components/FullLoader";
import { Form, redirect } from "react-router";
import {getUniqueSlugFromTitle} from "~/services/content.service.server";
import {createFlashHeaders, getFlashMessage, getSessionUser} from "~/auth/session.server";
import {getUserById} from "~/repositories/user.repository.server";

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const { id } = params

      if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

       const sessionUser = await getSessionUser(request);
      let authorUser = await getUserById(db, sessionUser.userId)
  let newsArticles = []

  const isCreate = id === 'create'

  if (isCreate) {
    newsArticles = [
      {
        id: 'create',
        title: '',
        slug: '',
        html: '',
        timePublished: '',
        status: '',
        userId: authorUser.id
      }
    ]
  } else {
    newsArticles = await db.all(sql`
      SELECT
        id,
        title,
        slug,
        html,
        timePublished,
        status,
        userId
        FROM content c
          WHERE c.type = ${ContentTypes.PRESS}
          and c.id = ${id}
    `)
  }

  const newsArticle = newsArticles[0]

  if (!isCreate) {
   authorUser = await getUserById(db, newsArticle.userId)
  }

  const { message, headers } = await getFlashMessage(request)

  return Response.json({
    newsArticle,
    authorUser,
      flashMessage: message,
  }, {
      headers,
  })
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const db = getDbFromContext(context);
  const { id } = params

  const formData = await request.formData();
  const newsArticle = {
    title: String(formData.get("title") ?? ""),
    html: String(formData.get("html") ?? ""),
    status: Number(formData.get("status") ?? 0)
  };

  const isCreate = id === 'create'
  let affectedNewsArticleId = id

  const slug = await getUniqueSlugFromTitle(db, affectedNewsArticleId, newsArticle.title)

  if (isCreate) {
   const sessionUser = await getSessionUser(request);
  const userAuthor = await getUserById(db, sessionUser.userId)
    const response = await db.run(sql`INSERT INTO content (title, slug, html, timePublished, userId, type, status)
      VALUES (
        ${newsArticle.title},
        ${slug},
        ${newsArticle.html},
        ${Math.floor(Date.now() / 1000)},
        ${userAuthor.id},
        ${ContentTypes.PRESS},
        ${ContentStatus.PUBLISHED}
      )`);

    affectedNewsArticleId = response.lastInsertRowid
  } else {
    await db.run(sql`
  UPDATE content
  SET
    title = ${newsArticle.title},
    slug = ${slug},
    html = ${newsArticle.html},
    status = ${newsArticle.status}
  WHERE id = ${id}
`);
  }

const message = isCreate
  ? "News article created successfully!"
  : "News article updated successfully!";

const headers = await createFlashHeaders(request, message);

return redirect(`/admin/news/${affectedNewsArticleId}`, { headers });
}

export default function AdminNewsId({ loaderData }: Route.ComponentProps) {
  const { newsArticle, authorUser, flashMessage } = loaderData
  const [newsArticleData, setNewsArticleData] = useState(newsArticle)
  const isCreate = newsArticleData.id === 'create'
  const contentStatuses = [
    { value: ContentStatus.UNPUBLISHED, label: 'Unpublished' },
    { value: ContentStatus.PUBLISHED, label: 'Published' }
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewsArticleData({
      ...newsArticleData,
      [name]: value
    })
  }

  return (
    <>
      <Feedback message={flashMessage} />
      <Link className='bg-stone-500 text-white px-2 py-1' to='/admin/news'>
        Back
      </Link>
      <Form method={'post'} className='flex flex-col gap-2 max-w-[1280px] mx-auto'>
        <input type='hidden' name={'slug'} value={newsArticle.slug} />
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Title</div>
            <input className='border border-tertiary-500 p-2 w-full' type='text' onChange={handleChange} value={newsArticleData.title} name='title' required />
          </div>
              <Editor name={'html'} value={newsArticleData.html} onChange={handleChange} />
          <input type="hidden" name="html" value={newsArticleData.html} />

          {newsArticleData.id !== 'create' && (
              <>
            <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
              <div className='w-[200px]'>Status</div>
              <select className='border border-tertiary-500 p-2' name='status' onChange={handleChange} value={newsArticleData.status} required>
                {contentStatuses.map((contentStatusSingle) => (
                  <option key={contentStatusSingle.value} value={contentStatusSingle.value}>
                    {contentStatusSingle.label}
                  </option>
                ))}
              </select>
            </div>
            </>
          )}

                      <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
              <div className='w-[200px]'>Author</div>
              <div>
                {authorUser.nameFirst} {authorUser.nameLast}
              </div>
            </div>

        </div>
        <div className='flex justify-end'>
          <button
            type='submit' className='w-32 bg-primary-500 border-b-orange-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-orange-600'
          >
            {isCreate ? 'Create' : 'Update'}
          </button>
        </div>
      </Form>
    </>
  )
}