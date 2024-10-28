import { DOIRequest, Entrypoint, Garden, ModalFunction } from "@/api/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const includesTrue = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === true) return true;
    if (typeof obj[key] === "object" && includesTrue(obj[key])) return true;
    if (Array.isArray(obj[key]) && (obj[key].includes(true) || includesTrue(obj[key]))) return true;
  }
  return false;
};

export const getDirtyValues = (values: any, dirtyFields: any) =>
  Object.entries(dirtyFields).reduce((acc, [key, value]) => {
    if (value === false) return acc;
    if (value === true) {
      return { ...acc, [key]: values[key] };
    }
    if (includesTrue(value)) {
      return { ...acc, [key]: values[key] };
    }
    return acc;
  }, {} as any);

// Forming DOI requests

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
        url: `https://thegardens.ai/#/modal-function/${encodeURIComponent(modalFunction.id)}`,
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
