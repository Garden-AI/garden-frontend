import { search } from "@globus/sdk/cjs";
import { Garden } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

const searchGardens = async (
  query: string,
  limit: `${number}`,
): Promise<Garden[]> => {
  try {
    const response = await search.query.get(
      import.meta.env.VITE_GLOBUS_SEARCH_INDEX_UUID,
      {
        query: { q: query, limit },
      },
    );
    return (await response.json()).gmeta.map((g: any) => g.entries[0].content);
  } catch (error) {
    throw new Error("Error fetching gardens by query");
  }
};

export const useSearchGardens = (
  query: string,
  limit: `${number}`,
  relatedDOI?: string,
) => {
  return useQuery<Garden[], Error>({
    queryKey: ["search", query, limit, relatedDOI],
    queryFn: async () => {
      {
        const gardens = searchGardens(query, limit);
        if (relatedDOI)
          return (await gardens).filter((garden) => garden.doi !== relatedDOI);
        return gardens;
      }
    },
  });
};
