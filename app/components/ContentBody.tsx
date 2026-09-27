"use client";

import classNames from "classnames";

export default function ContentBody({
  children,
  isHome = false,
  isNarrow = false,
}) {
  return (
    <div
      className={classNames({
        "sm:grid sm:p-6 gap-6 md:grid-cols-2": isHome,
        "p-4 sm:p-6": !isHome,
        "max-w-screen-md mx-auto": isNarrow,
      })}
    >
      {children}
    </div>
  );
}
