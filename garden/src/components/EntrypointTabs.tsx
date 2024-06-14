import { Entrypoint } from "@/types";
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
import SyntaxHighlighter from "react-syntax-highlighter";
import { NotebookViewer } from "./NotebookViewer";

export default function EntrypointTabs({
  entrypoint,
}: {
  entrypoint: Entrypoint;
}) {
  const tabs = [
    {
      name: "Steps",
      content: (entrypoint: Entrypoint) => <StepsTab entrypoint={entrypoint} />,
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
    <Tabs
      defaultValue="steps"
      className="min-h-[400px] w-full rounded-lg shadow-sm"
    >
      <TabsList className="grid w-full grid-cols-3 text-xl">
        {tabs.map(({ name }) => (
          <TabsTrigger key={name} value={name.toLowerCase()}>
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ name, content }) => (
        <TabsContent key={name} value={name.toLowerCase()} className="p-2">
          {content(entrypoint)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DatasetsTab({ datasets }: { datasets: any[] }) {
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
              {/* <CopyButton
                tooltipHint="Copy Citation"
                content={dataset.citation}
              /> */}
              <Button variant="default" size={"sm"} asChild className="text-xs">
                <Link to={dataset.url}>View Dataset</Link>
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

function StepsTab({ entrypoint }: { entrypoint: Entrypoint }) {
  return (
    <Tabs defaultValue={"0"} className="grid grid-cols-12 gap-x-6 py-6">
      <TabsList className="col-span-3 flex flex-col gap-y-2 rounded-md bg-gray-50 p-4">
        {entrypoint.steps.map((step: any, index: number) => (
          <TabsTrigger
            key={index}
            value={index.toString()}
            className="w-full rounded-md px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
          >
            {step.function_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {entrypoint.steps.map((step: any, index: number) => (
        <TabsContent
          value={index.toString()}
          className="col-span-9"
          key={index}
        >
          <Card key={index} className="rounded-md bg-white shadow-md">
            <CardHeader className="rounded-t-md bg-gray-50 px-6 py-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                {step.function_name}
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <SyntaxHighlighter language="python">
                {step.function_text}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
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
