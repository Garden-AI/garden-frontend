import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(8, { message: "Title must be at least 8 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must not exceed 1000 characters" }),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Invalid year" })
    .optional(),
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/, {
    message: "Version must be in the format x.y or x.y.z",
  }),
  authors: z.array(z.string()).min(1, { message: "Please add at least one author." }),
  contributors: z.array(z.string()),
  tags: z.array(z.string()),
  entrypoint_ids: z.array(z.string()),
});

export type GardenPatchFormData = z.infer<typeof formSchema>;
