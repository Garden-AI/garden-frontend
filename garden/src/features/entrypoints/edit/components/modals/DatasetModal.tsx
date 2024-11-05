import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Book, Link, FileType } from "lucide-react";

const datasetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  doi: z.string().nullable(),
  url: z.string().url("Must be a valid URL"),
  data_type: z.string().nullable(),
  repository: z.string().min(1, "Repository is required"),
});

type DatasetFormData = z.infer<typeof datasetSchema>;

interface DatasetModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: DatasetFormData) => void;
  initialData?: DatasetFormData;
  trigger: React.ReactNode;
}

export default function DatasetModal({
  edit,
  onSave,
  initialData,
  trigger,
}: DatasetModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
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
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="Dataset URL"
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
}
