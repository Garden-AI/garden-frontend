import { MLIPTableRow } from "../components/types";

export const mockMLIPs: MLIPTableRow[] = [
  {
    architecture: "SevenNet",
    checkpoint: "SevenNet-MF-ompa",
    fpp: 64,
    matbench: 0.845,
    cost: 0.22,
    score: 0.9863,
  },
  {
    architecture: "MACE",
    checkpoint: "MACE-MPA-0",
    fpp: 64,
    matbench: 0.795,
    cost: 0.21,
    score: 0.9845,
  },
  {
    architecture: "MatterSim",
    checkpoint: "MatterSim v1 5M",
    fpp: 32,
    matbench: 0.767,
    cost: 0.01,
    score: 0.9579,
  },
  
];