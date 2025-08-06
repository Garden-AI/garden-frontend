export interface MLIPTableRow {
  architecture: string;              // Model name
  checkpoint: string;                // Checkpoint string
  cps: number;                       // Combined Performance Score
  cloudAvailable: boolean;           // Whether model is deployable on cloud
  cloudCostPerK: number | null;      // $ cost per 1k materials (null if N/A)
  hpcAvailable: boolean;             // Whether model is deployable on HPC
  hpcNodeHoursPerK: number | null;   // node-hours per 1k materials (null if N/A)
  modelLink: string;                 // Internal link to function/model page
  checkpointLink: string;            // External link for checkpoint benchmark details
}