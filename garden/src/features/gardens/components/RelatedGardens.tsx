import { Garden } from "@/types";
import { RocketIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import RelatedGardenBox from "./RelatedGardenBox";

import {
  transformSearchResultToGardens,
  useSearchGardens,
} from "@/features/search/api/useSearchGardens";
import { useEffect, useState } from "react";

const RelatedGardens = ({ doi }: { doi: string }) => {
  const { data, isLoading, isError } = useSearchGardens({
    q: "",
    limit: 10,
    offset: 0,
  });

  const [gardens, setGardens] = useState<Garden[] | null>(null);

  useEffect(() => {
    setGardens(transformSearchResultToGardens(data).filter((garden) => garden.doi !== doi));
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !gardens) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center gap-2">
        <RocketIcon className="h-auto w-6 font-thin text-gray-800" />
        <h1 className="text-3xl ">Explore Other Gardens</h1>
      </div>
      <div className="relative flex items-center pb-12">
        <div className="inline-flex h-full w-full gap-4 overflow-x-scroll scroll-smooth ">
          {gardens.map((garden: Garden) => (
            <RelatedGardenBox garden={garden} key={garden.doi} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedGardens;
