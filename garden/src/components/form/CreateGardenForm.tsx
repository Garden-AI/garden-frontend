import { useBlocker, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GardenCreateRequest } from "@/api/types";
import { useCreateGarden } from "@/api";

// Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const tagOptions: Option[] = [
  { value: "materials-science", label: "Materials Science" },
  { value: "biology", label: "Biology" },
];

const gardenCreateRequestSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must be at least 10 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  authors: z
    .array(z.string().min(1, { message: "Please add at least one author." }))
    .optional(),
  contributors: z
    .array(
      z.string().min(1, { message: "Please add at least one contributor." }),
    )
    .optional(),
  doi: z.string().regex(/^10\.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i, {
    message: "Invalid DOI format",
  }),
  doi_is_draft: z.boolean().nullable().optional(),
  description: z
    .string()
    .max(1000, { message: "Description must not exceed 1000 characters" }),
  publisher: z.string(),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Invalid year" })
    .optional(),
  language: z.string(),
  tags: z.array(z.string()).optional(),
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/, {
    message: "Version must be in the format x.y or x.y.z",
  }),
  entrypoint_aliases: z.record(z.string()).optional(),
  entrypoint_ids: z.array(z.string()).optional(),
  owner_identity_id: z.string().length(32).optional(),
}) satisfies z.ZodType<GardenCreateRequest>;

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
  group: z.string().optional(),
});

const formSchema = gardenCreateRequestSchema.extend({
  tags: z.array(optionSchema).optional(),
  authors: z.array(optionSchema).optional(),
  contributors: z.array(optionSchema).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateGardenForm() {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname &&
      Object.keys(form.formState.touchedFields).length > 0,
  );
  const isBlocked = blocker.state === "blocked";

  const navigate = useNavigate();
  const createGarden = useCreateGarden();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
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
      owner_identity_id: "123e4567e89b12d3a456426614174000",
    },
  });

  function onSaveAsDraft() {
    form.setValue("doi_is_draft", true);
    form.handleSubmit(onSubmit)();
  }

  const transformFormData = (data: FormSchemaType): GardenCreateRequest => ({
    ...data,
    tags: data.tags?.map((tag) => tag.label),
    authors: data.authors?.map((author) => author.label),
    contributors: data.contributors?.map((contributor) => contributor.label),
  });

  async function onSubmit(values: FormSchemaType) {
    const transformedValues = transformFormData(values);
    console.log("transformedValues", transformedValues);
    return;
    try {
      const result = await createGarden.mutateAsync(transformedValues);
      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(result.data.doi)}`);
    } catch (error) {
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
                <FormLabel>Description</FormLabel>
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
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authors</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    placeholder="Add authors"
                    creatable
                  />
                </FormControl>
                <FormDescription>
                  Authors involved in this garden.
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
                <FormLabel>Contributors</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    placeholder="Add contributors"
                    creatable
                  />
                </FormControl>
                <FormDescription>Contributors to this work.</FormDescription>
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
                  <MultipleSelector
                    {...field}
                    placeholder="Add tags to your garden"
                    creatable
                    defaultOptions={tagOptions}
                  />
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
        {
          <AlertDialog
            open={isBlocked}
            onOpenChange={(isOpen) => {
              if (!isOpen && blocker.state === "blocked") {
                blocker.reset();
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {/* Unsaved progress message */}
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes that will be lost if you leave this
                  page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    if (blocker.state === "blocked") blocker.reset();
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (blocker.state === "blocked") blocker.proceed();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      </Form>
    </div>
  );
}
