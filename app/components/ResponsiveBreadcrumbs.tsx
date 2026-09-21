import { useEffect, useRef, useState } from "react";

export default function ResponsiveBreadcrumbs({ items }) {
  const containerRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const isOverflowing = el.scrollWidth > el.clientWidth;
      setCollapsed(isOverflowing);
    };

    checkOverflow();
  }, []); // Runs once on mount, no observer

  return (
    <nav className="w-full">
      <div
        ref={containerRef}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        {collapsed ? (
          <Dropdown items={items} />
        ) : (
          items.map((item, i) => <BreadcrumbItem key={i} {...item} />)
        )}
      </div>
    </nav>
  );
}

function BreadcrumbItem({ label, href }) {
  return (
    <a href={href} className="text-blue-600 hover:underline flex-shrink-0">
      {label}
    </a>
  );
}

function Dropdown({ items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        ⋯ More
      </button>

      {open && (
        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
