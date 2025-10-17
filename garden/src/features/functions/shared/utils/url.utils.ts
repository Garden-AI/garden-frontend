/**
 * Utility functions for generating function URLs
 */

/**
 * Generates the full URL for a function page
 * @param functionType - Type of function ('modal' or 'hpc')
 * @param functionId - ID of the function
 * @param gardenDOI - Optional garden DOI for garden-scoped URLs
 * @returns Full URL to the function page
 */
export const generateFunctionUrl = (
  functionType: 'modal' | 'hpc',
  functionId: number | string,
  gardenDOI?: string
): string => {
  const baseUrl = window.location.origin;
  const functionPath = functionType === 'modal' ? 'modal-functions' : 'hpc-functions';

  if (gardenDOI) {
    return `${baseUrl}/garden/${encodeURIComponent(gardenDOI)}/${functionPath}/${functionId}`;
  }

  return `${baseUrl}/${functionPath}/${functionId}`;
};
