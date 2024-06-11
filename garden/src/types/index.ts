type Garden = {
  title: string;
  authors: string[];
  contributors: string[];
  doi: string;
  description: string;
  publisher: string;
  year: string;
  language: string;
  tags: string[];
  version: string;
  entrypoints: Entrypoint[];
};

type Entrypoint = {
  authors: string[];
  base_image_uri?: string;
  container_uuid: string;
  datasets: Dataset[];
  description: string;
  doi: string;
  doi_is_draft: boolean;
  full_image_uri?: string;
  func_uuid: string;
  models: string[];
  notebook_url?: string;
  papers: Paper[];
  repositories: string[];
  short_name: string;
  steps: Step[];
  tags: string[];
  test_functions: string[];
  title: string;
  year: string;
};

type Dataset = {
  data_type?: string;
  doi: string;
  repository: string;
  title: string;
  url: string;
};

type Paper = {
  title: string;
  authors: string[];
  citation: string;
  doi: string;
};

type Step = {
  description: string;
  function_name: string;
  function_text: string;
};

type Notebook = {
  cells: {
    cell_type: string;
    metadata: any;
    execution_count?: number;
    source: string[];
    outputs?: any[];
  }[];
  metadata: any;
  nbformat: number;
  nbformat_minor: number;
};

// export types

export type { Garden, Entrypoint, Paper, Step, Notebook };
