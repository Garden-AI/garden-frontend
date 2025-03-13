import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useGetModalFunction } from "../api/useGetModalFunction";
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { useGlobusAuth } from "@globus/react-auth-context";

import NotFoundPage from "@/components/NotFoundPage";

import { Separator } from "@/components/shadcn/separator";
import Breadcrumb from "@/components/Breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";

import { LinkIcon, TagIcon, PencilIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon, XIcon } from "lucide-react";
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
import { EditableCodeField } from "@/components/EditableCodeField";

// Extend ModalFunction type to include owner_identity_id
type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
};

interface EditableMetadataFieldProps {
  label: string;
  value: string | string[] | undefined;
  fieldName: keyof ModalFunction;
  modalFunction: ModalFunction;
  ownsThisFunction: boolean;
  isArray?: boolean;
}

const EditableMetadataField = ({ label, value, fieldName, modalFunction, ownsThisFunction, isArray = false }: EditableMetadataFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(isArray ? (value as string[])?.join(", ") || "" : value || "");
  const { mutate: patchModalFunction } = usePatchModalFunction();

  const handleSave = () => {
    const newValue = isArray 
      ? (editValue as string).split(",").map((v: string) => v.trim()).filter(Boolean) 
      : editValue;
    patchModalFunction({
      id: modalFunction.id,
      modalFunction: {
        [fieldName]: newValue
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(isArray ? (value as string[])?.join(", ") || "" : value || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && fieldName !== "description") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!ownsThisFunction || !isEditing) {
    return (
      <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          {ownsThisFunction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="font-medium text-gray-800">
          {isArray ? (value as string[])?.join(", ") || "None" : value || "None"}
        </p>
      </div>
    );
  }

  return (
    <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <div className="flex gap-2">
        {fieldName === "description" ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            rows={3}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
        )}
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-7 px-2"
        >
          <XIcon className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-7 px-2"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

interface EditableTagsProps {
  modalFunction: ModalFunction;
  ownsThisFunction: boolean;
}

const EditableTags = ({ modalFunction, ownsThisFunction }: EditableTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(modalFunction.tags?.join(", ") || "");
  const { mutate: patchModalFunction } = usePatchModalFunction();

  const handleSave = () => {
    const newTags = editValue.split(",").map(tag => tag.trim()).filter(Boolean);
    patchModalFunction({
      id: modalFunction.id,
      modalFunction: {
        tags: newTags
      }
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(modalFunction.tags?.join(", ") || "");
    }
  };

  if (!ownsThisFunction || !isEditing) {
    return (
      <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Tags</p>
          {ownsThisFunction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {modalFunction.tags && modalFunction.tags.length > 0 ? (
            modalFunction.tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No tags</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-1">Tags</p>
      <div className="flex gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder="Enter tags separated by commas"
          className="flex-1"
        />
      </div>
    </div>
  );
};

const ModalFunctionPage = () => {
  const { id } = useParams() as { id: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);
  const auth = useGlobusAuth();
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
              label="Title"
              value={modalFunction.title}
              fieldName="title"
              modalFunction={modalFunction}
              ownsThisFunction={ownsThisFunction}
            />
            <EditableMetadataField
              label="Authors"
              value={modalFunction.authors}
              fieldName="authors"
              modalFunction={modalFunction}
              ownsThisFunction={ownsThisFunction}
              isArray={true}
            />
            <EditableMetadataField
              label="Year"
              value={modalFunction.year}
              fieldName="year"
              modalFunction={modalFunction}
              ownsThisFunction={ownsThisFunction}
            />
            <EditableTags
              modalFunction={modalFunction}
              ownsThisFunction={ownsThisFunction}
            />
          </div>
        </div>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionText = modalFunction.description || "No description provided.";

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={modalFunction.description}
        fieldName="description"
        modalFunction={modalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <Separator className="my-3" />
    </div>
  );
};

const ModalFunctionExample = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction; ownsThisFunction: boolean }) => {
  const { mutate: patchModalFunction } = usePatchModalFunction();
  
  // Create example text with fallback to default placeholder
  const defaultExample = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

input = ['Data Here']
return my_garden.${modalFunction.function_name}(input)`;

  const handleSave = (newValue: string) => {
    patchModalFunction({
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
