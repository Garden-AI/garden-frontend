import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Link, FileType, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { DatasetFormData, datasetSchema } from "../../types/entrypoint.types";
import { extractZenodoId, fetchZenodoMetadata } from "../../utils/zenodo";

interface DatasetModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: DatasetFormData) => void;
  initialData?: DatasetFormData;
  trigger: React.ReactNode;
}

const DatasetModal = ({ edit, onSave, initialData, trigger }: DatasetModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [previousUrl, setPreviousUrl] = useState<string>("");

  const form = useForm<DatasetFormData>({
    resolver: zodResolver(datasetSchema),
    defaultValues: initialData || {
      title: "",
      doi: "",
      url: "",
      data_type: "",
      repository: "",
    },
  });

  const url = form.watch("url");

  // Auto-populate dataset metadata when URL changes
  useEffect(() => {
    const fetchZenodoData = async (zenodoId: string) => {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchZenodoMetadata(zenodoId);
        
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
        
        if (metadata.data_type && !form.getValues("data_type")) {
          form.setValue("data_type", metadata.data_type);
          fieldsUpdated = true;
        }
        
        if (metadata.repository && !form.getValues("repository")) {
          form.setValue("repository", metadata.repository);
          fieldsUpdated = true;
        }
        
        if (fieldsUpdated) {
          toast.success("Dataset metadata auto-filled from Zenodo");
        }
      } catch (error) {
        console.error("Error fetching Zenodo metadata:", error);
        toast.error("Failed to fetch dataset metadata from Zenodo");
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    // Check if URL is a Zenodo link and different from the previous one
    if (url && url !== previousUrl) {
      setPreviousUrl(url);
      const zenodoId = extractZenodoId(url);
      if (zenodoId) {
        fetchZenodoData(zenodoId);
      }
    }
  }, [url, form, previousUrl]);

  const handleSave = (data: DatasetFormData) => {
    //clear form
    form.reset();
    onSave(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Dataset" : "Add New Dataset"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "Make changes to your dataset here."
              : "Enter the details of your new dataset here."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Dataset title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="raw">Raw</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="analyzed">Analyzed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repository"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <Book className="h-4 w-4" />
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="Dataset repository"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <div className="relative flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input 
                        className="rounded-l-none" 
                        placeholder="Dataset URL" 
                        {...field} 
                      />
                      {isLoadingMetadata && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Paste a Zenodo link to auto-fill dataset details
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
                  <FormLabel>DOI </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <FileType className="h-4 w-4" />
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="Dataset DOI"
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" onClick={form.handleSubmit(handleSave)}>
                {edit ? "Save Changes" : "Add Dataset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetModal;
