import { gardenCreateRequestSchema } from "./RequestSchema";
import { z } from "zod";

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
    authors: z.array(optionSchema).optional(),
    contributors: z.array(optionSchema).optional(),
    entrypoint_ids: z.array(entrypointListItemSchema).nullable().optional(),
  })
  .omit({
    owner_identity_id: true,
    doi: true,
  });

export type FormSchemaType = z.infer<typeof formSchema>;
export type EntrypointListItem = z.infer<typeof entrypointListItemSchema>;
