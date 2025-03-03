import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.string(),
  authors: z.array(z.string()),
  tags: z.array(z.string()),
  repositories: z.array(
    z.object({
      repo_name: z.string(),
      url: z.string(),
      contributors: z.array(z.string()).optional(),
    }),
  ),
  datasets: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      doi: z.string().nullable(),
      url: z.string().url("Must be a valid URL"),
      data_type: z.string().nullable(),
      repository: z.string().min(1, "Repository is required"),
    }),
  ),
  papers: z.array(
    z.object({
      title: z.string(),
      authors: z.array(z.string()),
      doi: z.string().nullable(),
      citation: z.string().nullable(),
    }),
  ),
});
export const datasetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  doi: z.string().nullable().optional(),
  url: z.string().url("Must be a valid URL"),
  data_type: z.string().nullable().optional(),
  repository: z.string().min(1, "Repository is required"),
  description: z.string().nullable().optional(),
});
const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  group: z.string().optional(),
});

export const repositorySchema = z.object({
  repo_name: z.string().min(1, "Repository Name is required"),
  contributors: z.array(optionSchema).optional(),
  url: z.string().url("Must be a valid URL"),
});

export const paperSchema = z.object({
  title: z.string().min(1, "Paper Title is required"),
  authors: z.array(optionSchema).optional(),
  doi: z.string().nullable().optional(),
  citation: z.string().nullable().optional(),
  url: z.string().url("Must be a valid URL").nullable().optional(),
  description: z.string().nullable().optional(),
});

export type PaperFormData = z.infer<typeof paperSchema>;
export type RepositoryFormData = z.infer<typeof repositorySchema>;
export type DatasetFormData = z.infer<typeof datasetSchema>;
export type EntrypointPatchFormData = z.infer<typeof formSchema>;
