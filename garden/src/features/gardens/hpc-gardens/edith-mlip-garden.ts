import { Garden, ModalFunction } from "@/types";

const batchRelaxDescription = `
Start a batch relaxation job.

Params:
- xyz_file: str | Path
- model: str
- cluster_id: str
- options: dict,

Returns:
- job_id: str
`;

const batchRelaxExampleUsage = `
import garden_ai

mlip_garden = garden_ai.get_garden("mlip-garden")

input_file = "./my_atoms.xyz"
cluster_id = "my-cluster-id"

job_id = mlip_garden.batch_relax(input_file, model="mace-mp-0", cluster_id=cluster_id)
`;

const batchRelax: ModalFunction = {
  is_archived: false,
    function_text: "",
  title: "Batch Relax",
  description: batchRelaxDescription,
  year: "2025",
  function_name: "batch_relax",
  example_usage: batchRelaxExampleUsage,
  id: 0,
  modal_app_id: 0,
  owner: "",
  owner_identity_id: "",
  hardware_spec: {},
  num_invocations: 0,
};

const getJobStatusDescription = `
Fetch the status of a batch relaxation job. 

Params:
- job_id: str

Returns:
- job status
`;

const getJobStatusExampleUsage = `
import garden_ai

mlip_garden = garden_ai.get_garden("mlip-garden")

job_id = mlip_garden.batch_relax(...)
status = mlip_garden.get_job_status(job_id);
`;

const getJobStatus: ModalFunction = {
  is_archived: false,
  function_text: "",
  title: "Get Job Status",
  description: getJobStatusDescription,
  year: "2025",
  function_name: "get_job_status",
  example_usage: getJobStatusExampleUsage,
  id: 1,
  modal_app_id: 0,
  owner: "",
  owner_identity_id: "",
  hardware_spec: {},
  num_invocations: 0,
};

const getResultsDescription = `
Retrieve results from a batch relaxation job.

Params:
- job_id: str

Returns:
- xyz_file: Path
`;

const getResultsExampleUsage = `
import garden_ai

mlip_garden = garden_ai.get_garden("mlip-garden")
job_id = mlip_garden.batch_relax(...)
results_file = mlip_garden.get_results(job_id);
`;

const getResults: ModalFunction = {
  is_archived: false,
  function_text: "",
  title: "Get Results",
  description: getResultsDescription,
  year: "2025",
  function_name: "get_results",
  example_usage: getResultsExampleUsage,
  id: 2,
  modal_app_id: 0,
  owner: "",
  owner_identity_id: "",
  hardware_spec: {},
  num_invocations: 0,
};

const functions: ModalFunction[] = [
  batchRelax,
  getJobStatus,
  getResults,
];

const gardenDescription = `
 A collection of MLIP models setup to run on HPCs.
 
 **Note:** Running Garden functions on HPC requires that you have an allocation on the HPC cluster
 you are trying to run on.
 
 Currently only runs on ALCF's Edith cluster. More HPC clusters are on the way!
 
 ### Example Usage
 
Due to the batch processing workflow and unknown queue times on HPCs, this garden's functions
follow a typical \`Submit Job -> Poll for Status -> Fetch Results\` flow common to batch processing systems.
\`\`\`python
import garden_ai

# pull down the Garden
mlip_garden = garden_ai.get_garden("mlip-garden");

# define the globus-compute endpoint id where you have an allocation
edith_ep_id = "a01b9350-e57d-4c8e-ad95-b4cb3c4cd1bb"

# submit the batch job to the target
input_file = "my_atoms.xyz"
job_id = mlip_garden.batch_relax(input_file, model="mace-mp-0", cluster_id=edith_ep_id)

# poll for the status of the batch job
status = mlip_garden.get_job_status(job_id)

# retrieve the results
results = mlip_garden.get_results(job_id)
\`\`\`
`

export const MLIPGarden: Garden = {
  title: "MLIP Garden",
  authors: [],
  contributors: ["Hayden Holbrook", "Will Engler", "Keqing He"],
  doi: "mlip-garden",
  doi_is_draft: false,
  description: gardenDescription,
  publisher: "Garden-AI",
  year: "2025",
  owner: "Hayden Holbrook",
  language: "en",
  version: "0.0.1",
  is_archived: false,
  owner_identity_id: "",
  id: 0,
  marked_for_deletion: null,
  state: "PUBLISHED",
  entrypoint_ids: [],
  modal_function_ids: functions.map((fn) => fn.id),
  modal_functions: functions,
};

