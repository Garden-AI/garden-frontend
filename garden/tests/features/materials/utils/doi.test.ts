import { describe, it, expect } from "vitest";

import { extractDoiFromUrl, validateDoi, parseBibtex } from "@/features/materials/utils/doi";

describe("when given a url, extractDoiFromUrl", () => {
    const doi = "10.26311%2F65ez-ew73";
    it("returns the parsed DOI", () => {
        const url = `https://doi.org/${doi}`;
        const extracted = extractDoiFromUrl(url);
        expect(extracted).toBe(doi);
    });

    it("returns null if not a doi.org url", () => {
        const url = `https://example.com/${doi}`;
        const extraced = extractDoiFromUrl(url);
        expect(extraced).toBe(null);
    });
});


describe("when given a DOI, validateDoi", () => {
    const doi = "10.263112/F65ez-ew73";
    it("trims whitespace", () => {
        const doiWithSpace = " " + doi + " ";
        const validated = validateDoi(doiWithSpace);
        expect(validated).toBe(doi);
    })

    it("returns null if bad DOI", () => {
        const badDoi = "this-insnt-a-doi";
        const validated = validateDoi(badDoi);
        expect(validated).toBe(null);
    });
});

describe("when given BibTeX, parseBibtex", () => {
    it("extracts title correctly", () => {
        const bibtex = `@article{key,
            title={A Sample Research Paper},
            author={John Doe and Jane Smith},
            year={2023}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.title).toBe("A Sample Research Paper");
    });

    it("extracts DOI correctly", () => {
        const bibtex = `@article{key,
            title={Sample Paper},
            doi={10.1234/example.doi},
            year={2023}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.doi).toBe("10.1234/example.doi");
    });

    it("extracts and formats authors correctly", () => {
        const bibtex = `@article{key,
            title={Sample Paper},
            author={Doe, John and Smith, Jane and Brown, Alice},
            year={2023}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.authors).toEqual(["John Doe", "Jane Smith", "Alice Brown"]);
    });

    it("handles authors without comma format", () => {
        const bibtex = `@article{key,
            title={Sample Paper},
            author={John Doe and Jane Smith},
            year={2023}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.authors).toEqual(["John Doe", "Jane Smith"]);
    });

    it("creates proper citation with all fields", () => {
        const bibtex = `@article{key,
            title={Machine Learning in Practice},
            author={Smith, John and Doe, Jane},
            year={2023},
            journal={Journal of AI Research},
            doi={10.1234/example.doi}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.citation).toBe("John Smith, Jane Doe (2023). Machine Learning in Practice. Journal of AI Research. https://doi.org/10.1234/example.doi");
    });

    it("creates citation without journal", () => {
        const bibtex = `@article{key,
            title={Sample Paper},
            author={Smith, John},
            year={2023},
            doi={10.1234/example.doi}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.citation).toBe("John Smith (2023). Sample Paper. https://doi.org/10.1234/example.doi");
    });

    it("creates citation without DOI", () => {
        const bibtex = `@article{key,
            title={Sample Paper},
            author={Smith, John},
            year={2023},
            journal={Sample Journal}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.citation).toBe("John Smith (2023). Sample Paper. Sample Journal");
    });

    it("uses 'et al.' for more than 3 authors", () => {
        const bibtex = `@article{key,
            title={Collaborative Research},
            author={Smith, John and Doe, Jane and Brown, Alice and Wilson, Bob},
            year={2023}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.citation).toBe("John Smith et al. (2023). Collaborative Research");
    });

    it("returns empty object for empty bibtex", () => {
        const result = parseBibtex("");
        expect(result).toEqual({});
    });

    it("handles missing required fields gracefully", () => {
        const bibtex = `@article{key,
            journal={Some Journal}
        }`;
        const result = parseBibtex(bibtex);
        expect(result.citation).toBeUndefined();
        expect(result.title).toBeUndefined();
        expect(result.authors).toBeUndefined();
    });
});