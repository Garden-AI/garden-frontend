export interface MLIPTableRow {
  architecture: string;              // Model name
  checkpoint: string;                // Checkpoint string
  cps: number;                       // Combined Performance Score
  cloudCostPer10K: number | null;    // $ cost per 10k materials (null if N/A)
  hpcNodeHoursPer10K: number | null;   // node-hours per 1k materials (null if N/A)
  modelLink: string;                 // Internal link to function/model page
  checkpointLink: string;            // External link for checkpoint benchmark details
}