import type { Route } from "./+types/api.ping";
import {hashPassword} from "~/auth/password.server";
import {getUserByEmail, updateUserPassword} from "~/repositories/user.repository.server";
import {getDbFromContext} from "~/db-context.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const password = url.searchParams.get("password");
  const env = context.get("cloudflare")?.env;
  const isLocal = env?.APP_ENV === "local";
  const db = getDbFromContext(context);

  if (isLocal === false) {
    return Response.json({ ok: false, error: "This endpoint is only available in local environment" }, { status: 403 });
  }

  if (!email) {
    return Response.json({ ok: false, error: "Missing ?email=..." }, { status: 400 });
  }

  if (!password) {
    return Response.json({ ok: false, error: "Missing ?password=..." }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password)
  const user = await getUserByEmail(db, email)

  if (!user) {
    return Response.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  const affectedRows = await updateUserPassword(db, user.id, hashedPassword)

  return Response.json({ ok: true, affectedRows });
}