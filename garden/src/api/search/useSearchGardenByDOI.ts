import { search } from "@globus/sdk/cjs";
import { Garden } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

const searchGardenByDOI = async (doi: string): Promise<Garden> => {
  try {
    const response = await search.query.get(
      import.meta.env.VITE_GLOBUS_SEARCH_INDEX_UUID,
      {
        query: { q: doi, limit: "1" },
      },
    );
    return (await response.json()).gmeta[0].entries[0].content;
  } catch (error) {
    console.error("Error fetching garden by DOI", error);
    throw error;
  }
};

export const useSearchGardenByDOI = (doi: string) => {
  return useQuery<Garden, Error>({
    queryKey: ["garden", doi],
    queryFn: () => searchGardenByDOI(doi),
  });
};
