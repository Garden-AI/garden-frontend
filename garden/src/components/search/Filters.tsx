import { useState, useEffect, useMemo } from "react";
import { Filter, Settings, XIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GardenSearchResult } from "@/hooks/useSearchResults";

export function SearchFilters({
  searchResult,
  selectedFilters,
  setSelectedFilters,
}: {
  searchResult: GardenSearchResult;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: (filters: Record<string, string[]>) => void;
}) {
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
    <div className="relative h-full">
      <div className="sticky top-12 space-y-4 divide-y-2 rounded-lg border px-4 py-6 shadow-md">
        <div>
          <h3 className="mb-2 text-lg font-semibold">
            <Filter className="mr-2 inline-block h-5" />
            Filters
          </h3>

          <Accordion type="multiple" className="px-2" defaultValue={facets.map((f) => f.name)}>
            {facets.map((facet) => {
              return (
                <AccordionItem key={facet.name} value={facet.name}>
                  <AccordionTrigger>
                    <Label className="capitalize">{facet.name}</Label>
                  </AccordionTrigger>
                  <AccordionContent className="pl-2">
                    {facet?.values?.slice(0, 7).map((bucket, index) => (
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="my-4 flex justify-center gap-4">
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
      </div>
    </div>
  );
}
