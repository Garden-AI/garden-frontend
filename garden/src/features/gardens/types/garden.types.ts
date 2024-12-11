import { z } from "zod";

export const gardenFormSchema = z
  .object({
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
    authors: z.array(z.string()).min(1, { message: "Please add at least one author." }),
    contributors: z.array(z.string()),
    tags: z.array(z.string()),

    entrypoint_ids: z.array(z.string()),
    entrypoint_aliases: z.record(z.string()).optional(),
    owner_identity_id: z.string(),
    publisher: z.string(),
    doi: z.string(),
    is_archived: z.boolean(),
    is_test: z.boolean(),
    modal: z.object({
      app_name: z.string(),
      base_image_name: z.string(),
      file_contents: z.string(),
      modal_functions: z.array(
        z.object({
          title: z.string().min(1, { message: "Function title is required" }),
          description: z.string(),
          function_name: z.string().min(1, { message: "Function name is required" }),
          is_archived: z.boolean(),
          year: z.string(),
          doi: z.string().nullable(),
          function_text: z.string(),
          authors: z.array(z.string()),
          tags: z.array(z.string()),
          test_functions: z.array(z.string()),
        }),
      ),
    }),
  })
  .superRefine(({ modal: { file_contents, app_name, modal_functions }, entrypoint_ids }, ctx) => {
    if (file_contents === "" && entrypoint_ids.length === 0) {
      ctx.addIssue({
        message: "Garden must have either a modal app or entrypoints.",
        code: "custom",
        path: ["modal", "file_contents"],
      });
      ctx.addIssue({
        message: "Garden must have either a modal app or entrypoints.",
        code: "custom",
        path: ["entrypoint_ids"],
      });
      return;
    }

    if (file_contents !== "") {
      if (app_name === "") {
        ctx.addIssue({
          message: "Could not find app name. Please re-upload a valid file.",
          code: "custom",
          path: ["modal", "app_name"],
        });
      }
      if (modal_functions.length === 0) {
        ctx.addIssue({
          message: "Could not find any functions. Please re-upload a valid file.",
          code: "custom",
          path: ["modal", "modal_functions"],
        });
      }
    }
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
