import React, { useState, useMemo, useCallback } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/shadcn/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Textarea } from "@/components/shadcn/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/shadcn/collapsible";

import { GardenCreateFormData } from "../../types/garden.types";
import { tagOptions } from "../../utils/garden.utils";
import FunctionSelectionTable from "@/components/FunctionSelectionTable";
import { useGetAllModalFunctions } from "@/features/modal/api/useGetAllModalFunctions";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export const CreateGardenFormFields = () => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;
  const { isSubmitting } = form.formState;

  const modalApp = form.watch("modal");

  // Extract only the function IDs from the modal app - these should be excluded from the selection table
  // as they're already part of the garden. We don't want to exclude functions that are being selected
  // in the modal_function_ids field.
  const modalAppFunctionIds = modalApp.modal_functions?.map((func: any) => func.id) || [];

  // Check if garden is published to disable modal function selection
  const isPublished = form.watch("doi_is_draft") === false && form.watch("is_archived") === false;

  const [funcitonTableExpanded, setFunctiontableExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback(
    (value:string) => setSearchQuery(value),
    []
  );
  
  const { data: modalFunctions, isLoading, isFetching } = useGetAllModalFunctions();

  const filteredFunctions= useMemo(() => {
    if (!modalFunctions || !Array.isArray(modalFunctions)) return [];
    if (!modalAppFunctionIds || modalAppFunctionIds.length === 0) return modalFunctions;
    return modalFunctions.filter((f) => !modalAppFunctionIds.includes(f.id));
  }, [modalFunctions, modalAppFunctionIds]);

  return (
    <div className="space-y-12">
      {/* Informational Banner */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold">All metadata can be edited later</h4>
            <p className="mt-1">
              Don't worry about getting everything perfect now. You can update all Garden metadata after creating.
            </p>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Title</FormLabel>
            <FormControl>
              <Input placeholder="My Garden" {...field} />
            </FormControl>
            <FormDescription>This is your Garden's display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="font-bold">Description</FormLabel>
              {field.value && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Auto-generated
                </span>
              )}
            </div>
            <FormControl>
              <Textarea
                placeholder="Tell us about your garden"
                className="resize-vertical min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A high level overview of your Garden, its purpose, and its contents. This will be
              displayed on the Garden page and appear in search results.
              {field.value && (
                <span className="mt-1 block text-xs italic text-gray-500">
                  We've auto-generated a description based on your Modal app. Feel free to customize it.
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="font-bold">Tags</FormLabel>
              {field.value.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Auto-suggested
                </span>
              )}
            </div>
            <FormControl>
              <MultipleSelector
                {...field}
                groupBy="group"
                placeholder="Add tags to your garden"
                creatable
                hideClearAllButton
                defaultOptions={tagOptions}
                maxSelected={5}
                hidePlaceholderWhenSelected
                inputProps={{ maxLength: 32 }}
                onChange={(value) => {
                  field.onChange(value.map((v: any) => v.value));
                }}
                value={field.value.map((v: any) => ({ value: v, label: v }))}
              />
            </FormControl>
            <FormDescription>
              Tags to help categorize and improve the discoverability your Garden.
              {field.value.length > 0 && (
                <span className="mt-1 block text-xs italic text-gray-500">
                  We've suggested tags based on your Modal app. You can add more or remove these suggestions.
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Function Selection */}
      <div className="space-y-8">
        <Collapsible className="w-full space-y-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-1 w-full h-16" onClick={() => setFunctiontableExpanded((prev) => !prev)}>
              <div className="flex items-center justify-between w-full">
                <div className="m-4">
                  <div className="flex flex-col items-start">
                    <h2 className="text-xl font-semibold">(Optional) Include Functions</h2>
                    <p className="text-sm text-gray-700">
                      Include functions from deployed models in this Garden.
                    </p>
                  </div>
                </div>
                {funcitonTableExpanded ? <ChevronUp className="h-6 w-6 m-4" /> : <ChevronDown className="h-6 w-6 m-4" />}
                <span className="sr-only">Toggle</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
          <Controller
            control={form.control}
            name="modal_function_ids"
            render={({ field }) => (
              <FunctionSelectionTable
                functions={filteredFunctions}
                selectedFunctionIds={field.value ?? []}
                onSelectionChange={field.onChange}
                isLoading={isLoading}
                isFetching={isFetching}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                showSelectedChips={true}
                showClearAllButton={true}
                showSearch={true}
                maxHeight="420px"
                className="mt-2"
                onFunctionAdded={(functionId, authorIds) => {
                  if (!authorIds || authorIds.length === 0) {
                    toast.warning("This function has no authors defined");
                    return;
                  }

                  const current = form.getValues("authors") || [];
                  const updated = Array.from(new Set([...current, ...authorIds]));
                  form.setValue("authors", updated);
                }}
                onFunctionRemoved={(functionId) => {
                  const currentAuthors = form.getValues("authors") || [];

                  const removedFunc = filteredFunctions.find(f => f.id === functionId);
                  const removedAuthorIds = removedFunc?.authors ?? [];

                  const stillSelectedFunctions = filteredFunctions.filter(f =>
                    f.id !== functionId && field.value.includes(f.id)
                  );

                  const remainingAuthorIds = new Set<string>();
                  stillSelectedFunctions.forEach(f => {
                    (f.authors ?? []).forEach(id => remainingAuthorIds.add(id));
                  });

                  const updatedAuthors = currentAuthors.filter(id => remainingAuthorIds.has(id));
                  form.setValue("authors", updatedAuthors);
                }}
              />
            )}
          />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Contributors</h2>
        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Model Authors</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add Model Authors"
                  creatable
                  onChange={(value) => {
                    field.onChange(value.map((v: any) => v.value));
                  }}
                  value={field.value.map((v: any) => ({ value: v, label: v }))}
                />
              </FormControl>
              <FormDescription>
                The main researchers involved in producing the models in this Garden. At least one author is
                required in order to register a DOI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contributors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Gardeners</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add Gardeners"
                  creatable
                  onChange={(value) => {
                    field.onChange(value.map((v: any) => v.value));
                  }}
                  value={field.value.map((v: any) => ({ value: v, label: v }))}
                />
              </FormControl>
              <FormDescription>
                Acknowledge contributors to the development of this Garden.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button type="submit" className={"inline-block"}>
          {isSubmitting ? "Creating Garden..." : `Create Garden`}
        </Button>
      </div>
    </div>
  );
};
