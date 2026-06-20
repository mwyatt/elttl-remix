import {Form, Link, Outlet} from "react-router";
import type { Route } from "./+types/admin";
import {destroySession, requireAdmin} from "~/auth/session.server";
import ElttlEmblem from '~/components/icons/ElttlEmblem'

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  return destroySession(request); // redirects to /admin/login and clears cookie
}

export default function AdminLayout() {
    return (
    <div className='p-4'>
      <div className='flex'>
        <div>
          <div className='w-20 mx-auto mb-6'>
            <Link to='/'>
              <ElttlEmblem />
            </Link>
          </div>
        </div>
        <div className='flex-1 flex gap-8 m-6'>
          <Link className='text-primary-500 border-b' to='/admin'>Dash</Link>
          <Link className='text-primary-500 border-b' to='/admin/news'>News</Link>
          <Link className='text-primary-500 border-b' to='/admin/player'>Players</Link>
          <Link className='text-primary-500 border-b' to='/admin/fixture'>Fixtures</Link>
           <Link className='text-primary-500 border-b' to='/admin/week'>Weeks</Link>
           <Link className='text-primary-500 border-b' to='/admin/season'>Season</Link>
        </div>
        <div className='flex justify-end m-6'>
<div className="flex justify-end m-6">
  <Form method="post">
    <button
      type="submit"
      className="bg-tertiary-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600"
    >
      Logout
    </button>
  </Form>
</div>
        </div>
      </div>
      <div className='max-w-[1850px] mx-auto'>
        <Outlet />
      </div>
    </div>
  )
}