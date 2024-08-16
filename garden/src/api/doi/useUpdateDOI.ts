import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DOIRequest, Entrypoint, Garden } from "../types";
import MultipleSelector from "@/components/ui/multiple-select";

interface UpdateDOIRequest {
  resource: Garden | Entrypoint;
  event?: "publish" | "hide" | "register" | null | undefined;
  updateEntrypoints?: boolean;
}

const updateDOI = async ({
  resource,
  event,
  updateEntrypoints,
}: UpdateDOIRequest): Promise<DOIRequest> => {
  const type = (<Garden>resource).entrypoints ? "garden" : "entrypoint";
  let mainRequestBody: DOIRequest = formDOIRequest(resource, event);

  if (type === "garden" && updateEntrypoints) {
    (<Garden>resource).entrypoints?.forEach((entrypoint) => {
      let requestBody = formDOIRequest(entrypoint, event);
      try {
        axios.put<DOIRequest>(`doi`, requestBody);
      } catch (error) {
        throw new Error("Error updating DOI");
      }
    });
  }

  try {
    const response = await axios.put<DOIRequest>("doi", mainRequestBody);
    return response.data;
  } catch (error) {
    throw new Error("Error updating DOI");
  }
};

export const useUpdateDOI = (): UseMutationResult<
  unknown,
  Error,
  UpdateDOIRequest,
  unknown
> => {
  return useMutation<unknown, Error, UpdateDOIRequest, unknown>({
    mutationFn: ({ resource, event, updateEntrypoints }: UpdateDOIRequest) =>
      updateDOI({ resource, event, updateEntrypoints }),
  });
};

const formDOIRequest = (
  resource: Garden | Entrypoint,
  event: "publish" | "register" | "hide" | null | undefined = null,
): DOIRequest => {
  const type = (<Garden>resource).entrypoints ? "garden" : "entrypoint";
  return {
    data: {
      type: "dois",
      attributes: {
        event,
        identifiers: [
          {
            identifier: resource.doi,
            identifierType: "DOI",
          },
        ],
        creators:
          resource.authors?.map((author) => ({
            nameType: "Personal",
            name: author,
          })) || [],
        titles: [
          {
            title: resource.title,
          },
        ],
        descriptions: [{ description: resource.description }],
        publisher: {
          name: "thegardens.ai",
        },
        publicationYear: Number(resource.year),
        types: {
          resourceType: "AI/ML Garden",
          resourceTypeGeneral: "Software",
        },
        relatedIdentifiers:
          type === "garden"
            ? (<Garden>resource).entrypoints?.map((entrypoint) => ({
                relatedIdentifier: entrypoint.doi,
                relatedIdentifierType: "DOI",
                relationType: "HasPart",
              }))
            : [],
        url: `https://thegardens.ai/#/${type}/${encodeURIComponent(resource.doi)}`,
      },
    },
  };
};
