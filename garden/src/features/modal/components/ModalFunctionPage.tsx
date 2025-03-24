import { useParams, useNavigate } from "react-router-dom";

import { useGetModalFunction } from "../api/useGetModalFunction";
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { useGlobusAuth } from "@globus/react-auth-context";

import NotFoundPage from "@/components/NotFoundPage";

import { Separator } from "@/components/shadcn/separator";
import Breadcrumb from "@/components/Breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

import { LinkIcon, PencilIcon } from "lucide-react";
import { ModalFunction } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import CopyButton from "@/components/CopyButton";
import ShareModal from "@/components/ShareModal";
import { Button } from "@/components/shadcn/button";
import ModalAssociatedMaterials from "@/features/materials/components/ModalAssociatedMaterials";
import { EditableCodeField } from "@/components/EditableCodeField";
import { Metadata, EditableMetadataField } from "@/components/shared/metadata";

// Extend ModalFunction type to include owner_identity_id
type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
};

const ModalFunctionPage = () => {
  const { id } = useParams() as { id: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);
  const auth = useGlobusAuth();
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const ownsThisFunction = auth.isAuthenticated && modalFunction?.owner_identity_id === auth?.authorization?.user?.sub;

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
          <ModalFunctionHeader modalFunction={modalFunction as ModalFunctionWithOwner} ownsThisFunction={ownsThisFunction} />
          <ModalFunctionBody modalFunction={modalFunction} ownsThisFunction={ownsThisFunction} />
          <ModalFunctionExample modalFunction={modalFunction} ownsThisFunction={ownsThisFunction} />
          <ModalAssociatedMaterials 
            resource={modalFunction} 
            ownsThisFunction={ownsThisFunction} 
          />
        </div>

        {/* Sidebar */}
        <Metadata entity={modalFunction} ownsThisEntity={ownsThisFunction}>
          <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">DOI</p>
              <CopyButton 
                content={modalFunction.doi || ""} 
                hint="Copy DOI" 
                className="ml-2" 
                icon={<LinkIcon className="h-4 w-4" />}
              />
            </div>
            <div className="mt-0.5">
              <p className="font-medium font-mono text-gray-800 overflow-hidden overflow-ellipsis">
                {modalFunction.doi || "No DOI"}
              </p>
            </div>
          </div>

          <EditableMetadataField
            label="Model Authors"
            helpText="Original authors of the models used by this function"
            value={modalFunction.authors}
            fieldName="authors"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={async (updateData) => {
              await patchModalFunction({
                id: modalFunction.id,
                modalFunction: updateData
              });
            }}
          />

          <EditableMetadataField
            label="Gardeners"
            helpText="Creator and contriubtors to this function and related materials"
            value={[modalFunction.owner, ...(modalFunction.contributors || [])]}
            fieldName="contributors"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={async (updateData) => {
              await patchModalFunction({
                id: modalFunction.id,
                modalFunction: updateData
              });
            }}
          />

          <EditableMetadataField
            label="Year"
            helpText="Year this function was published"
            value={modalFunction.year}
            fieldName="year"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            onUpdate={async (updateData) => {
              await patchModalFunction({
                id: modalFunction.id,
                modalFunction: updateData
              });
            }}
          />

          <EditableMetadataField
            label="Tags"
            helpText="Tags help users discover your functions"
            value={modalFunction.tags}
            fieldName="tags"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={async (updateData) => {
              await patchModalFunction({
                id: modalFunction.id,
                modalFunction: updateData
              });
            }}
          />
        </Metadata>
      </div>
    </div>
  );
};

const ModalFunctionHeader = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunctionWithOwner; ownsThisFunction: boolean }) => {
  const navigate = useNavigate();

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
        {ownsThisFunction && (
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

const ModalFunctionBody = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction; ownsThisFunction: boolean }) => {
  const { mutate: patchModalFunction } = usePatchModalFunction();

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={modalFunction.description || ""}
        fieldName="description"
        entity={modalFunction}
        ownsThisEntity={ownsThisFunction}
        onUpdate={async (updateData) => {
          await patchModalFunction({
            id: modalFunction.id,
            modalFunction: updateData
          });
        }}
      />
      <Separator className="my-3" />
    </div>
  );
};

const ModalFunctionExample = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction; ownsThisFunction: boolean }) => {
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  
  // Create example text with fallback to default placeholder
  const defaultExample = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

input = ['Data Here']
return my_garden.${modalFunction.function_name}(input)`;

  const handleSave = async (newValue: string) => {
    await patchModalFunction({
      id: modalFunction.id,
      modalFunction: {
        example_usage: newValue
      }
    });
  };

  return (
    <EditableCodeField
      label="Example Usage"
      value={modalFunction.example_usage || defaultExample}
      fieldName="example_usage"
      onSave={handleSave}
      ownsThisFunction={ownsThisFunction}
      language="python"
    />
  );
};

export default ModalFunctionPage;
