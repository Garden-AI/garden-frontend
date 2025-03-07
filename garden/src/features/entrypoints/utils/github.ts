import { Repository } from "@/types";
import { Octokit } from "@octokit/rest";

// Initialize Octokit without authentication for public repositories
// For higher rate limits, you could use a GitHub token from environment variables
const octokit = new Octokit();

/**
 * Extracts owner and repo name from a GitHub URL
 * @param url The GitHub repository URL
 * @returns An object containing owner and repo if found, otherwise null
 */
export const extractGitHubInfo = (url: string): { owner: string; repo: string; ref?: string } | null => {
  if (!url.includes("github.com")) return null;

  try {
    // Parse the URL to extract owner and repo
    const urlObj = new URL(url);
    
    // GitHub URLs are in the format: github.com/owner/repo
    if (urlObj.hostname === "github.com") {
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      
      // Need at least owner and repo in the path
      if (pathParts.length >= 2) {
        const result: { owner: string; repo: string; ref?: string } = {
          owner: pathParts[0],
          repo: pathParts[1],
        };
        
        // Check for version/commit reference in URL
        // Format: github.com/owner/repo/tree/branch or github.com/owner/repo/commit/hash
        if (pathParts.length >= 4 && (pathParts[2] === "tree" || pathParts[2] === "commit")) {
          result.ref = pathParts[3];
        }
        
        return result;
      }
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }

  return null;
};

// Define a type for the metadata we want to return
interface GitHubMetadata {
  repo_name: string;
  url: string;
  contributors: string[];
  license: string;
  version: string;
  description: string;
}

/**
 * Fetches repository metadata from GitHub API
 * @param owner The repository owner
 * @param repo The repository name
 * @param ref Optional reference (branch, tag, or commit)
 * @returns Repository metadata
 */
export const fetchGitHubMetadata = async (
  owner: string,
  repo: string,
  ref?: string
): Promise<GitHubMetadata> => {
  try {
    // Fetch repository information
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch contributors (limited to top 10 to avoid rate limits)
    const { data: contributorsData } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });

    // Extract contributors' login names, ensuring they are all strings
    const contributors: string[] = contributorsData
      .map(contributor => contributor.login)
      .filter((login): login is string => typeof login === 'string');

    // Get license information if available
    let license = "";
    if (repoData.license && repoData.license.name) {
      license = repoData.license.name;
    }

    // Get version information from the ref or default branch
    let version = "";
    if (ref) {
      // If we have a specific ref from the URL, use that
      version = ref;
    } else if (repoData.default_branch) {
      // Otherwise use the default branch
      try {
        // Try to get the latest release
        const { data: releases } = await octokit.repos.listReleases({
          owner,
          repo,
          per_page: 1,
        });

        if (releases.length > 0 && releases[0].tag_name) {
          version = releases[0].tag_name;
        } else {
          // If no releases, use the default branch
          version = repoData.default_branch;
        }
      } catch (error) {
        // If we can't get releases, just use the default branch
        version = repoData.default_branch;
      }
    }

    // Use owner/repo format for the repository name
    const fullRepoName = `${owner}/${repo}`;

    return {
      repo_name: fullRepoName,
      url: repoData.html_url,
      contributors,
      license,
      version,
      description: repoData.description || "",
    };
  } catch (error) {
    console.error("Error fetching GitHub metadata:", error);
    // Return empty values if there's an error
    return {
      repo_name: "",
      url: "",
      contributors: [],
      license: "",
      version: "",
      description: "",
    };
  }
}; 