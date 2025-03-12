import { useParams, useNavigate } from "react-router-dom";

import { useGetModalFunction } from "../api/useGetModalFunction";
import { useGlobusAuth } from "@globus/react-auth-context";

import NotFoundPage from "@/components/NotFoundPage";

import { Separator } from "@/components/shadcn/separator";
import Breadcrumb from "@/components/Breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

import { LinkIcon, TagIcon, PencilIcon } from "lucide-react";
import { ModalFunction } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";

import CopyButton from "@/components/CopyButton";
import ShareModal from "@/components/ShareModal";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  MarkdownCardContent,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import AssociatedMaterials from "@/features/gardens/components/AssociatedMaterials";
import Markdown from "@/components/Markdown";

// Extend ModalFunction type to include owner_identity_id
type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
};

const ModalFunctionPage = () => {
  const { id } = useParams() as { id: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);

  if (isLoading) return <LoadingOverlay />;

  if (isError || !modalFunction) return <NotFoundPage />;

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6 font-display">
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <Breadcrumb 
            className="mb-3" 
            crumbs={[{ label: "Home", link: "/" }, { label: modalFunction.title }]} 
          />
          <ModalFunctionHeader modalFunction={modalFunction as ModalFunctionWithOwner} />
          <ModalFunctionBody modalFunction={modalFunction} />
          <ModalFunctionExample modalFunction={modalFunction} />
          <AssociatedMaterials resource={modalFunction} />
          <ModalFunctionTabs modalFunction={modalFunction} />
        </div>
        {/* Sidebar */}
        <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Metadata</h3>
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">DOI</p>
                <CopyButton 
                  content={modalFunction.doi} 
                  hint="Copy DOI" 
                  className="ml-2" 
                  icon={<LinkIcon className="h-4 w-4" />}
                />
              </div>
              <div className="mt-0.5">
                <p className="font-medium font-mono text-gray-800 overflow-hidden overflow-ellipsis">
                  {modalFunction.doi}
                </p>
              </div>
            </div>
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Authors</p>
              <p className="font-medium text-gray-800">{modalFunction.authors?.join(", ")}</p>
            </div>
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Contributors</p>
              <p className="font-medium text-gray-800">{modalFunction.authors?.join(", ")}</p>
            </div>
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Year</p>
              <p className="font-medium text-gray-800">{modalFunction.year}</p>
            </div>
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Tags</p>
              <p className="font-medium text-gray-800">{modalFunction.tags?.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalFunctionHeader = ({ modalFunction }: { modalFunction: ModalFunctionWithOwner }) => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();
  const isOwner = auth.isAuthenticated && modalFunction.owner_identity_id === auth?.authorization?.user?.sub;

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h1 className="text-xl md:text-2xl font-medium">{modalFunction.title}</h1>
      <div className="flex items-center gap-1">
        <CopyButton
          icon={<LinkIcon className="h-4 w-4" />}
          content={`${window.location.origin}/modal-functions/${modalFunction.id}`}
          hint="Copy Link"
          className="border-none bg-transparent"
        />
        {modalFunction.doi && <ShareModal doi={modalFunction.doi} />}
        {isOwner && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/modal-functions/${modalFunction.id}/edit`)}
                  className="h-8 w-8"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Function</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

const ModalFunctionBody = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  return (
    <div className="space-y-3 py-2">
      <div className="mt-2 bg-gray-50 rounded-md p-3">
        <Markdown content={modalFunction.description || ""} className="text-sm" />
      </div>

      <Separator className="my-3" />
    </div>
  );
};

const ModalFunctionExample = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  const functionText = modalFunction.function_text;

  // Create example text with fallback to default placeholder
  const exampleText = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

${modalFunction.example_usage || `input = ['Data Here']
return my_garden.${modalFunction.function_name}(input)`}`;

  return (
    <Card className="rounded-lg shadow-md bg-white p-4">
      <CardContent className="space-y-4 px-6 py-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold">Example Usage</h3>
            <CopyButton hint="Copy example code" content={exampleText} />
          </div>
          <SyntaxHighlighter className="rounded-md border border-gray-200 p-2 bg-gray-50">
            {exampleText}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};

const ModalFunctionTabs = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  const tabs = [
    {
      name: "Function",
      content: (modalFunction: ModalFunction) => <FunctionTab modalFunction={modalFunction} />,
    },
    {
      name: "App Text",
      content: (modalFunction: ModalFunction) => <FullTextTab modalFunction={modalFunction} />,
    },
    {
      name: "Datasets",
      content: (modalFunction: ModalFunction) => <DatasetsTab datasets={modalFunction.datasets} />,
    },
  ];
  return (
    <Tabs defaultValue="function" className="min-h-[400px] w-full">
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
          {content(modalFunction)}
        </TabsContent>
      ))}
    </Tabs>
  );
};

const FullTextTab = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  if (!modalFunction.file_contents) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">No Full Text Available</h2>
        <p className="mt-2 text-gray-600">The complete source code for this modal function is not available.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-sm mx-auto mt-8 lg:prose-base 2xl:prose-xl">
      <div className="py-8">
        <p className="text-gray-700">
          This is the complete source code for this Modal function, including imports and any helper functions.
        </p>
      </div>
      <div className="relative">
        <div className="absolute right-4 top-4 z-10">
          <CopyButton
            hint="Copy full source"
            content={modalFunction.file_contents}
            className="bg-white shadow-md hover:bg-gray-50"
          />
        </div>
        <SyntaxHighlighter>{modalFunction.file_contents}</SyntaxHighlighter>
      </div>
    </div>
  );
};

const DatasetsTab = ({ datasets }: { datasets?: any[] }) => {
  if (!datasets || datasets.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">No Datasets Found</h2>
        <p className="mt-2 text-gray-600">There are no datasets linked to this resource.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-2 px-4 pt-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-4 ">
        {datasets?.map((dataset: any) => (
          <Card key={dataset.doi} className="rounded-lg border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{dataset.title}</CardTitle>
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
                </a >
              </div >
            </CardContent >
            <CardFooter className="flex justify-start ">
              <Button variant="default" size={"sm"} asChild className="text-xs">
                <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                  View Dataset
                </a>
              </Button>
            </CardFooter>
          </Card >
        ))}
      </div >
    </>
  );
};

const FunctionTab = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  return (
    <Card className="rounded-none bg-white p-4">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          {modalFunction.function_name}
        </CardTitle>
        <MarkdownCardContent 
          className="mt-1 text-gray-600"
          content={modalFunction.description || ""}
        />
      </CardHeader>
      <CardContent className="px-6 py-4">
        <SyntaxHighlighter>{modalFunction.function_text}</SyntaxHighlighter>
      </CardContent>
    </Card>
  );
};

export default ModalFunctionPage;
