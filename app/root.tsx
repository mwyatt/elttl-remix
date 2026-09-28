import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useNavigate,
} from "react-router";

import type {Route} from "./+types/root";
import "./app.css";
import ElttlEmblem from "~/components/icons/ElttlEmblem";
import ContentPanel from "~/components/ContentPanel";
import LinkButton from "~/components/LinkButton";
import {Button} from "@headlessui/react";
import classNames from "classnames";
import {buttonPrimaryClassNames} from "~/styles/ui-classes";

export const links: Route.LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <Meta/>
      <Links/>
    </head>
    <body>
    {children}
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
}

export default function App() {
  return <Outlet/>;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred while loading this page.";
  let stack: string | undefined;
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="p-4 container mx-auto flex flex-col gap-4 justify-center items-center h-screen">
      <ContentPanel extraClassNames={'flex flex-col gap-4 items-center'}>
        <div className={'mb-4'}>
          <ElttlEmblem width={100}/>
        </div>
        <h1 className='text-4xl font-semibold'>{message}</h1>
        <p className={'text-lg'}>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
        )}
        <div className={'flex flex-col sm:flex-row gap-6 mt-6'}>
          <Button className={classNames({
            [buttonPrimaryClassNames]: true,
            'px-6 cursor-pointer': true
          })} onClick={() => navigate(-1)}>Back</Button>
          <LinkButton to={"/"} theme={'secondary'} className={'px-6'}>Home</LinkButton>
        </div>
      </ContentPanel>
    </main>
  );
}
