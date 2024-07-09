import { GardenCreateRequest as req } from "@/api/types";
import { z } from "zod";

export const gardenCreateRequestSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  authors: z
    .array(z.string().min(1, { message: "Please add at least one author." }))
    .optional(),
  contributors: z
    .array(
      z.string().min(1, { message: "Please add at least one contributor." }),
    )
    .optional(),
  doi: z.string(),
  doi_is_draft: z.boolean(),
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
  entrypoint_ids: z.array(z.string()).optional(),
  entrypoint_aliases: z.record(z.string()).optional(),
  owner_identity_id: z.string().length(32).optional(),
}) satisfies z.ZodType<req>;

export type GardenCreateRequest = z.infer<typeof gardenCreateRequestSchema>;
