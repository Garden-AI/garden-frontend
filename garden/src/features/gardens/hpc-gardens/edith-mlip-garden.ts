import { Garden, ModalFunction } from "@/types";

const batchRelaxDescription = `
Start a batch relaxation job.

Params:
- xyz_file: str | Path
- model: str
- cluster_id: str
- relaxation_options: dict,

Returns:
- job_id: str
`;

const batchRelaxExampleUsage = `
import garden_ai

mlip_garden = garden_ai.get_garden("mlip-garden")

input_file = "./my_atoms.xyz"
cluster_id = "my-cluster-id"

job_id = mlip_garden.batch_relax(input_file, model="mace-mp-0", cluster_id=cluster_id)

# or with custom relaxation parameters
relax_opts = {"fmax": 0.1, "max_steps": 250}

job_id = mlip_garden.batch_relax(input_file, model="mattersim", cluster_id=cluster_id, relaxation_options=relax_opts)
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
  functionType: 'modal',
};

const getJobStatusDescription = `
Fetch the status of a batch relaxation job. 

Params:
- job_id: str

Returns:
- JobStatus dataclass
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
  functionType: 'modal',
};

const getResultsDescription = `
Retrieve results from a batch relaxation job.

This fetches the output xyz file from the remote endpoint and saves it locally.

Params:
- job_id: str globus-compute task-id for the remote job
- output_path: Path | str local path to save the output xyz file to

Returns:
- output_path
`;

const getResultsExampleUsage = `
import garden_ai

mlip_garden = garden_ai.get_garden("mlip-garden")
job_id = mlip_garden.batch_relax(...)
results_file_path = mlip_garden.get_results(job_id);
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
  functionType: 'modal',
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

### Optional Parameters
The \`batch_relax\` function also takes an optional relaxation parameters dictionary that can be passed as a keyword argument like \`relaxaxtion_options=my_params\`. For any optional parameter you do not include in relaxaxtion_options, the functions will use a reasonable default as specified below.

- General parameters
    - fmax
        - Description: The maximum force tolerance for convergence, in eV/Å. When a material is relaxed past this point, the optimizer can stop.
        - Type: float
        - Default: 0.05
    - max_steps
        - Description: The maximum number of optimization steps that will be applied to each material. If the material is not relaxed past its maximum force tolerance in max_steps steps, the partly relaxed material will still be included in the output.
        - Type: int
        - Default: 500
    - optimizer_type
        - Description: Specifies which structural degrees of freedom to relax.
            Use 'fire' to relax only atomic positions within a fixed lattice cell. This finds the lowest energy structure at a constant volume.
            Use 'frechet_cell_fire' to relax both atomic positions and the lattice cell (shape and volume). This is required to find the true ground-state structure of a periodic material.
        - Type: str enum. (Only ‘fire’ and ‘frechet_cell_fire’ are supported)
        - Default: “frechet_cell_fire” for MACE and SevenNet. “fire” for Mattersim. (Mattersim does not support frechet_cell_fire)
    - md_flavor
        - Description: Specifies the variant of the FIRE (Fast Inertial Relaxation Engine) algorithm. 'vv_fire' uses a velocity-Verlet based update scheme, while 'ase_fire' uses an implementation that mimics the popular ASE (Atomic Simulation Environment) library.
        - Type: str
        - Default: 'ase_fire'

- Frechet cell fire optimization parameters - only applicable when optimizer_type == “frechet_cell_fire”
    - hydrostatic_strain
        - Description: Constrains cell relaxation to be purely isotropic, meaning the cell changes volume but not shape (e.g., a cubic cell remains cubic). This is useful for finding the equilibrium volume of a crystal. This parameter should not be used simultaneously with constant_volume.
        - Type: bool
        - Default: False
    - constant_volume
        - Description: Allows the cell shape and angles to change during relaxation while keeping the total cell volume constant. This is useful for studying shear deformations or structural transformations at a specific volume.
        - Type: bool
        - Default: False
    - scalar_pressure
        - Description: An external isotropic pressure applied to the system in GPa. The optimizer will find a structure that is stable under this applied pressure. A positive value corresponds to compression.
        - Type: float
        - Default: 0.0
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
  hpc_function_ids: [],
  modal_functions: functions,
};

