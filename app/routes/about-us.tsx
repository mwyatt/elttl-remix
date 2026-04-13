import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "About" },
];

// Example loader fetching data from an API
export const loader: LoaderFunction = async () => {
  // Replace with your actual data fetching logic
  const data = { team: ["Alice", "Bob", "Charlie"] };
  return json(data);
};

export default function AboutPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-xl font-semibold">About Us</h2>
      <p>This is the about page.</p>
      <ul>
        {data.team.map((member: string) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
}

