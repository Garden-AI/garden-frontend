import { GardenCreateRequest as req } from "@/api/types";
import { z } from "zod";

export const gardenCreateRequestSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(8, { message: "Title must be at least 8 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  doi: z.string(),
  doi_is_draft: z.boolean(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" })
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
  authors: z.array(z.string()),
  contributors: z.array(z.string()).optional(),

  entrypoint_ids: z.array(z.string()).optional(),
  entrypoint_aliases: z.record(z.string()).optional(),
  owner_identity_id: z.string().length(32).optional(),
}) satisfies z.ZodType<req>;

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
  group: z.string().optional(),
});

const entrypointListItemSchema = z.object({
  doi: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
});

export const formSchema = gardenCreateRequestSchema
  .extend({
    tags: z.array(optionSchema).optional(),
    authors: z
      .array(optionSchema)
      .min(1, { message: "Please add at least one author." }),
    contributors: z.array(optionSchema).optional(),
    entrypointIds: z.array(entrypointListItemSchema).nullable().optional(),
  })
  .omit({
    owner_identity_id: true,
    doi: true,
  });

export type GardenCreateRequest = z.infer<typeof gardenCreateRequestSchema>;
export type FormSchemaType = z.infer<typeof formSchema>;
export type EntrypointListItem = z.infer<typeof entrypointListItemSchema>;
