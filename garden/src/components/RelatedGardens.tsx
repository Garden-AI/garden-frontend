import { Garden } from "@/api/types";
import { RocketIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import RelatedGardenBox from "./RelatedGardenBox";
import { useSearchGardens } from "@/api/search";

export default function RelatedGardens({ doi }: { doi: string }) {
  const {
    data: gardens,
    isLoading,
    isError,
  } = useSearchGardens("*", "6", doi!);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !gardens) {
    return;
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
}
