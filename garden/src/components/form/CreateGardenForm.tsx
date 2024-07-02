import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodSchema, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GardenCreateRequest } from "@/api/types";
import { useCreateGarden, useGreetings } from "@/api";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).optional(),
  contributors: z.array(z.string()).optional(),
  doi: z.string(),
  doi_is_draft: z.boolean().nullable().optional(),
  description: z.string(),
  publisher: z.string(),
  year: z.string().optional(),
  language: z.string(),
  tags: z.array(z.string()).optional(),
  version: z.string(),
  entrypoint_aliases: z.record(z.string()).optional(),
  entrypoint_ids: z.array(z.string()).optional(),
  owner_identity_id: z.string().optional(),
}) satisfies ZodSchema<GardenCreateRequest>;

export default function CreateGardenForm() {
  const navigate = useNavigate();
  const createGarden = useCreateGarden();
  const { data } = useGreetings();
  console.log(data);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authors: [],
      contributors: [],
      doi: "",
      doi_is_draft: false,
      description: "",
      publisher: "",
      year: "2024",
      language: "en",
      tags: [],
      version: "1.0.0",
      entrypoint_aliases: {},
      entrypoint_ids: [],
      owner_identity_id: "",
    },
  });

  function onSaveAsDraft() {
    return onSubmit({ ...form.getValues(), doi_is_draft: true });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    createGarden.mutate(values);

    // if successful redirect to the new garden
    if (createGarden.isSuccess) {
      // redirect to the new
      toast.success("Garden created successfully!");
      navigate(`/garden/${createGarden.data.doi}`);
    } else {
      toast.warning("Error creating garden. Please fix errors.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-center text-3xl">Create a Garden</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garden Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Garden" {...field} />
                </FormControl>
                <FormDescription>
                  This is your Garden's public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garden Name</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your garden"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short description of your Garden.
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
                <FormLabel>DOI</FormLabel>
                <FormControl>
                  <Input placeholder="10.1234/abcd" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier for your Garden.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <FormControl>
                  <Input placeholder="Publisher" {...field} />
                </FormControl>
                <FormDescription>The publisher of your Garden.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="en" {...field} />
                </FormControl>
                <FormDescription>The language of your Garden.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0" {...field} />
                </FormControl>
                <FormDescription>The version of your Garden.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="tag1, tag2" {...field} />
                </FormControl>
                <FormDescription>
                  Tags to help categorize your Garden.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
          <Button type="button" variant="secondary" onClick={onSaveAsDraft}>
            Save as Draft
          </Button>
        </form>
      </Form>
    </div>
  );
}
