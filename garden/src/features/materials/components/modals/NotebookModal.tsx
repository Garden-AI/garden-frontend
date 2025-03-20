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
} from "@/components/shadcn/form";
import { Notebook } from "@/types";
import { z } from "zod";

const notebookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  url: z.string().url("Must be a valid URL"),
});

type NotebookFormData = z.infer<typeof notebookSchema>;

interface NotebookModalProps {
  edit?: boolean;
  onSave: (data: Notebook) => void;
  initialData?: Notebook;
  trigger: React.ReactNode;
}

const NotebookModal = ({ edit, onSave, initialData, trigger }: NotebookModalProps) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<NotebookFormData>({
    resolver: zodResolver(notebookSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
    },
  });

  const onSubmit = async (data: NotebookFormData) => {
    try {
      onSave({
        ...(edit && initialData ? initialData : {}),
        ...data,
        type: 'jupyter' // Default type
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error saving notebook:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Notebook" : "Add Notebook"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "Edit the notebook details below"
              : "Add a new notebook by filling out the form below"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notebook Title" {...field} value={field.value || ""} />
                  </FormControl>
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
                    <Input
                      placeholder="Brief description of the notebook"
                      {...field}
                      value={field.value || ""}
                    />
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
                    <Input
                      placeholder="https://colab.research.google.com/..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{edit ? "Save changes" : "Add notebook"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { NotebookModal }; 