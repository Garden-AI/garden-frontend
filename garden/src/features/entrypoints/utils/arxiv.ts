import { Paper } from "@/types";

/**
 * Extracts arXiv ID from a URL
 * @param url The URL to check
 * @returns The arXiv ID if found, otherwise null
 */
export const extractArxivId = (url: string): string | null => {
  if (!url.includes("arxiv.org")) return null;

  console.log("Attempting to extract arXiv ID from:", url);

  // Extract ID from URLs like https://arxiv.org/abs/2101.12345 or https://arxiv.org/abs/2101.12345v1
  const absMatch = url.match(/arxiv\.org\/abs\/([0-9.]+)(v[0-9]+)?/);
  if (absMatch && absMatch[1]) {
    console.log("Matched abs pattern:", absMatch[1]);
    return absMatch[1];
  }

  // Extract ID from URLs like https://arxiv.org/pdf/2101.12345.pdf or https://arxiv.org/pdf/2101.12345v1.pdf
  const pdfMatch = url.match(/arxiv\.org\/pdf\/([0-9.]+)(v[0-9]+)?(\.pdf)?/);
  if (pdfMatch && pdfMatch[1]) {
    console.log("Matched pdf pattern:", pdfMatch[1]);
    return pdfMatch[1];
  }

  console.log("No arXiv ID pattern matched");
  return null;
};

/**
 * Extracts DOI from a URL
 * @param url The URL containing a DOI
 * @returns The extracted DOI
 */
export const extractDoi = (url: string): string | null => {
  if (!url.includes("doi.org/")) return null;
  
  // Find the position of "doi.org/" in the URL
  const doiIndex = url.indexOf("doi.org/");
  if (doiIndex === -1) return null;
  
  // Extract everything after "doi.org/"
  const doi = url.substring(doiIndex + 8); // 8 is the length of "doi.org/"
  console.log("Extracted DOI:", doi);
  return doi;
};

/**
 * Fetches paper metadata from arXiv API
 * @param arxivId The arXiv ID
 * @returns Paper metadata
 */
export const fetchArxivMetadata = async (arxivId: string): Promise<Partial<Paper>> => {
  try {
    console.log("Fetching metadata for arXiv ID:", arxivId);
    
    // arXiv API endpoint
    const apiUrl = `https://export.arxiv.org/api/query?id_list=${arxivId}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch arXiv metadata: ${response.statusText}`);
    }

    const data = await response.text();
    
    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    
    // Extract metadata
    const entry = xmlDoc.querySelector("entry");
    if (!entry) {
      throw new Error("No entry found in arXiv response");
    }

    const title = entry.querySelector("title")?.textContent?.trim() || "";
    console.log("Extracted title:", title);
    
    // Extract authors
    const authors: string[] = [];
    entry.querySelectorAll("author").forEach((author) => {
      const name = author.querySelector("name")?.textContent?.trim();
      if (name) authors.push(name);
    });
    console.log("Extracted authors:", authors);
    
    // Extract summary/abstract
    const summary = entry.querySelector("summary")?.textContent?.trim() || "";
    
    // Extract DOI if available from links
    let doi: string | null = null;
    entry.querySelectorAll("link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.includes("doi.org")) {
        // Extract just the DOI part using our helper function
        doi = extractDoi(href);
      }
    });
    
    // If no DOI found in links, check for DOI in the journal reference or arxiv identifier
    if (!doi) {
      // Check for DOI in journal reference
      const journalRef = entry.querySelector("journal_ref")?.textContent?.trim();
      if (journalRef && journalRef.includes("doi:")) {
        const doiMatch = journalRef.match(/doi:([\w.\/\-]+)/i);
        if (doiMatch && doiMatch[1]) {
          doi = doiMatch[1];
          console.log("Extracted DOI from journal reference:", doi);
        }
      }
      
      // If still no DOI, use the arXiv ID as a DOI
      if (!doi) {
        doi = `10.48550/arXiv.${arxivId}`;
        console.log("Using arXiv ID as DOI:", doi);
      }
    }
    
    // Format citation
    const published = entry.querySelector("published")?.textContent?.trim() || "";
    const year = published ? new Date(published).getFullYear().toString() : "";
    
    let citation = "";
    if (authors.length > 0 && title && year) {
      const authorText = authors.length > 3 
        ? `${authors[0]} et al.` 
        : authors.join(", ");
      citation = `${authorText} (${year}). ${title}. arXiv:${arxivId}`;
      console.log("Generated citation:", citation);
    }
    
    return {
      title,
      authors,
      doi: doi || "",
      citation,
      url: `https://arxiv.org/abs/${arxivId}`,
    };
  } catch (error) {
    console.error("Error fetching arXiv metadata:", error);
    return {};
  }
}; 