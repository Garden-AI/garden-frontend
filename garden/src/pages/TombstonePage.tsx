import { Garden } from "@/api/types";
import GardenDropdownOptions from "@/components/GardenDropdownOptions";

export default function TombstonePage({ garden }: { garden: Garden }) {
  return (
    <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
      <div className="my-6 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl">
            Resource does not exist anymore:{" "}
            <span className="font-bold">
              {garden.title}- {garden.authors?.join(", ")}, {garden.year}
            </span>
          </h1>
        </div>
        <div className="flex items-center">
          <GardenDropdownOptions garden={garden} />
        </div>
      </div>

      <span className="mb-6 block h-1 w-36 bg-primary"></span>
      <p>
        The resource with the identifier https://doi.org/{garden.doi} has been
        archived by the owner and is no longer available.
      </p>
    </div>
  );
}
