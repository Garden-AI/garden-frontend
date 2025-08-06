import { MLIPTableRow } from "../components/types";

export const mockMLIPs: MLIPTableRow[] = [
  {
    architecture: "SevenNet",
    checkpoint: "SevenNet-MF-ompa",
    cps: 0.986,
    cloudAvailable: true,
    cloudCostPerK: 0.22,
    hpcAvailable: true,
    hpcNodeHoursPerK: 1.2,
    modelLink: "/function/sevennet",
    checkpointLink: "https://matbench.example/SevenNet-MF-ompa",
  },
  {
    architecture: "MACE",
    checkpoint: "MACE-MPA-0",
    cps: 0.985,
    cloudAvailable: true,
    cloudCostPerK: 0.21,
    hpcAvailable: false,
    hpcNodeHoursPerK: null,
    modelLink: "/function/mace",
    checkpointLink: "https://matbench.example/MACE-MPA-0",
  },
  {
    architecture: "MatterSim",
    checkpoint: "MatterSim v1 5M",
    cps: 0.958,
    cloudAvailable: false,
    cloudCostPerK: null,
    hpcAvailable: true,
    hpcNodeHoursPerK: 0.9,
    modelLink: "/function/mattersim",
    checkpointLink: "https://matbench.example/MatterSim_v1_5M",
  },
];