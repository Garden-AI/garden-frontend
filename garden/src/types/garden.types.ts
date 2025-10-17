import { Dataset, Garden, GardenPatchRequest, Paper, Repository, ModalFunction, Notebook } from ".";

// Base interface for materials with DOI
export interface MaterialWithDOI {
  doi?: string;
  title: string;
  [key: string]: any;
}

export interface MaterialWithURL extends MaterialWithDOI {
  url?: string;
} 