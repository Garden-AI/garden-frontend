import { Paper } from "@/types";

/**
 * Extracts DOI from a URL
 * @param url The URL to check
 * @returns The DOI if found, otherwise null
 */
export const extractDoiFromUrl = (url: string): string | null => {
  if (!url) return null;

  if (url.includes("doi.org/")) {
    const doiIndex = url.indexOf("doi.org/");
    const doi = url.substring(doiIndex + 8);
    return doi;
  }

  return null;
};

/**
 * Validates and cleans a bare DOI string
 * @param input The potential DOI string
 * @returns The cleaned DOI if valid, otherwise null
 */
export const validateDoi = (input: string): string | null => {
  if (!input) return null;

  // Clean up whitespace
  const cleaned = input.trim();

  // Check if it matches DOI format (starts with 10.)
  const doiMatch = cleaned.match(/^(10\.\d+\/[^\s]+)/);
  if (doiMatch) {
    return doiMatch[1];
  }

  return null;
};

/**
 * Parse BibTeX string to extract paper metadata
 * @param bibtex The BibTeX string
 * @returns Parsed metadata
 */
export const parseBibtex = (bibtex: string): Partial<Paper> => {
  const metadata: Partial<Paper> = {};

  // Extract title
  const titleMatch = bibtex.match(/title\s*=\s*{([^}]+)}/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract DOI
  const doiMatch = bibtex.match(/doi\s*=\s*{([^}]+)}/i);
  if (doiMatch) {
    metadata.doi = doiMatch[1].trim();
  }

  // Extract authors
  const authorMatch = bibtex.match(/author\s*=\s*{([^}]+)}/i);
  if (authorMatch) {
    const authorString = authorMatch[1];
    // Split by "and" and clean up names
    const authors = authorString
      .split(/\s+and\s+/i)
      .map(author => {
        // Handle "Last, First" format and convert to "First Last"
        if (author.includes(',')) {
          const parts = author.split(',').map(p => p.trim());
          if (parts.length >= 2) {
            return `${parts[1]} ${parts[0]}`;
          }
        }
        return author.trim();
      })
      .filter(author => author.length > 0);

    metadata.authors = authors;
  }

  // Extract year
  const yearMatch = bibtex.match(/year\s*=\s*{?(\d{4})}?/i);
  const year = yearMatch ? yearMatch[1] : '';

  // Extract journal
  const journalMatch = bibtex.match(/journal\s*=\s*{([^}]+)}/i);
  const journal = journalMatch ? journalMatch[1].trim() : '';

  // Create citation from available data
  if (metadata.authors && metadata.title && year) {
    const authorText = metadata.authors.length > 3
      ? `${metadata.authors[0]} et al.`
      : metadata.authors.join(", ");

    let citation = `${authorText} (${year}). ${metadata.title}`;
    if (journal) {
      citation += `. ${journal}`;
    }
    if (metadata.doi) {
      citation += `. https://doi.org/${metadata.doi}`;
    }

    metadata.citation = citation;
  }

  return metadata;
};

/**
 * Fetches paper metadata from DOI.org using content negotiation
 * @param doi The DOI to fetch metadata for
 * @returns Paper metadata
 */
export const fetchDoiMetadata = async (doi: string): Promise<Partial<Paper>> => {
  try {
    // Use the canonical DOI URL
    const url = `https://doi.org/${doi}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/x-bibtex',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch DOI metadata: ${response.status} ${response.statusText}`);
    }

    const bibtex = await response.text();

    // Parse the BibTeX response
    const metadata = parseBibtex(bibtex);

    // Ensure we have the DOI and canonical URL
    metadata.doi = doi;
    metadata.url = `https://doi.org/${doi}`;

    return metadata;
  } catch (error) {
    console.error("Error fetching DOI metadata:", error);
    return {};
  }
};