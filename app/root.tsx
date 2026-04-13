import "./tailwind.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <h1 className="text-2xl font-bold text-blue-600 bg-red-500">Hello worlds dude!</h1>

        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
