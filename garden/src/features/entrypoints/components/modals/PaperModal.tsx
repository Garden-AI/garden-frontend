import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Paper } from "@/types";
import { PaperFormData, paperSchema } from "../../types/entrypoint.types";
import { extractArxivId, fetchArxivMetadata } from "../../utils/arxiv";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PaperModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: Paper) => void;
  initialData?: Paper;
  trigger: React.ReactNode;
}

const PaperModal = ({ edit, onSave, initialData, trigger }: PaperModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = React.useState(false);
  const [previousUrl, setPreviousUrl] = React.useState("");

  const form = useForm<PaperFormData>({
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
    }
  }, [isOpen, edit, initialData, form]);

  useEffect(() => {
    const fetchArxivData = async (arxivId: string) => {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchArxivMetadata(arxivId);
        
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
          toast.success("Paper metadata auto-filled from arXiv");
        }
      } catch (error) {
        console.error("Error fetching arXiv metadata:", error);
        toast.error("Failed to fetch paper metadata from arXiv");
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    // Check if URL is an arXiv link and different from the previous one
    if (url && url !== previousUrl) {
      setPreviousUrl(url);
      const arxivId = extractArxivId(url);
      if (arxivId) {
        fetchArxivData(arxivId);
      }
    }
  }, [url, form, previousUrl]);

  const handleSave = (data: PaperFormData) => {
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
                        placeholder="https://arxiv.org/abs/2101.12345 or https://arxiv.org/pdf/2101.12345.pdf" 
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
                    Paste an arXiv link to auto-fill paper details
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
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper DOI</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-l-none" placeholder="Paper DOI" value={field.value || ""} />
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

export default PaperModal;
