import { z } from "zod";

export const gardenFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z
    .string()
    .max(1000, { message: "Description must not exceed 1000 characters" }),

  authors: z.array(z.string()),
  contributors: z.array(z.string()),
  tags: z.array(z.string()),
  doi: z.string(), // Will be generated
  doi_is_draft: z.boolean(),
  is_archived: z.boolean(),
  year: z.string().optional(),
  language: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/, {
    message: "Version must be in the format x.y or x.y.z",
  }),
  publisher: z.string().optional(),
  entrypoint_ids: z.array(z.string()),
  owner_identity_id: z.string().optional(),
  modal_function_ids: z.array(z.number()).optional().default([]),
  modal: z.object({
    app_name: z.string().optional().default(""),
    file_contents: z.string().optional().default(""),
    modal_functions: z.array(z.any()).optional().default([]),
    base_image_name: z.string().optional().default(""),
  }),
});

export const modalFormSchema = z.object({
  fileContents: z.string().min(1, { message: "A file is required" }),

  modal_functions: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Function title is required" }),
        description: z.string(),
        function_name: z.string().min(1, { message: "Function name is required" }),
        year: z.string().min(4, { message: "Year must be 4 digits" }),
        doi: z.string().min(1, {
          message: "DOI is required",
        }),
        function_text: z.string().min(1, { message: "Function text is required" }),
        authors: z.array(z.string()),
        tags: z.array(z.string()),
        test_functions: z.array(z.string()),
      }),
    )
    .min(1, { message: "At least one function is required." }),
  title: z.string().min(1, { message: "Garden Title is required" }),
  app_name: z.string().min(1, { message: "App name is required" }),
  description: z.string().min(1, { message: "Garden Description is required" }),
});

export type ModalUploadFormData = z.infer<typeof modalFormSchema>;
export type GardenCreateFormData = z.infer<typeof gardenFormSchema>;
