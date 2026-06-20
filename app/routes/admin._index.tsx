import { Link, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/admin._index";
import {linkStyles} from "~/styles/ui-classes";

type AdminLoaderData = {
  user: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
  };
};

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AdminIndexPage() {
  return (
      <>
      <h2 className='font-bold text-2xl mb-4 mt-6'>Dashboard</h2>
      <p>Welcome to the admin area.</p>
      <div>
        <div>
          <h3 className='font-semibold text-lg mb-4 mt-6'>Reports</h3>
          <ul className='list-disc list-inside pl-4'>
            <li>
              <Link to='/admin/report/players-playing-up' className={linkStyles.join(' ')}>Players Playing Up</Link>
            </li>
          </ul>
        </div>
      </div>
        </>
  );
}