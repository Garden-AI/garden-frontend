import React from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-select";
import { Link, FileType } from "lucide-react";
import { Paper } from "@/types";
import { PaperFormData, paperSchema } from "../../types/entrypoint.types";

interface PaperModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: Paper) => void;
  initialData?: Paper;
  trigger: React.ReactNode;
}

const PaperModal = ({ edit, onSave, initialData, trigger }: PaperModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
      description: initialData?.description || "",
    },
  });

  const handleSave = (data: PaperFormData) => {
    form.reset();
    onSave({
      ...data,
      authors: data.authors?.map((author) => author.value) || [],
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Paper Title" {...field} />
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
                    <MultipleSelector {...field} creatable placeholder="Add authors" />
                  </FormControl>
                  <FormDescription>Add the authors of this paper</FormDescription>
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
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <FileType className="h-4 w-4" />
                      </span>
                      <Input className="rounded-l-none" placeholder="Paper DOI" {...field} value={field.value || ""} />
                    </div>
                  </FormControl>
                  <FormDescription>Digital Object Identifier for the paper (optional)</FormDescription>
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
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input className="rounded-l-none" placeholder="Paper URL" {...field} value={field.value || ""} />
                    </div>
                  </FormControl>
                  <FormDescription>Link to the paper (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the paper" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Short summary of the paper (optional)</FormDescription>
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
                    <Input placeholder="Paper Citation" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Formatted citation for the paper (optional)</FormDescription>
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
