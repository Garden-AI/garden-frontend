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

# Connect to the Garden
client = GardenClient()

# Get the MLIP by its DOI
auth_mlip = client.get_garden("10.23677/mlip-example")

# Relax a crystal structure on Garden Cloud
result = auth_mlip.relax("my.cif")
print(result)`;

const hpcCode = `from garden_ai import GardenClient

# Connect to the Garden
client = GardenClient()

# Get the MLIP by its DOI
auth_mlip = client.get_garden("10.23677/mlip-example")

# Submit a batch relaxation job to ALCF
job = auth_mlip.submit_hpc_job("structures.zip", cluster="ThetaGPU")
print(job.status())`;

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
