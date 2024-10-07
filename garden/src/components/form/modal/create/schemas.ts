import { z } from "zod";

export const formSchema = z.object({
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
  description: z.string().min(1, { message: "Garden Description is required" }),
});

export type ModalUploadFormData = z.infer<typeof formSchema>;
