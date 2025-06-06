import { Filter, XIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import { GardenSearchResult } from "../hooks/useSearchResults";
import { useState } from "react";

const SearchFilters = ({
  searchResult,
  selectedFilters,
  setSelectedFilters,
}: {
  searchResult: GardenSearchResult;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: (filters: Record<string, string[]>) => void;
}) => {
  const [showAllFacets, setShowAllFacets] = useState<Record<string, boolean>>({});

  const updateFilter = (facet: string, bucket: string, isChecked: boolean) => {
    const selected = selectedFilters[facet] || [];
    const updated = isChecked ? [...selected, bucket] : selected.filter((b: any) => b !== bucket);
    setSelectedFilters({ ...selectedFilters, [facet]: updated });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const facets = searchResult.facets;
  if (!facets.length) return null;

  return (
    <div className="sticky top-16 max-h-[80vh] overflow-y-auto rounded-lg border shadow-md bg-white p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </h3>
          <Accordion type="multiple" className="px-2" defaultValue={facets.map((f) => f.name)}>
            {facets.map((facet) => {
              const buckets = showAllFacets[facet.name]
                ? facet.values
                : facet.values.slice(0, 7);
              return (
                <AccordionItem key={facet.name} value={facet.name}>
                  <AccordionTrigger>
                    <Label className="capitalize">{facet.name.split("_").join(" ")}</Label>
                  </AccordionTrigger>
                  <AccordionContent className="pl-2 max-h-48 overflow-y-auto pr-2">
                      {buckets.map((bucket, index) => (
                      <div key={index} className="mb-2 flex items-center gap-2">
                        <Checkbox
                          id={`${facet.name}-${bucket.value}`}
                          checked={
                            selectedFilters[facet.name]?.includes(String(bucket.value)) || false
                          }
                          onCheckedChange={(checked) =>
                            updateFilter(facet.name, String(bucket.value), checked as boolean)
                          }
                        />
                        <Label htmlFor={`${facet.name}-${bucket.value}`}>
                          {String(bucket.value)} ({bucket.count})
                        </Label>
                      </div>
                    ))}
                    {facet.values.length > 7 && (
                      <button
                        type="button"
                        className="text-gray-600 text-xs mt-2 hover:underline"
                        onClick={() =>
                          setShowAllFacets((prev) => ({
                            ...prev,
                            [facet.name]: !prev[facet.name],
                          }))
                        }
                      >
                        {showAllFacets[facet.name] ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="flex justify-center pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="px-4"
              onClick={clearFilters}
            >
              Clear Filters
              <XIcon className="ml-1 h-4" />
            </Button>
          </div>
        </div>
  );
};

export default SearchFilters;
