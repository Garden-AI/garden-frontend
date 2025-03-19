import { DatasetFormData } from "../types/material.types";

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
    
    // Always use "Zenodo" as the repository for consistency
    const repository = "Zenodo";
    
    // Get data type
    // Extract more specific data type information
    let dataType = "";
    
    // First check if there's a specific resource type
    if (metadata.resource_type) {
      if (metadata.resource_type.type === "dataset") {
        // For datasets, try to determine a more specific type from keywords or description
        if (metadata.keywords && metadata.keywords.length > 0) {
          const keywords = metadata.keywords.map((k: string) => k.toLowerCase());
          
          if (keywords.some((k: string) => k.includes("image") || k.includes("photo") || k.includes("picture"))) {
            dataType = "Image";
          } else if (keywords.some((k: string) => k.includes("video") || k.includes("audio") || k.includes("sound"))) {
            dataType = "Video/Audio";
          } else if (keywords.some((k: string) => k.includes("text") || k.includes("document"))) {
            dataType = "Text";
          } else if (keywords.some((k: string) => k.includes("tabular") || k.includes("csv") || k.includes("excel") || k.includes("spreadsheet"))) {
            dataType = "Tabular";
          } else if (keywords.some((k: string) => k.includes("code") || k.includes("software") || k.includes("program"))) {
            dataType = "Software";
          }
        }
        
        // If we couldn't determine from keywords, check file types if available
        if (!dataType && data.files && data.files.length > 0) {
          const fileExtensions = data.files.map((file: any) => {
            const parts = file.key.split('.');
            return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
          });
          
          if (fileExtensions.some((ext: string) => ['jpg', 'jpeg', 'png', 'gif', 'tiff'].includes(ext))) {
            dataType = "Image";
          } else if (fileExtensions.some((ext: string) => ['mp4', 'avi', 'mov', 'mp3', 'wav'].includes(ext))) {
            dataType = "Video/Audio";
          } else if (fileExtensions.some((ext: string) => ['txt', 'pdf', 'doc', 'docx'].includes(ext))) {
            dataType = "Text";
          } else if (fileExtensions.some((ext: string) => ['csv', 'xlsx', 'xls', 'tsv'].includes(ext))) {
            dataType = "Tabular";
          } else if (fileExtensions.some((ext: string) => ['py', 'js', 'java', 'c', 'cpp', 'r', 'ipynb'].includes(ext))) {
            dataType = "Software";
          }
        }
        
        // If still no specific type, just use "Dataset"
        if (!dataType) {
          dataType = "Dataset";
        }
      } else {
        // For non-dataset types, use the resource type directly
        dataType = metadata.resource_type.title || metadata.resource_type.type;
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