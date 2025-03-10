import { Dataset, Garden, GardenPatchRequest, Paper, Repository } from ".";

// Extend the GardenPatchRequest type to include datasets, papers, and repositories
export interface ExtendedGardenPatchRequest extends GardenPatchRequest {
  datasets?: Dataset[] | null;
  papers?: Paper[] | null;
  repositories?: Repository[] | null;
}

// Extend the Garden type to include datasets, papers, and repositories
export interface ExtendedGarden extends Garden {
  datasets?: Dataset[];
  papers?: Paper[];
  repositories?: Repository[];
  current_user_id?: string; // ID of the currently authenticated user
} 