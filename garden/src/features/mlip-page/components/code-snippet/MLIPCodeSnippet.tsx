import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import {
  Card,
  CardContent,
} from "@/components/shadcn/card";
import SyntaxHighlighterComponent from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";
import "./MLIPCodeSnippet.css";

const cloudCode = `from garden_ai import GardenClient

gc = GardenClient()
mlip_garden = gc.get_garden("mlip-garden")

# Kick off an on-demand relaxation job on cloud GPUs.
mlip_garden.relax(
  xyz_file_path="candidate_structures.xyz", 
  model="mace",
  output_path="relaxed_structures.xyz",
)
`;

const hpcCode = `from garden_ai import GardenClient

gc = GardenClient()
mlip_garden = gc.get_garden("mlip-garden")

# If you have an allocation on ALCF EDTB (aka Edith), 
# Garden can kick off a relaxation job for you.
edith_ep_id = "a01b9350-e57d-4c8e-ad95-b4cb3c4cd1bb"
job_id = mlip_garden.batch_relax(
  xyz_file_path="candidate_structures.xyz", 
  model="mace-mpa-0",
  cluster_id=edith_ep_id
)

# poll for the status of the batch job
status = mlip_garden.get_job_status(job_id)

# retrieve the results when status is "completed"
results = mlip_garden.get_results(job_id)`;

const MLIPCodeSnippet = () => {
  const [mode, setMode] = useState<"cloud" | "hpc">("cloud");
  const code = mode === "cloud" ? cloudCode : hpcCode;

  return (
    <Card className="w-full max-w-lg shadow-xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-blue-50">
      <CardContent className="relative p-0">
        {/* Toggle */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Tabs defaultValue="cloud" onValueChange={(v) => setMode(v as "cloud" | "hpc")}>
            <TabsList className="inline-flex rounded-full bg-slate-200/60 p-1 shadow-inner">
              <TabsTrigger
                value="cloud"
                className="px-4 py-1.5 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-slate-800 transition-colors"
              >
                Cloud
              </TabsTrigger>
              <TabsTrigger
                value="hpc"
                className="px-4 py-1.5 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-slate-800 transition-colors"
              >
                HPC
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CopyButton
          content={code}
          className="absolute top-3 right-3 z-10 opacity-70 hover:opacity-100 transition"
        />

        <SyntaxHighlighterComponent className="!m-0">
          {code}
        </SyntaxHighlighterComponent>
      </CardContent>
    </Card>
  );
};

export default MLIPCodeSnippet;
