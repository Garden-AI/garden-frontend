import {
  Card,
  CardContent,
} from "@/components/shadcn/card";
import SyntaxHighlighterComponent from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";
import "./MLIPCodeSnippet.css";

// Placeholder example demonstrating how to run an MLIP relaxation job.
// Replace this with the final code snippet when it is ready.
const exampleCode = `from garden_ai import GardenClient

# Connect to the Garden
client = GardenClient()

# Get the MLIP by its DOI
auth_mlip = client.get_garden("10.23677/mlip-example")

# Submit a relaxation job (cloud or HPC)
# ... your code here ...
`;

const MLIPCodeSnippet = () => {
  return (
    <Card className="w-full max-w-lg shadow-xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-blue-50">
      <CardContent className="relative p-0">
        <CopyButton
          content={exampleCode}
          className="absolute top-3 right-3 z-10 opacity-70 hover:opacity-100 transition"
        />
        {/* Highlighter already has its own padding & border */}
        <SyntaxHighlighterComponent className="!m-0">
          {exampleCode}
        </SyntaxHighlighterComponent>
      </CardContent>
    </Card>
  );
};

export default MLIPCodeSnippet;
