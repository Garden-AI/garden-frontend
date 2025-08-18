import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Paper } from "@/types";
import { paperSchema, PaperSchema } from "../../types/material.types";
import { extractArxivId, fetchArxivMetadata } from "../../utils/arxiv";
import { extractDoiFromUrl, validateDoi, fetchDoiMetadata } from "../../utils/doi";
import { Checkbox } from "@/components/shadcn/checkbox";
import { usePatchGarden } from "@/features/gardens/api/usePatchGarden";
import { usePatchModalFunction } from "@/features/modal/api/usePatchModalFunction";
import { MaterialModalProps } from "./MaterialModal";

interface PaperModalProps extends MaterialModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: Paper) => void;
  initialData?: Paper;
  trigger: React.ReactNode;
}

const PaperModal = ({ edit, onSave, initialData, trigger, context }: PaperModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");
  const [previousDoi, setPreviousDoi] = useState("");
  const [addAuthorsToEntity, setAddAuthorsToEntity] = useState(false);
  const { mutate: patchGarden } = usePatchGarden();
  const { mutate: patchModalFunction } = usePatchModalFunction();

  const form = useForm<PaperSchema>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: initialData?.title || "",
      authors:
        initialData?.authors?.map((author) => ({
          value: author,
          label: author,
        })) || [],
      doi: initialData?.doi || "",
      citation: initialData?.citation || "",
      url: initialData?.url || "",
    },
  });

  const url = form.watch("url");
  const doi = form.watch("doi");

  // Reset form when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      // If we're editing, load the initial data
      if (edit && initialData) {
        form.reset({
          title: initialData.title || "",
          authors:
            initialData.authors?.map((author) => ({
              value: author,
              label: author,
            })) || [],
          doi: initialData.doi || "",
          citation: initialData.citation || "",
          url: initialData.url || "",
        });
      } else {
        // If we're adding a new paper, reset to empty values
        form.reset({
          title: "",
          authors: [],
          doi: "",
          citation: "",
          url: "",
        });
      }
      setPreviousUrl("");
      setPreviousDoi("");
    }
  }, [isOpen, edit, initialData, form]);

  useEffect(() => {
    const autoFillMetadata = async (metadata: Partial<Paper>, source: string) => {
      let fieldsUpdated = false;

      // Only auto-fill empty fields
      if (metadata.title && !form.getValues("title")) {
        form.setValue("title", metadata.title);
        fieldsUpdated = true;
      }

      if (metadata.doi && !form.getValues("doi")) {
        form.setValue("doi", metadata.doi);
        fieldsUpdated = true;
      }

      if (metadata.url && !form.getValues("url")) {
        form.setValue("url", metadata.url);
        fieldsUpdated = true;
      }

      if (metadata.citation && !form.getValues("citation")) {
        form.setValue("citation", metadata.citation);
        fieldsUpdated = true;
      }

      // Check if authors field is empty
      const currentAuthors = form.getValues("authors");
      const isAuthorsEmpty = !currentAuthors || currentAuthors.length === 0;

      if (metadata.authors && metadata.authors.length > 0 && isAuthorsEmpty) {
        form.setValue(
          "authors",
          metadata.authors.map((author) => ({
            value: author,
            label: author,
          }))
        );
        fieldsUpdated = true;
      }

      if (fieldsUpdated) {
        toast.success(`Paper metadata auto-filled from ${source}`);
      }
    };

    const fetchArxivData = async (arxivId: string) => {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchArxivMetadata(arxivId);
        await autoFillMetadata(metadata, "arXiv");
      } catch (error) {
        console.error("Error fetching arXiv metadata:", error);
        toast.error("Failed to fetch paper metadata from arXiv");
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    const fetchDoiData = async (doi: string) => {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchDoiMetadata(doi);
        await autoFillMetadata(metadata, "DOI");
      } catch (error) {
        console.error("Error fetching DOI metadata:", error);
        toast.error("Failed to fetch paper metadata from DOI");
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    // Check if URL changed and process it
    if (url && url !== previousUrl) {
      setPreviousUrl(url);

      // Try arxiv
      const arxivId = extractArxivId(url);
      if (arxivId) {
        fetchArxivData(arxivId);
        return;
      }

      // Try DOI URL if not arXiv
      const doiFromUrl = extractDoiFromUrl(url);
      if (doiFromUrl) {
        fetchDoiData(doiFromUrl);
        return;
      }
    }

    // Check if DOI field changed and process it
    if (doi && doi !== previousDoi) {
      setPreviousDoi(doi);

      // Validate and fetch DOI metadata
      const validDoi = validateDoi(doi);
      if (validDoi) {
        fetchDoiData(validDoi);
        return;
      }
    }
  }, [url, doi, form, previousUrl, previousDoi]);

  const handleSave = (data: PaperSchema) => {
    if (addAuthorsToEntity) {
      if (context.garden) {
        // Get unique authors by comparing string values rather than object references
        const existingGardenAuthors = context.garden.authors || [];
        const newAuthors = data.authors?.map(a => a.value) || [];

        // Create a properly deduplicated list by using a Set with string values
        const uniqueGardenAuthors = Array.from(new Set([...existingGardenAuthors, ...newAuthors]));

        patchGarden({
          doi: context.garden.doi,
          garden: {
            authors: uniqueGardenAuthors
          }
        });
      }
      if (context.modalFunction) {
        const existingModalAuthors = context.modalFunction.authors || [];
        const newAuthors = data.authors?.map(a => a.value) || [];

        // Create a properly deduplicated list by using a Set with string values
        const uniqueModalAuthors = Array.from(new Set([...existingModalAuthors, ...newAuthors]));

        patchModalFunction({
          id: context.modalFunction.id,
          modalFunction: {
            authors: uniqueModalAuthors
          }
        });
      }
    }
    onSave({
      ...data,
      authors: data.authors?.map((author) => author.value) || [],
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Paper" : "Add New Paper"}</DialogTitle>
          <DialogDescription>
            {edit ? "Make changes to your paper here." : "Enter the details of your paper here."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="https://doi.org/10.1038/nature12373 or https://arxiv.org/abs/2101.12345"
                        className={isLoadingMetadata ? "pr-10" : ""}
                      />
                      {isLoadingMetadata && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Paste a doi.org or arXiv URL to auto-fill paper details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper DOI</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="10.1038/nature12373" value={field.value || ""} />
                  </FormControl>
                  <FormDescription>
                    Paste a DOI to auto-fill paper details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Paper Title" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors</FormLabel>
                  <FormControl>
                    <MultipleSelector {...field} creatable />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="citation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citation</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-l-none" placeholder="Paper Citation" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter>
              {((context.garden) || (context.modalFunction)) && (
                <div className="flex flex-row items-center space-x-3 space-y-0">
                  <Checkbox
                    checked={addAuthorsToEntity}
                    onCheckedChange={(checked) => setAddAuthorsToEntity(checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <FormLabel>Add authors to {(context.garden) ? "Garden" : (context.modalFunction) ? "Function" : ""}</FormLabel>
                  </div>
                </div>
              )}
              <Button type="submit" onClick={form.handleSubmit(handleSave)}>
                {edit ? "Save Changes" : "Add Paper"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { PaperModal };
