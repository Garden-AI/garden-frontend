import {
  ModalFunction,
  HpcFunctionMetadataResponse,
} from "@/types/index";

// Define a common interface for fields shared between Modal and HPC functions
export interface BaseFunction {
  id: number;
  title: string;
  description: string | null;
  authors?: string[];
  year?: string;
  tags?: string[];
  // Add other common fields here
}

// Add a 'type' discriminator to each function type
export type TypedModalFunction = ModalFunction & {
  functionType: "modal";
};

export type TypedHpcFunction = HpcFunctionMetadataResponse & {
  functionType: "hpc";
};

// Create the discriminated union type
export type GardenFunction = TypedModalFunction | TypedHpcFunction;

// Type guard to check if a function is a Modal function
export const isModalFunction = (
  func: GardenFunction,
): func is TypedModalFunction => {
  return func.functionType === "modal";
};

// Type guard to check if a function is an HPC function
export const isHpcFunction = (
  func: GardenFunction,
): func is TypedHpcFunction => {
  return func.functionType === "hpc";
};