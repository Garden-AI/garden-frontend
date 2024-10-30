import { Garden, Entrypoint, ModalFunction, DOIRequest } from "@/api/types";

export const formDOIRequest = (
  resource: Garden | Entrypoint | ModalFunction,
  event: "publish" | "register" | "hide" | null | undefined = null,
): DOIRequest => {
  const type = (<Garden>resource).entrypoints
    ? "garden"
    : (<Entrypoint>resource).container_uuid
      ? "entrypoint"
      : "modal_function";

  switch (type) {
    case "garden":
      return formGardenDOIRequest(<Garden>resource, event);
    case "entrypoint":
      return formEntrypointDOIRequest(<Entrypoint>resource, event);
    case "modal_function":
      return formModalFunctionDOIRequest(<ModalFunction>resource, event);
    default:
      throw new Error("Invalid resource type");
  }
};

const formGardenDOIRequest = (
  garden: Garden,
  event: "publish" | "register" | "hide" | null | undefined = null,
): DOIRequest => {
  return {
    data: {
      type: "dois",
      attributes: {
        event,
        ...formSharedDOIAttributes(garden),
        relatedIdentifiers: garden.entrypoints?.map((entrypoint) => ({
          relatedIdentifier: entrypoint.doi,
          relatedIdentifierType: "DOI",
          relationType: "HasPart",
        })),

        url: `https://thegardens.ai/#/garden/${encodeURIComponent(garden.doi)}`,
      },
    },
  };
};

const formEntrypointDOIRequest = (
  entrypoint: Entrypoint,
  event: "publish" | "register" | "hide" | null | undefined = null,
): DOIRequest => {
  return {
    data: {
      type: "dois",
      attributes: {
        event,
        ...formSharedDOIAttributes(entrypoint),

        url: `https://thegardens.ai/#/entrypoint/${encodeURIComponent(entrypoint.doi)}`,
      },
    },
  };
};

const formModalFunctionDOIRequest = (
  modalFunction: ModalFunction,
  event: "publish" | "register" | "hide" | null | undefined = null,
): DOIRequest => {
  return {
    data: {
      type: "dois",
      attributes: {
        event,
        ...formSharedDOIAttributes(modalFunction),
        url: `https://thegardens.ai/#/modal/${encodeURIComponent(modalFunction.id)}`,
      },
    },
  };
};

const formSharedDOIAttributes = (resource: Garden | Entrypoint | ModalFunction) => {
  return {
    identifiers: [
      {
        identifier: resource.doi,
        identifierType: "DOI" as const,
      },
    ],
    creators:
      resource.authors?.map((author) => ({
        nameType: "Personal" as const,
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
      resourceTypeGeneral: "Software" as const,
    },
  };
};
