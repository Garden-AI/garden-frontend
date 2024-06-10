import { search } from "@globus/sdk/cjs";
import { GARDEN_INDEX_UUID } from "../constants";

export async function searchGardenIndex(query: {
  q: string;
  offset?: `${number}` | undefined;
  limit?: `${number}` | undefined;
}) {
  const response = await search.query.get(GARDEN_INDEX_UUID, { query });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const content = await response.json();
  return content.gmeta;
}
