import { Entrypoint } from "@/api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { NotebookViewer } from "./NotebookViewer";

export default function EntrypointTabs({
  entrypoint,
}: {
  entrypoint: Entrypoint;
}) {
  const tabs = [
    {
      name: "Entrypoint",
      content: (entrypoint: Entrypoint) => (
        <FunctionTab entrypoint={entrypoint} />
      ),
    },
    {
      name: "Notebook",
      content: (entrypoint: Entrypoint) => (
        <NotebookTab notebookURL={entrypoint.notebook_url} />
      ),
    },
    {
      name: "Datasets",
      content: (entrypoint: Entrypoint) => (
        <DatasetsTab datasets={entrypoint.datasets} />
      ),
    },
  ];
  return (
    <Tabs defaultValue="entrypoint" className="min-h-[400px] w-full">
      <TabsList className="m-0 grid w-full grid-cols-3 rounded-none bg-transparent p-0 ">
        {tabs?.map(({ name }) => (
          <TabsTrigger
            key={name}
            value={name.toLowerCase()}
            className="m-0 rounded-none border-b-4 border-transparent bg-gray-100 bg-gradient-to-b py-2 text-base text-black transition-none hover:border-primary hover:from-gray-100 hover:from-70% hover:to-primary data-[state=active]:border-green data-[state=active]:bg-primary/30 data-[state=active]:bg-none"
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ name, content }) => (
        <TabsContent key={name} value={name.toLowerCase()} className="p-4">
          {content(entrypoint)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DatasetsTab({ datasets }: { datasets?: any[] }) {
  if (!datasets || datasets.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">
          No Datasets Found
        </h2>
        <p className="mt-2 text-gray-600">
          There are no datasets linked to this resource.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-2 px-4 pt-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-4 ">
        {datasets?.map((dataset: any) => (
          <Card
            key={dataset.doi}
            className="rounded-lg border border-gray-200 shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {dataset.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-gray-600">Data Type:</span>{" "}
                {dataset.data_type || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">DOI:</span>{" "}
                <a
                  href={`https://doi.org/${dataset.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {dataset.doi}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex justify-start ">
              <Button variant="default" size={"sm"} asChild className="text-xs">
                <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                  View Dataset
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {datasets.some((dataset) =>
        dataset.url.toString().includes("foundry"),
      ) && (
        <div>
          <p className="mb-8 text-center text-lg">
            One or more of these datasets uses Foundry, here is how you can view
            it:
          </p>
          <div className="rounded-xl bg-gray-800 py-6 pl-6 text-white sm:mx-8 lg:mx-32">
            <code className="leading-loose">
              <span className="text-gray-400">
                # Make sure you've imported and instantiated foundry <br />
              </span>
              <span className="text-purple">from</span> foundry{" "}
              <span className="text-purple">import</span> Foundry <br />
              f = Foundry()
              <br />
              <br />
              <span className="text-gray-400">
                # Load the data here <br />
              </span>
              f.load(
              <span className="text-green">'DOI goes here'</span>, globus=
              <span className="text-orange">False</span>)
              <br />
              res = f.load_data()
            </code>
          </div>
          <p className="pt-8 text-center text-lg ">
            New to Foundry or need a refresher? Click{" "}
            <Link
              target="blank"
              to="https://ai-materials-and-chemistry.gitbook.io/foundry/"
              className="text-blue hover:underline"
            >
              here
            </Link>{" "}
            to learn more.
          </p>
        </div>
      )}
    </>
  );
}

function FunctionTab({ entrypoint }: { entrypoint: Entrypoint }) {
  return (
    <Card className=" rounded-none bg-white p-4">
      <CardHeader className=" px-6 py-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          {entrypoint.short_name}
        </CardTitle>
        <CardDescription className="mt-1 text-gray-600">
          {entrypoint.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <SyntaxHighlighter>{entrypoint.function_text}</SyntaxHighlighter>
      </CardContent>
    </Card>
  );
}

function NotebookTab({ notebookURL }: { notebookURL?: string }) {
  if (!notebookURL) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">No Notebook</h2>
        <p className="mt-2 text-gray-600">
          This entrypoint does not have a notebook associated with it.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 py-8">
        <p className="text-gray-700">
          This notebook contains the definition of this entrypoint, tagged with
          @garden_entrypoint. <br />
          When you execute the entrypoint, it runs in a Python session created
          by running every cell in this notebook once.
        </p>
      </div>
      <NotebookViewer notebookURL={notebookURL} />
    </>
  );
}
