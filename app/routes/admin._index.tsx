import { Link, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/admin._index";

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
  // parent route id is usually "routes/admin" with your file naming
  const adminData = useRouteLoaderData("routes/admin") as AdminLoaderData | undefined;
  const user = adminData?.user;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-stone-600 mt-1">
          {user ? `Signed in as ${user.email ?? user.name ?? user.id}` : "Authenticated"}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/fixtures"
          className="rounded border border-stone-300 p-4 hover:bg-stone-50"
        >
          <h2 className="font-semibold">Fixtures</h2>
          <p className="text-sm text-stone-600 mt-1">Manage fixtures and schedule updates.</p>
        </Link>

        <Link
          to="/admin/results"
          className="rounded border border-stone-300 p-4 hover:bg-stone-50"
        >
          <h2 className="font-semibold">Results</h2>
          <p className="text-sm text-stone-600 mt-1">Review and edit submitted results.</p>
        </Link>

        <Link
          to="/admin/players"
          className="rounded border border-stone-300 p-4 hover:bg-stone-50"
        >
          <h2 className="font-semibold">Players</h2>
          <p className="text-sm text-stone-600 mt-1">Maintain player records and details.</p>
        </Link>
      </section>
    </main>
  );
}