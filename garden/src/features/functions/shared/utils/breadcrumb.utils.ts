/**
 * Utility functions for generating breadcrumb navigation
 */

import { Garden } from "@/types";

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

/**
 * Generates breadcrumb items for a function page
 * @param functionTitle - Title of the function
 * @param gardenDOI - Optional garden DOI if navigated from a garden
 * @param garden - Optional garden object if loaded
 * @returns Array of breadcrumb items
 */
export const generateFunctionBreadcrumbs = (
  functionTitle: string,
  gardenDOI?: string,
  garden?: Garden
): BreadcrumbItem[] => {
  // Garden-scoped navigation
  if (gardenDOI && garden) {
    return [
      { label: "Home", link: "/" },
      { label: garden.title, link: `/garden/${encodeURIComponent(gardenDOI)}` },
      { label: functionTitle },
    ];
  }

  // Standalone function page
  return [
    { label: "Home", link: "/" },
    { label: functionTitle },
  ];
};
