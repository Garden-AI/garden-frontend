import { z } from "zod";

export const modalFunctionFormSchema = z.object({
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

  authors: z.array(z.string()).min(1, { message: "Please add at least one author." }),
  tags: z.array(z.string()),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Invalid year" })
    .optional(),
  example_usage: z
    .string()
    .max(2000, { message: "Example usage must not exceed 2000 characters" })
    .optional()
    .default(""),
  papers: z.array(z.any()).optional().default([]),
  repositories: z.array(z.any()).optional().default([]),
  datasets: z.array(z.any()).optional().default([]),
});

export type ModalFunctionPatchFormData = z.infer<typeof modalFunctionFormSchema>; 