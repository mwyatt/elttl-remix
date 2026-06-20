import { createCookieSessionStorage, redirect } from "react-router";

type SessionData = {
  userId?: string;
  isAdmin?: boolean;
};

const FLASH_KEY = "flashMessage";

const sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-me";

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true, // set false only for local http if needed
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function requireAdmin(request: Request) {
  const session = await getSession(request);
  const isAdmin = session.get("isAdmin");
  if (!isAdmin) {
    const url = new URL(request.url);
    throw redirect(`/admin/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  return session;
}

export async function createAdminSession(request: Request, userId: string, redirectTo = "/admin") {
  const session = await getSession(request);
  session.set("userId", userId);
  session.set("isAdmin", true);

  throw redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroySession(request: Request) {
  const session = await getSession(request);
  throw redirect("/admin/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getSessionUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw Error("No user id found in session")
  }

  const isAdmin = session.get("isAdmin") ?? false

  return {
    isAdmin,
    userId
  }
}

export async function createFlashHeaders(
  request: Request,
  message: string
): Promise<Headers> {
  const session = await getSession(request);
  session.flash(FLASH_KEY, message);

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));
  return headers;
}

export async function getFlashMessage(
  request: Request
): Promise<{ message: string | null; headers: Headers }> {
  const session = await getSession(request);
  const message = (session.get(FLASH_KEY) as string | undefined) ?? null;

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session)); // clears flashed value
  return { message, headers };
}