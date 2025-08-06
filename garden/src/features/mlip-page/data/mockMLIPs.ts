import { MLIPTableRow } from "../components/types";

export const mockMLIPs: MLIPTableRow[] = [
  {
    architecture: "SevenNet",
    checkpoint: "SevenNet-MF-ompa",
    cps: 0.845,
    cloudAvailable: true,
    cloudCostPerK: 0.22,
    hpcAvailable: true,
    hpcNodeHoursPerK: 1.2,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/578",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/sevennet-mf-ompa",
  },
  {
    architecture: "MACE",
    checkpoint: "MACE-MPA-0",
    cps: 0.795,
    cloudAvailable: true,
    cloudCostPerK: 0.21,
    hpcAvailable: false,
    hpcNodeHoursPerK: null,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/574",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/mace-mpa-0",
  },
  {
    architecture: "MatterSim",
    checkpoint: "MatterSim v1 5M",
    cps: 0.767,
    cloudAvailable: false,
    cloudCostPerK: 0.01,
    hpcAvailable: true,
    hpcNodeHoursPerK: 0.9,
    modelLink: "/garden/10.26311%2Fcexg-2349/modal-functions/575",
    checkpointLink: "https://matbench-discovery.materialsproject.org/models/mattersim-v1-5M",
  },
];