import { z } from "zod";

export const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  group: z.string().optional(),
});

// Base repository schema that matches the backend structure
export const repositoryApiSchema = z.object({
  repo_name: z.string().min(1, "Repository Name is required"),
  contributors: z.array(z.string()).optional(),
  url: z.string().url("Must be a valid URL"),
  license: z.string().optional().or(z.literal("")),
  version: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

// Form version of repository schema with MultipleSelector-compatible structure
export const repositoryFormSchema = repositoryApiSchema.extend({
  contributors: z.array(optionSchema).optional(),
}).transform((data) => ({
  ...data,
  // Transform the contributors back to string[] when submitting
  contributors: data.contributors?.map(c => c.value),
}));

export const datasetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  doi: z.string().nullable(),
  url: z.string().url("Must be a valid URL"),
  data_type: z.string().nullable(),
  repository: z.string().min(1, "Repository is required"),
});

export const paperSchema = z.object({
  title: z.string().min(1, "Paper Title is required").nullable(),
  authors: z.array(optionSchema).optional(),
  doi: z.string().nullable(),
  citation: z.string().nullable(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Main form schema that uses the API schema for validation
export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.string(),
  authors: z.array(z.string()),
  tags: z.array(z.string()),
  repositories: z.array(repositoryApiSchema),
  datasets: z.array(datasetSchema),
  papers: z.array(paperSchema),
});

// Export both the form and API types
export type RepositoryApiData = z.infer<typeof repositoryApiSchema>;
export type RepositoryFormData = z.infer<typeof repositoryFormSchema>;
export type DatasetFormData = z.infer<typeof datasetSchema>;
export type PaperFormData = z.infer<typeof paperSchema>;
export type EntrypointPatchFormData = z.infer<typeof formSchema>;

// Helper function to convert API data to form data
export const apiToFormRepository = (repo: RepositoryApiData): Omit<RepositoryFormData, 'contributors'> & {
  contributors: { value: string; label: string }[];
} => ({
  ...repo,
  contributors: repo.contributors?.map(c => ({ value: c, label: c })) || [],
});
