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
} from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-select";
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
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper DOI</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-l-none" placeholder="Paper DOI" />
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
                    <Input className="rounded-l-none" placeholder="Paper Citation" {...field} />
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
