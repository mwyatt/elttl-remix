import { createCookieSessionStorage, redirect } from "react-router";

type SessionData = {
  userId?: string;
  isAdmin?: boolean;
};

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