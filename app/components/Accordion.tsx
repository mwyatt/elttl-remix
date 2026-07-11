import {useState} from "react";
import classNames from "classnames";
import {allHomeButtonStyles} from "~/styles/ui-classes";

export default function Accordion({ previewHeight = 200, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`overflow-hidden transition-all duration-300`}
        style={{ maxHeight: open ? 10000 : previewHeight }}
      >
        {children}
      </div>

      {!open && (
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      )}

      <button
        onClick={() => setOpen(!open)}
        className={classNames([
            "mt-6 text-blue-600 flex items-center gap-2 relative z-10 w-full justify-center cursor-pointer",
            allHomeButtonStyles
        ])}
      >
        {open ? "▲ Show less" : "▼ Show more"}
      </button>
    </div>
  );
}
