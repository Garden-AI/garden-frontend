import { useState, useEffect, useMemo } from "react";
import { Filter, Settings, XIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useSearchResults } from "@/hooks/useSearchResults";

export function SearchFilters() {
  const { searchResult } = useSearchResults();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    const filters: Record<string, string[]> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (!["q", "page", "size", "sort"].includes(key)) {
        filters[key] = decodeURIComponent(value).split(",");
      }
    });
    setSelectedFilters(filters);
  }, [searchParams]);

  const allFacets = useMemo(() => {
    return (
      searchResult?.facetResults?.map((f) => ({
        name: f.name,
        values:
          f.buckets?.map((b) => ({ value: b.value, count: b.count })) || [],
      })) || []
    );
  }, [searchResult]);

  const updateFilter = (facet: string, bucket: string, isChecked: boolean) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (isChecked) {
        newFilters[facet] = [...(newFilters[facet] || []), bucket];
      } else {
        newFilters[facet] =
          newFilters[facet]?.filter((b) => b !== bucket) || [];
        if (newFilters[facet].length === 0) {
          delete newFilters[facet];
        }
      }
      return newFilters;
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.entries(selectedFilters).forEach(([key, values]) => {
      params.set(key, values.map(encodeURIComponent).join(","));
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      Object.keys(selectedFilters).forEach((key) => {
        params.delete(key);
      });
      return params.toString();
    });
  };

  const isFilterSelected = (facet: string, bucket: string) => {
    return selectedFilters[facet]?.includes(bucket) || false;
  };

  useEffect(() => {
    applyFilters();
  }, [selectedFilters]);

  if (!allFacets.length) return null;

  return (
    <div className="relative h-full">
      <div className="sticky top-12 space-y-4 divide-y-2 rounded-lg border px-4 py-6 shadow-md">
        <div>
          <h3 className="mb-2 text-lg font-semibold">
            <Filter className="mr-2 inline-block h-5" />
            Filters
          </h3>

          <Accordion
            type="multiple"
            className="px-2"
            defaultValue={allFacets.map((f) => f.name)}
          >
            {allFacets.map((facet) => {
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
                          checked={isFilterSelected(
                            facet.name,
                            String(bucket.value),
                          )}
                          onCheckedChange={(checked) =>
                            updateFilter(
                              facet.name,
                              String(bucket.value),
                              checked as boolean,
                            )
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
            {/* <Button
              type="button"
              variant="default"
              size="sm"
              className="px-8"
              onClick={applyFilters}
            >
              Apply
            </Button> */}
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
