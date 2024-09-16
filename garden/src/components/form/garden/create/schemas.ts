import { z } from "zod";

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  group: z.string().optional(),
});

export const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(8, { message: "Title must be at least 8 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  doi_is_draft: z.boolean(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must not exceed 1000 characters" }),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Invalid year" })
    .optional(),
  language: z.string(),
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/, {
    message: "Version must be in the format x.y or x.y.z",
  }),
  authors: z
    .array(optionSchema)
    .min(1, { message: "Please add at least one author." }),
  contributors: z.array(optionSchema),
  tags: z.array(optionSchema),

  entrypoint_ids: z.array(
    z.object({
      doi: z.string(),
      title: z.string(),
      description: z.string().optional().nullable(),
    }),
  ),
  entrypoint_aliases: z.record(z.string()).optional(),
});

export type GardenCreateFormData = z.infer<typeof formSchema>;
