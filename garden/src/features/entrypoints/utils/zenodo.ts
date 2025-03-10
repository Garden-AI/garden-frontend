import { DatasetFormData } from "../types/entrypoint.types";

/**
 * Extracts Zenodo ID from a URL
 * @param url The URL to check
 * @returns The Zenodo ID if found, otherwise null
 */
export const extractZenodoId = (url: string): string | null => {
  if (!url.includes("zenodo.org")) return null;

  try {
    // Parse the URL to extract the record ID
    const urlObj = new URL(url);
    
    // Zenodo URLs are in the format: zenodo.org/record/RECORD_ID or zenodo.org/records/RECORD_ID
    if (urlObj.hostname.endsWith("zenodo.org")) {
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      
      // Check for record ID in URL
      // Format: zenodo.org/record/RECORD_ID or zenodo.org/records/RECORD_ID
      if (pathParts.length >= 2 && (pathParts[0] === "record" || pathParts[0] === "records")) {
        return pathParts[1];
      }
    }
  } catch (error) {
    console.error("Error parsing Zenodo URL:", error);
  }

  return null;
};

/**
 * Fetches dataset metadata from Zenodo API
 * @param zenodoId The Zenodo record ID
 * @returns Dataset metadata
 */
export const fetchZenodoMetadata = async (zenodoId: string): Promise<Partial<DatasetFormData>> => {
  try {
    // Zenodo API endpoint for records
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Zenodo metadata: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract metadata
    const metadata = data.metadata || {};
    
    // Get title
    const title = metadata.title || "";
    
    // Get DOI
    const doi = metadata.doi || "";
    
    // Get repository information
    // Use the community or publisher as repository if available
    let repository = "";
    if (metadata.communities && metadata.communities.length > 0) {
      repository = metadata.communities[0].id || "";
    } else if (metadata.publisher) {
      repository = metadata.publisher;
    } else {
      repository = "Zenodo";
    }
    
    // Get data type
    // Try to determine data type from resource_type or keywords
    let dataType = "";
    if (metadata.resource_type && metadata.resource_type.type) {
      dataType = metadata.resource_type.type.toLowerCase();
      // Map Zenodo resource types to our data types
      if (dataType === "dataset" || dataType === "image" || dataType === "video") {
        dataType = "raw";
      } else if (dataType === "software" || dataType === "lesson") {
        dataType = "processed";
      } else if (dataType === "publication" || dataType === "presentation") {
        dataType = "analyzed";
      }
    }
    
    return {
      title,
      doi,
      url: `https://zenodo.org/records/${zenodoId}`,
      data_type: dataType || null,
      repository,
    };
  } catch (error) {
    console.error("Error fetching Zenodo metadata:", error);
    return {};
  }
}; 