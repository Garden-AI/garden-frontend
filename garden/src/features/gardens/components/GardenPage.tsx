import React, { useState } from "react";

import { Link, useParams, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { LinkIcon, FlaskConicalIcon, FileTextIcon, DatabaseIcon, BookIcon, ExternalLinkIcon, EditIcon, PencilIcon, CodeIcon, ChevronDownIcon, ChevronUpIcon, SaveIcon, XIcon, CheckIcon, InfoIcon, PlusIcon, RefreshCcwIcon, ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

import Breadcrumb from "@/components/Breadcrumb";
import CopyButton from "@/components/CopyButton";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import GardenDropdownOptions from "@/features/gardens/components/GardenDropdownOptions";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import ShareModal from "@/components/ShareModal";
import TombstonePage from "@/components/TombstonePage";
import LoadingSpinner from "@/components/LoadingSpinner";
import Markdown from "@/components/Markdown";

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";
import { useQueryClient } from "@tanstack/react-query";
import { Garden, GardenPatchRequest } from "@/types";

import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import SaveGardenButton from "./SaveGardenButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";

const GardenPage = () => {
  const { doi } = useParams();
  if (!doi) {
    return <NotFoundPage />;
  }

  const [searchParams] = useSearchParams();
  const isNewlyCreated = searchParams.get('newlyCreated') === 'true';
  
  const auth = useGlobusAuth();
  const { data: garden, isLoading, isError } = useGetGarden(doi);
  const { mutate: updateGarden } = usePatchGarden();

  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (isError || !garden) {
    return <NotFoundPage />;
  }

  if (garden.is_archived) {
    return <TombstonePage garden={garden} />;
  }

  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;
  
  // Get datasets and papers from entrypoints
  const datasets = garden.entrypoints
    ?.map((entrypoint) => entrypoint.datasets || [])
    .flat()
    .filter((dataset, index, self) => {
      return index === self.findIndex((t) => t.doi === dataset.doi);
    }) || [];
  
  const papers = garden.entrypoints
    ?.map((entrypoint) => entrypoint.papers || [])
    .flat()
    .filter((paper, index, self) => {
      return index === self.findIndex((t) => t.doi === paper.doi);
    }) || [];

  // Newly created garden notice
  const ReviewNotice = () => {
    if (!isNewlyCreated || !ownsThisGarden) {
      return null;
    }

    return (
      <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200 mb-4">
        <div className="flex items-start gap-2">
          <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">We've pre-populated your garden's metadata</p>
            <p className="mt-1">Please review and edit the information to ensure it's accurate and complete.</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container max-w-7xl">
      <div className="mt-2 mb-4">
        <Breadcrumb
          crumbs={[
            { label: "Home", link: "/" },
            { label: "Gardens", link: "/gardens" },
            { label: garden.title, link: `/garden/${garden.doi}` },
          ]}
        />
      </div>
      
      {/* Display review notice for newly created gardens */}
      <ReviewNotice />
      
      {garden.is_test && ownsThisGarden && <VisibilityWarning garden={garden} updateGarden={updateGarden} />}
      
      {/* Hero Metadata Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Title, Description & Core Metadata */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <EditableTitle garden={garden} ownsThisGarden={ownsThisGarden} />
              <div className="flex gap-2">
                <SaveGardenButton garden={garden} />
                <ShareModal
                  doi={garden.doi}
                />
                <GardenDropdownOptions garden={garden} />
              </div>
            </div>
            
            {/* Description with Markdown */}
            <GardenDescription garden={garden} />
            
            {/* Functions, Datasets, and Papers tabs */}
            <div className="mt-6">
              <Tabs defaultValue="functions" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="functions">Functions</TabsTrigger>
                  <TabsTrigger value="datasets">Datasets</TabsTrigger>
                  <TabsTrigger value="papers">Papers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="functions" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {garden.entrypoints?.map((entrypoint, index) => (
                          <EntrypointBox
                            key={index}
                            entrypoint={entrypoint}
                          />
                        ))}
                        {garden.modal_functions?.map((modalFunction, index) => (
                          <ModalFunctionBox
                            key={index}
                            modalFunction={modalFunction}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="datasets" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div>
                        <h3 className="text-lg font-medium flex items-center mb-3">
                          <DatabaseIcon className="h-5 w-5 mr-2 text-blue-500" />
                          Datasets
                        </h3>
                        {datasets.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {datasets.map((dataset, index) => (
                              <a 
                                key={index} 
                                href={`https://doi.org/${dataset.doi}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    <p className="font-medium">{dataset.title}</p>
                                    <p className="text-sm text-gray-500 mt-1 font-mono">{dataset.doi}</p>
                                  </div>
                                  <ExternalLinkIcon className="h-4 w-4 text-gray-400 mt-1" />
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No datasets associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="papers" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div>
                        <h3 className="text-lg font-medium flex items-center mb-3">
                          <BookIcon className="h-5 w-5 mr-2 text-blue-500" />
                          Papers
                        </h3>
                        {papers.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {papers.map((paper, index) => (
                              <a 
                                key={index} 
                                href={`https://doi.org/${paper.doi}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    <p className="font-medium">{paper.title}</p>
                                    <p className="text-sm text-gray-500 mt-1 font-mono">{paper.doi}</p>
                                  </div>
                                  <ExternalLinkIcon className="h-4 w-4 text-gray-400 mt-1" />
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No papers associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Metadata Details */}
          <div className="lg:w-1/3 bg-gray-50 rounded-lg p-3">
            <div className="space-y-1">
              <MetadataCompletion garden={garden} ownsThisGarden={ownsThisGarden} />
              
              {/* DOI Field */}
              <div className="mt-2 group border border-transparent hover:border-gray-200 rounded-md py-1 px-1.5 -mx-1.5 transition-colors">
                <p className="text-sm text-gray-500">
                  DOI
                </p>
                <div className="flex items-center mt-0.5">
                  <p className="font-medium font-mono text-gray-800 flex-1 overflow-hidden overflow-ellipsis">
                    {garden.doi}
                  </p>
                  <CopyButton 
                    content={garden.doi} 
                    hint="Copy DOI" 
                    className="ml-2" 
                    icon={<ClipboardIcon className="h-4 w-4" />}
                  />
                </div>
              </div>
              
              <EditableMetadataField
                label="Authors"
                value={garden.authors}
                fieldName="authors"
                garden={garden}
                ownsThisGarden={ownsThisGarden}
                isArray={true}
              />
              
              <EditableMetadataField
                label="Year"
                value={garden.year}
                fieldName="year"
                garden={garden}
                ownsThisGarden={ownsThisGarden}
              />
              
              <EditableMetadataField
                label="Version"
                value={garden.version}
                fieldName="version"
                garden={garden}
                ownsThisGarden={ownsThisGarden}
              />
              
              <EditableTags
                garden={garden}
                ownsThisGarden={ownsThisGarden}
              />
              
              {/* Citation Block - Moved from sidebar to metadata section */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                    <BookIcon className="h-4 w-4 mr-1.5" /> Citation
                  </h3>
                  <CopyButton 
                    content={`@software{${garden.doi.split('/').pop()},
  author = {${garden.authors ? garden.authors.join(', ') : 'Authors not specified'}},
  title = {${garden.title}},
  year = {${garden.year || 'n.d.'}},
  publisher = {Garden AI},
  doi = {${garden.doi}}
}`}
                    hint="Copy Citation"
                    icon={<ClipboardIcon className="h-4 w-4" />}
                  />
                </div>
                <CitationBlock garden={garden} />
              </div>
              
              {!ownsThisGarden && (
                <div className="mt-4">
                  <Link 
                    to={`/garden/${encodeURIComponent(garden.doi)}/edit`} 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <EditIcon className="h-4 w-4 mr-1" /> Edit Metadata
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Editable Metadata Field Component
interface EditableMetadataFieldProps {
  label: string;
  value: string | string[] | undefined;
  fieldName: keyof GardenPatchRequest;
  garden: Garden;
  ownsThisGarden: boolean;
  isRequired?: boolean;
  isArray?: boolean;
  placeholder?: string;
  onSave?: () => void;
}

const EditableMetadataField = ({
  label,
  value,
  fieldName,
  garden,
  ownsThisGarden,
  isRequired = false,
  isArray = false,
  placeholder = "Not specified",
  onSave
}: EditableMetadataFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string | string[]>(value || (isArray ? [] : ""));
  const { mutate: updateGarden } = usePatchGarden();

  const displayValue = isArray 
    ? (Array.isArray(value) && value.length > 0 ? value.join(", ") : "None added") 
    : (value || placeholder);
  
  const handleSave = () => {
    // Validate based on field type
    if (fieldName === "title") {
      const value = inputValue as string;
      if (!value || value.length < 8) {
        toast.error("Title must be at least 8 characters");
        return;
      }
      if (value.length > 100) {
        toast.error("Title must not exceed 100 characters");
        return;
      }
    } else if (fieldName === "description") {
      const value = inputValue as string;
      if (!value || value.length < 10) {
        toast.error("Description must be at least 10 characters");
        return;
      }
      if (value.length > 1000) {
        toast.error("Description must not exceed 1000 characters");
        return;
      }
    } else if (fieldName === "authors") {
      const values = inputValue as string[];
      if (!values || values.length === 0) {
        toast.error("Please add at least one author");
        return;
      }
    } else if (fieldName === "year") {
      const value = inputValue as string;
      if (value && !/^\d{4}$/.test(value)) {
        toast.error("Year must be a 4-digit number");
        return;
      }
    } else if (fieldName === "version") {
      const value = inputValue as string;
      if (!value || !/^\d+\.\d+(\.\d+)?$/.test(value)) {
        toast.error("Version must be in the format x.y or x.y.z");
        return;
      }
    } else if (isRequired && (!inputValue || (Array.isArray(inputValue) && inputValue.length === 0))) {
      toast.error(`${label} is required`);
      return;
    }
    
    // Construct the patch request with only the field being updated
    const patchData: GardenPatchRequest = {
      [fieldName]: inputValue
    };
    
    updateGarden({
      doi: garden.doi,
      garden: patchData
    });
    
    setIsEditing(false);
    if (onSave) onSave();
  };
  
  const handleCancel = () => {
    setInputValue(value || (isArray ? [] : ""));
    setIsEditing(false);
  };

  if (!ownsThisGarden) {
    // Non-owners just see the display value
    return (
      <div className="group border border-transparent hover:border-gray-200 rounded-md py-0.5 px-1.5 -mx-1.5 transition-colors">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 flex items-center">
            {label}
          </p>
        </div>
        
        <div className={`font-medium ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-400 italic' : ''}`}>
          {displayValue}
        </div>
      </div>
    );
  }
  
  return (
    <div className="group border border-transparent hover:border-gray-200 rounded-md py-0.5 px-1.5 -mx-1.5 transition-colors">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 flex items-center">
          {label} 
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </p>
        
        {!isEditing && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                  aria-label={`Edit ${label}`}
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit {label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-1 space-y-2">
          {isArray ? (
            fieldName === 'authors' || fieldName === 'contributors' ? (
              <MultipleSelector
                value={(Array.isArray(inputValue) ? inputValue : []).map(val => ({ value: val, label: val }))}
                onChange={(options) => setInputValue(options.map(opt => opt.value))}
                placeholder={`Add ${fieldName}`}
                creatable
                className="w-full"
              />
            ) : (
              <Input 
                value={Array.isArray(inputValue) ? inputValue.join(", ") : ""}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Comma-separated values"
                className="w-full"
              />
            )
          ) : fieldName === 'description' ? (
            <Textarea 
              value={inputValue as string}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[80px]"
            />
          ) : (
            <Input 
              value={inputValue as string}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full"
            />
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSave} 
              className="flex items-center gap-1"
            >
              <SaveIcon className="h-3.5 w-3.5" /> Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <XIcon className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className={`font-medium ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-400 italic' : ''}`}>
          {displayValue}
        </div>
      )}
    </div>
  );
};

// Editable Tags Component
interface EditableTagsProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const EditableTags = ({ garden, ownsThisGarden }: EditableTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Option[]>(
    garden.tags?.map(tag => ({ label: tag, value: tag })) || []
  );
  const { mutate: updateGarden } = usePatchGarden();

  const handleSave = () => {
    const tagValues = selectedTags.map(tag => tag.value);
    
    updateGarden({
      doi: garden.doi,
      garden: { tags: tagValues }
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setSelectedTags(garden.tags?.map(tag => ({ label: tag, value: tag })) || []);
    setIsEditing(false);
  };

  if (!ownsThisGarden) {
    // Non-owners just see the display value
    return (
      <div>
        <p className="text-sm text-gray-500">Tags</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {garden.tags && garden.tags.length > 0 ? (
            garden.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white text-sm rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-400 italic">No tags added</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="group border border-transparent hover:border-gray-200 rounded-md p-1.5 -mx-1.5 transition-colors">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 flex items-center">
          Tags
        </p>
        
        {!isEditing && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                  aria-label="Edit tags"
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit tags</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-1 space-y-2">
          <MultipleSelector
            value={selectedTags}
            onChange={(newTags) => setSelectedTags(newTags)}
            placeholder="Add tags"
            creatable
            className="w-full"
          />
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSave} 
              className="flex items-center gap-1"
            >
              <SaveIcon className="h-3.5 w-3.5" /> Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <XIcon className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 mt-1">
          {garden.tags && garden.tags.length > 0 ? (
            garden.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white text-sm rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))
          ) : (
            <div className="flex items-center text-gray-400 italic">
              <span>No tags added</span>
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-3 w-3 mr-1" /> Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Garden Description Component with expand/collapse and Markdown
const GardenDescription = ({ garden }: { garden: Garden }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(garden.description || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateGarden } = usePatchGarden();
  const auth = useGlobusAuth();
  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;
  
  const descriptionText = garden.description || "No description provided.";
  const truncateLength = 150;
  const shouldTruncate = descriptionText.length > truncateLength;
  
  const handleSave = () => {
    // Validate description length
    if (!inputValue || inputValue.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }
    if (inputValue.length > 1000) {
      toast.error("Description must not exceed 1000 characters");
      return;
    }
    
    updateGarden({
      doi: garden.doi,
      garden: { description: inputValue }
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setInputValue(garden.description || "");
    setIsEditing(false);
  };

  if (isEditing && ownsThisGarden) {
    return (
      <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Edit Description</p>
        <Textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tell us about your garden"
          className="w-full min-h-[120px]"
        />
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="flex items-center gap-1"
          >
            <SaveIcon className="h-3.5 w-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <XIcon className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative group rounded-lg border p-3 hover:border-muted-foreground/20">
      {ownsThisGarden && (
        <div className="absolute right-3 top-3 flex gap-1">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                  aria-label="Edit description"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit description</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="mt-2">
        {garden.description && garden.description.length > 300 ? (
          <>
            <div className={`${isExpanded ? "" : "line-clamp-3"}`}>
              <Markdown content={garden.description} />
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-sm text-muted-foreground hover:text-primary flex items-center"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-1" /> Show More
                </>
              )}
            </button>
          </>
        ) : (
          <Markdown content={garden.description || ""} />
        )}
      </div>
    </div>
  );
};

// Citation Block Component
const CitationBlock = ({ garden }: { garden: Garden }) => {
  // Format citation as separate fields for better readability
  const citationId = garden.doi.split('/').pop();
  const authors = garden.authors ? garden.authors.join(', ') : 'Authors not specified';
  const title = garden.title;
  const year = garden.year || 'n.d.';
  const publisher = 'Garden AI';
  const doi = garden.doi;
  
  // Create the full citation text (for copying)
  const citationText = `@software{${citationId},
  author = {${authors}},
  title = {${title}},
  year = {${year}},
  publisher = {${publisher}},
  doi = {${doi}}
}`;

  return (
    <div className="space-y-2">
      <div className="p-3 bg-white border border-gray-200 rounded-md font-mono text-xs overflow-auto whitespace-pre-wrap">
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0">@software</div>
          <div>{`{${citationId},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">author</div>
          <div>{` = {${authors}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">title</div>
          <div>{` = {${title}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">year</div>
          <div>{` = {${year}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">publisher</div>
          <div>{` = {${publisher}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">doi</div>
          <div>{` = {${doi}}`}</div>
        </div>
        <div>{`}`}</div>
      </div>
    </div>
  );
};

const VisibilityWarning = ({ garden, updateGarden }: { garden: Garden; updateGarden: Function }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleMakePublic = () => {
    setIsLoading(true);
    
    updateGarden(
      {
        doi: garden.doi,
        garden: { is_test: false }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["gardens"] });
          queryClient.invalidateQueries({ queryKey: ["search"] });
          toast.success("Garden is now public");
          setIsLoading(false);
        },
        onError: (error: any) => {
          toast.error(`Error making garden public: ${error.message}`);
          setIsLoading(false);
        },
      }
    );
  };
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">This is a Test Garden</h3>
          <p className="text-amber-700 text-sm mt-1">
            This garden won't show up in search results. Other users can still access it directly if you share the link.
          </p>
        </div>
        <button
          onClick={handleMakePublic}
          disabled={isLoading}
          className="px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <LoadingSpinner /> Making public...
            </span>
          ) : (
            "Make Garden Public"
          )}
        </button>
      </div>
    </div>
  );
};

// Calculate metadata completion percentage and items needing attention
const calculateMetadataCompletion = (
  garden: Garden
): { 
  percentage: number; 
  incompleteFields: string[];
} => {
  const fieldStatuses: { [key: string]: boolean } = {
    title: !!garden.title,
    authors: !!garden.authors && garden.authors.length > 0,
    description: !!garden.description && garden.description.length >= 10,
    year: !!garden.year,
    version: !!garden.version,
    tags: !!garden.tags && garden.tags.length > 0,
  };
  
  const totalFields = Object.keys(fieldStatuses).length;
  const completeFields = Object.values(fieldStatuses).filter(Boolean).length;
  
  const incompleteFields = Object.entries(fieldStatuses)
    .filter(([_, isComplete]) => !isComplete)
    .map(([fieldName, _]) => fieldName);
    
  const percentage = Math.round((completeFields / totalFields) * 100);
  
  return { percentage, incompleteFields };
};

// Metadata Completion Indicator Component - shows a simple progress bar
interface MetadataCompletionProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const MetadataCompletion = ({ garden, ownsThisGarden }: MetadataCompletionProps) => {
  const { percentage, incompleteFields } = calculateMetadataCompletion(garden);
  
  if (!ownsThisGarden || percentage === 100) {
    return null;
  }
  
  const fieldLabels: { [key: string]: string } = {
    title: "Title",
    authors: "Authors",
    description: "Description",
    year: "Year",
    version: "Version",
    tags: "Tags",
  };
  
  return (
    <div className="mb-2">
      <div className="bg-white p-2 rounded-md border text-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-sm">Metadata Completion: {percentage}%</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${percentage < 50 ? 'bg-red-500' : percentage < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {incompleteFields.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Missing: {incompleteFields.map(field => fieldLabels[field]).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Create an editable title component
interface EditableTitleProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const EditableTitle = ({ garden, ownsThisGarden }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(garden.title);
  const { mutate: updateGarden } = usePatchGarden();

  const handleSave = () => {
    // Validate title according to zod schema requirements
    if (!inputValue || inputValue.trim().length < 8) {
      toast.error("Title must be at least 8 characters");
      return;
    }
    if (inputValue.length > 100) {
      toast.error("Title must not exceed 100 characters");
      return;
    }
    
    updateGarden({
      doi: garden.doi,
      garden: { title: inputValue }
    });
    
    setIsEditing(false);
    toast.success("Title updated");
  };
  
  const handleCancel = () => {
    setInputValue(garden.title);
    setIsEditing(false);
  };

  if (isEditing && ownsThisGarden) {
    return (
      <div className="flex flex-col gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-2xl font-bold w-full"
          placeholder="Garden Title"
        />
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="flex items-center gap-1"
          >
            <SaveIcon className="h-3.5 w-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <XIcon className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-bold">{garden.title}</h1>
      {ownsThisGarden && (
        <div className="flex items-center gap-1 h-8">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                  aria-label="Edit title"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit title</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default GardenPage;