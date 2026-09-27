import React from "react";
import LinkButton from "~/components/LinkButton";


export default function ArchiveGrid({
  years,
}) {

  return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8 text-center">
        {years.map((season) => (
          <LinkButton
            to={`/result/${season.name}`}
            key={season.name}
            theme={'secondary'}
          >
            {season.name}
          </LinkButton>
        ))}
      </div>
  );
}
