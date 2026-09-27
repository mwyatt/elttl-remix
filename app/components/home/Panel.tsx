"use client";

import classNames from "classnames";

export default function Panel({
  children,
  rowSpan = 1,
  colSpan = 1,
  extraClassNames = "",
}) {
  return (
    <div
      className={classNames({
        "p-6 sm:border border-b border-stone-300 sm:rounded mb-4 sm:mb-0": true,
        "sm:shadow-sm": true,
        "row-span-2": rowSpan === 2,
        "col-span-2": colSpan === 2,
        "col-span-3": colSpan === 3,
        relative: true,
        [extraClassNames]: extraClassNames,
      })}
    >
      {children}
    </div>
  );
}
