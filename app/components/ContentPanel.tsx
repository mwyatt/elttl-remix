"use client";

import classNames from "classnames";

export default function ContentPanel({
  children,
  extraClassNames = "",
}) {
  return (
    <div
      className={classNames({
        "shadow-sm p-6 border border-b border-stone-300 rounded": true,
        [extraClassNames]: extraClassNames,
      })}
    >
      {children}
    </div>
  );
}
