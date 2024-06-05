import { search } from "@globus/sdk/cjs";

export async function searchGardenIndex(query: {
  q: string;
  offset?: `${number}` | undefined;
  limit?: `${number}` | undefined;
}) {
  const response = await search.query.get(
    import.meta.env.VITE_GLOBUS_SEARCH_INDEX_UUID,
    { query }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const content = await response.json();
  return content.gmeta;
}
