import { Garden } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SearchResult } from "@/features/search/components/SearchResult";
import { useSavedGardens } from "../api/useSavedGardens";

type SavedGardensProps = {
  savedGardenDois: string[];
};

const SavedGardens = ({ savedGardenDois }: SavedGardensProps) => {
  const { data: searchResult, isLoading: searchLoading } = useSavedGardens(savedGardenDois);

  if (searchLoading) {
    return <LoadingSpinner />;
  }

  const savedGardens = searchResult?.garden_meta || [];

  return (
    <div className="">
      <div className="mb-6">
        {savedGardens.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {savedGardens.map((garden: Garden, index: number) => (
              <SearchResult verbose={false} garden={garden} key={index} />
            ))}
          </div>
        ) : (
          <h3 className="mt-12 text-center text-xl opacity-60">No gardens saved</h3>
        )}
      </div>
    </div>
  );
};

export default SavedGardens;
