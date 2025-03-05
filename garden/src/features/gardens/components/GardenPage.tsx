import React from "react";

import { Link, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseIcon, BookIcon, ExternalLinkIcon, EditIcon, ClipboardIcon } from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import CopyButton from "@/components/CopyButton";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import GardenDropdownOptions from "@/features/gardens/components/GardenDropdownOptions";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import ShareModal from "@/components/ShareModal";
import TombstonePage from "@/components/TombstonePage";

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";
import { Garden } from "@/types";

import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import SaveGardenButton from "./SaveGardenButton";

// Import extracted components
import {
  EditableMetadataField,
  EditableTags,
  GardenDescription,
  CitationBlock,
  VisibilityWarning,
  MetadataCompletion,
  EditableTitle,
  ReviewNotice
} from "./garden-page";

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
      <ReviewNotice 
        isNewlyCreated={isNewlyCreated} 
        ownsThisGarden={ownsThisGarden} 
      />
      
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

export default GardenPage;