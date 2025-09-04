import { Garden } from "@/types";
import { GardenSortOption, GardenFilterConfig } from "./useGardenFiltering";

// Common sort options for gardens
export const commonGardenSortOptions: GardenSortOption[] = [
  {
    label: "Title (A-Z)",
    value: "title",
    sortFn: (a, b) => (a.title || "").localeCompare(b.title || ""),
  },
  {
    label: "Title (Z-A)",
    value: "title-desc",
    sortFn: (a, b) => (b.title || "").localeCompare(a.title || ""),
  },
  {
    label: "Date Created (Newest)",
    value: "created-desc",
    sortFn: (a, b) => new Date(b.date_created || 0).getTime() - new Date(a.date_created || 0).getTime(),
  },
  {
    label: "Date Created (Oldest)",
    value: "created",
    sortFn: (a, b) => new Date(a.date_created || 0).getTime() - new Date(b.date_created || 0).getTime(),
  },
];

// Filter configs for My Gardens panel
export const myGardensFilterConfig: GardenFilterConfig[] = [
  {
    label: "Published",
    key: "published",
    defaultChecked: true,
    filterFn: (garden) => !garden.doi_is_draft && !garden.is_archived,
  },
  {
    label: "Draft",
    key: "draft",
    defaultChecked: true,
    filterFn: (garden) => garden.doi_is_draft && !garden.is_archived,
  },
  {
    label: "Archived",
    key: "archived",
    defaultChecked: true,
    filterFn: (garden) => garden.is_archived,
  },
];

// Filter configs for Saved Gardens panel 
export const savedGardensFilterConfig: GardenFilterConfig[] = [
  {
    label: "Published",
    key: "published",
    defaultChecked: true,
    filterFn: (garden) => !garden.doi_is_draft && !garden.is_archived,
  },
  {
    label: "Draft",
    key: "draft",
    defaultChecked: true,
    filterFn: (garden) => garden.doi_is_draft && !garden.is_archived,
  },
  {
    label: "Archived",
    key: "archived",
    defaultChecked: true,
    filterFn: (garden) => garden.is_archived,
  },
];

// Filter configs for Published Gardens panel
export const publishedGardensFilterConfig: GardenFilterConfig[] = [
  // Could add filters like "Has Functions", "Popular", etc. if we had that data
];

// Search field configurations
export const commonGardenSearchFields: Array<keyof Garden | ((garden: Garden) => string)> = [
  'title',
  'description',
  'doi',
  // Search in authors
  (garden: Garden) => {
    // Handle both string and array formats for authors
    const authors = garden.authors;
    if (typeof authors === 'string') {
      return authors;
    }
    if (Array.isArray(authors)) {
      return authors.join(' ');
    }
    return '';
  },
  // Search in modal functions if they exist
  (garden: Garden) => {
    const functions = garden.modal_functions || [];
    const functionNames = functions.map(fn => fn.function_name || '').join(' ');
    const functionTitles = functions.map(fn => fn.title || '').join(' ');
    const functionDescriptions = functions.map(fn => fn.description || '').join(' ');
    return `${functionNames} ${functionTitles} ${functionDescriptions}`;
  },
];

// Pre-configured options for each panel type
export const myGardensFilteringOptions = {
  sortOptions: commonGardenSortOptions,
  filterConfigs: myGardensFilterConfig,
  searchFields: commonGardenSearchFields,
  defaultSort: "created-desc",
};

export const savedGardensFilteringOptions = {
  sortOptions: commonGardenSortOptions,
  filterConfigs: savedGardensFilterConfig,
  searchFields: commonGardenSearchFields,
  defaultSort: "title",
};

export const publishedGardensFilteringOptions = {
  sortOptions: commonGardenSortOptions,
  filterConfigs: publishedGardensFilterConfig,
  searchFields: commonGardenSearchFields,
  defaultSort: "created-desc",
};