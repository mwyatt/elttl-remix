import { Form, redirect } from "react-router";
import type { Route } from "./+types/admin.login";
import { createAdminSession, getSession } from "~/auth/session.server";
import {getUserByEmail} from "~/repositories/user.repository.server";
import {getDbFromContext} from "~/db-context.server";
import {verifyPassword} from "~/auth/password.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (session.get("isAdmin")) return redirect("/admin");
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin");
  const db = getDbFromContext(context);

  if (username === "" || password === "") return { error: "Username and password are required" };

  const user = await getUserByEmail(db, username)

  if (user === undefined) {
    return { error: "Username and password are required" };
  }

  const isVerified = await verifyPassword(password, user.password)

  if (isVerified) {
    return createAdminSession(request, user.id, redirectTo);
  }

  return { error: "Invalid credentials" };
}

export default function AdminLogin({ actionData }: Route.ComponentProps) {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      {actionData?.error && <p className="text-red-600 mb-3">{actionData.error}</p>}
      <Form method="post" className="space-y-3">
        <input name="username" placeholder="Username" className="w-full border p-2" />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2" />
        <button type="submit" className="px-4 py-2 bg-black text-white">Sign in</button>
      </Form>
    </main>
  );
}