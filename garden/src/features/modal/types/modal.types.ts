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
  repositories: z.array(
    z.object({
      repo_name: z.string(),
      url: z.string(),
      contributors: z.array(z.string()).optional(),
    }),
  ).optional().default([]),
  datasets: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      doi: z.string().nullable(),
      url: z.string().url("Must be a valid URL"),
      data_type: z.string().nullable(),
      repository: z.string().min(1, "Repository is required"),
    }),
  ).optional().default([]),
  papers: z.array(
    z.object({
      title: z.string(),
      authors: z.array(z.string()),
      doi: z.string().nullable(),
      citation: z.string().nullable(),
    }),
  ).optional().default([]),
});

export type ModalFunctionPatchFormData = z.infer<typeof modalFunctionFormSchema>; 