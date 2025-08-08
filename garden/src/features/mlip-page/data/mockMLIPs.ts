import { MLIPTableRow } from "../components/types";

export const mockMLIPs: MLIPTableRow[] = [
  {
    architecture: "SevenNet",
    checkpoint: "SevenNet-MF-ompa",
    cps: 0.845,
    cloudCostPer10K: 2.21,
    hpcNodeHoursPer10K: 1.23,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/578",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/sevennet-mf-ompa",
  },
  {
    architecture: "MACE",
    checkpoint: "MACE-MPA-0",
    cps: 0.795,
    cloudCostPer10K: 2.14,
    hpcNodeHoursPer10K: 0.99,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/574",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/mace-mpa-0",
  },
  {
    architecture: "MatterSim",
    checkpoint: "MatterSim v1 5M",
    cps: 0.767,
    cloudCostPer10K: 0.12,
    hpcNodeHoursPer10K: 1.0,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/575",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/mattersim-v1-5M",
  },
];