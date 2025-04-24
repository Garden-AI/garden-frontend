import { Option } from "@/components/shadcn/multiple-select";
import { AxiosError } from "axios";
import { ModalFunction } from "@/types";

// Converts file to string for backend processing
export const fileToString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file: result is null"));
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(new Error(`Failed to read: ${error.target?.error?.message}`));
    };

    return reader.readAsText(file);
  });
};

// Preset options for the tags in the garden creation form
export const tagOptions: Option[] = [
  {
    value: "Materials Science",
    label: "Materials Science",
    group: "Physical Sciences",
  },
  { value: "Chemistry", label: "Chemistry", group: "Physical Sciences" },
  { value: "Physics", label: "Physics", group: "Physical Sciences" },
  { value: "Drug Discovery", label: "Drug Discovery", group: "Life Sciences" },
  { value: "Astrophysics", label: "Astrophysics", group: "Physical Sciences" },
  {
    value: "Earth Sciences",
    label: "Earth Sciences",
    group: "Physical Sciences",
  },
  { value: "Biology", label: "Biology", group: "Life Sciences" },
  { value: "Bioinformatics", label: "Bioinformatics", group: "Life Sciences" },
  { value: "Neuroscience", label: "Neuroscience", group: "Life Sciences" },
  { value: "Engineering", label: "Engineering", group: "Applied Sciences" },
  {
    value: "Energy Systems",
    label: "Energy Systems",
    group: "Applied Sciences",
  },
  {
    value: "Agricultural Science",
    label: "Agricultural Science",
    group: "Applied Sciences",
  },
  {
    value: "Computer Science",
    label: "Computer Science",
    group: "Computer Sciences",
  },
  {
    value: "Cybersecurity",
    label: "Cybersecurity",
    group: "Computer Sciences",
  },
  { value: "Manufacturing", label: "Manufacturing", group: "Applied Sciences" },
];


export class ApiError extends Error {
  readonly statusCode?: number;
  readonly suggestedFix?: string;
  readonly deploymentOutput?: string;
  constructor(
    message: string,
    suggestedFix?: string,
    deploymentOutput?: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.suggestedFix = suggestedFix;
    this.deploymentOutput = deploymentOutput;
  }

  static fromAxiosError(error: AxiosError): ApiError {
    interface ApiErrorInfo {
      detail: string,
      suggestedFix: string,
      deploymentOutput: string,
    }
    const { detail, suggestedFix, deploymentOutput } = error.response?.data as ApiErrorInfo ?? {};

    return new ApiError(
      detail || 'Unknown API Error',
      suggestedFix,
      deploymentOutput,
    );
  }

  toString(): string {
    const str = `Error: ${this.message}`;
    const suggestedFix = this.suggestedFix ? `, suggested_fix: ${this.suggestedFix}` : '';
    const deploymentOutput = this.deploymentOutput ? `, deployment_output: ${this.deploymentOutput}` : '';
    return str + suggestedFix + deploymentOutput;
  }
}

export type MaterialType = 'datasets' | 'papers' | 'repositories' | 'notebooks';

export const getUniqueItemCount = (modalFunctions: ModalFunction[] | undefined, materialType: MaterialType): number => {
  if (!modalFunctions) return 0;

  const getIdentifier = (item: any) => {
    switch (materialType) {
      case 'datasets':
      case 'papers':
        return item.doi || item.url || item.title;
      case 'repositories':
      case 'notebooks':
        return item.url;
    }
  };

  return modalFunctions.reduce((uniqueItems, mf) => {
    const items = mf[materialType];
    if (!items) return uniqueItems;

    const ids = new Set(items.map(getIdentifier));
    ids.forEach(id => uniqueItems.add(id));
    return uniqueItems;
  }, new Set()).size;
};
