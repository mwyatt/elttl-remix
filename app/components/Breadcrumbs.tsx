import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { allHomeButtonStyles, buttonPrimaryStyles } from "~/styles/ui-classes";

type BreadcrumbItemType = {
  name: string;
  href: string;
};

export default function Breadcrumbs({
  items,
}: {
  items: BreadcrumbItemType[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const isOverflowing = el.scrollWidth > el.clientWidth;
      setCollapsed(isOverflowing);
    };

    checkOverflow();
  }, []);

  return (
    <nav className="w-full mb-4">
      <div
        ref={containerRef}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        {collapsed ? (
          <Dropdown items={items} tempIsLink={true} />
        ) : (
          items.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem key={index} {...item} />
                {index < items.length - 1 && (
                  <span className="text-stone-400 mx-2">/</span>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </nav>
  );
}

function BreadcrumbItem({ name, href }: BreadcrumbItemType) {
  return (
    <a
      href={href}
      className="
    text-primary-500 flex-shrink-0"
    >
      {name}
    </a>
  );
}

function Dropdown({
  items,
  tempIsLink,
}: {
  items: BreadcrumbItemType[];
  tempIsLink: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {tempIsLink && (
        <Link
          to={items[items.length - 2].href}
          className={allHomeButtonStyles.join(" ")}
        >
          {items[items.length - 2].name}
        </Link>
      )}
      {!tempIsLink && (
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          {items[items.length - 1].name}
        </button>
      )}

      {open && (
        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
