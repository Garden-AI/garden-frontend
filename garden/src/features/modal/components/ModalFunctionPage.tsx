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
import AssociatedMaterials from "./AssociatedMaterials";
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
          <div className="rounded-md border border-gray-200 p-2 bg-gray-50">
            <SyntaxHighlighter>
              {exampleText}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModalFunctionPage;
