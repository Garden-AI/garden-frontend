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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Book, Link, FileType } from "lucide-react";
import MultipleSelector from "@/components/ui/multiple-select";
import { Repository } from "@/api/types";

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  group: z.string().optional(),
});

const repositorySchema = z.object({
  repo_name: z.string().min(1, "Repository Name is required"),
  contributors: z.array(optionSchema).optional(),
  url: z.string().url("Must be a valid URL"),
});

type RepositoryFormData = z.infer<typeof repositorySchema>;

interface RepositoryModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: Repository) => void;
  initialData?: Repository;
  trigger: React.ReactNode;
}

export default function RepositoryModal({
  edit,
  onSave,
  initialData,
  trigger,
}: RepositoryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<RepositoryFormData>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      repo_name: initialData?.repo_name || "",
      url: initialData?.url || "",
      contributors:
        initialData?.contributors?.map((contributor) => ({
          value: contributor,
          label: contributor,
        })) || [],
    },
  });

  const handleSave = (data: RepositoryFormData) => {
    form.reset();
    onSave({
      ...data,
      contributors: data.contributors?.map((contributor) => contributor.value),
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle>
            {edit ? "Edit Repository" : "Add New Repository"}
          </DialogTitle>
          <DialogDescription>
            {edit
              ? "Make changes to your repository here."
              : "Enter the details of your repository here."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="repo_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Repository Name" {...field} />
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
                        placeholder="Repository URL"
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
              name="contributors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contributors</FormLabel>
                  <FormControl>
                    <MultipleSelector creatable {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" onClick={form.handleSubmit(handleSave)}>
                {edit ? "Save Changes" : "Add Repository"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
