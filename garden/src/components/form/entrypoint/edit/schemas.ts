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

export type EntrypointPatchFormData = z.infer<typeof formSchema>;
