import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DatabaseIcon, BookIcon, ClipboardIcon, FolderGit2, Laptop } from "lucide-react";
import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Breadcrumb from "@/components/Breadcrumb";
import CopyButton from "@/components/CopyButton";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import GardenDropdownOptions from "@/features/gardens/components/GardenDropdownOptions";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import ShareModal from "@/components/ShareModal";
import TombstonePage from "@/components/TombstonePage";
import SaveGardenButton from "./SaveGardenButton";

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";

import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { MaterialsProvider } from '../contexts/MaterialsContext';
import { useDatasetManagement, usePaperManagement, useRepositoryManagement, useNotebookManagement } from '../hooks/useMaterialManagement';

// Import Garden from the root types directory
import { Garden } from "@/types";
import { ExtendedGarden } from "@/types/garden.types";

// Import extracted components
import {
  EditableMetadataField,
  EditableTags,
  GardenDescription,
  CitationBlock,
  VisibilityWarning,
  EditableTitle,
  ReviewNotice,
  AddMaterialWithFunctionSelect,
  DatasetCard,
  PaperCard,
  RepositoryCard,
  NotebookCard
} from "./garden-page";

interface GardenContentProps {
  garden: ExtendedGarden;
  ownsThisGarden: boolean;
  isNewlyCreated: boolean;
  updateGarden: (data: { doi: string; garden: Partial<ExtendedGarden> }) => void;
}

const GardenContent = ({ garden, ownsThisGarden, isNewlyCreated, updateGarden }: GardenContentProps) => {
  // Use our new material management hooks
  const { materials: datasets, refreshMaterials, findFunctionsWithMaterial } = useDatasetManagement(garden);
  const { materials: papers } = usePaperManagement(garden);
  const { materials: repositories } = useRepositoryManagement(garden);
  const { materials: notebooks } = useNotebookManagement(garden);

  // Callback to refresh data after adding materials
  const handleMaterialAdded = useCallback(() => {
    refreshMaterials();
  }, [refreshMaterials]);

  // Log notebooks for debugging
  console.log('Notebooks:', notebooks);

  return (
    <div className="container max-w-7xl">
      <div className="mt-2 mb-4">
        <Breadcrumb
          crumbs={[
            { label: "Home", link: "/" },
            { label: "Gardens", link: "/search" },
            { label: garden.title, link: `/garden/${garden.doi}` },
          ]}
        />
      </div>
      
      {/* Display review notice for newly created gardens */}
      <ReviewNotice 
        isNewlyCreated={isNewlyCreated} 
        ownsThisGarden={ownsThisGarden} 
      />
      
      {garden.is_test && ownsThisGarden && <VisibilityWarning garden={asGarden(garden)} updateGarden={updateGarden} />}
      
      {/* Hero Metadata Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Title, Description & Core Metadata */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <EditableTitle garden={asGarden(garden)} ownsThisGarden={ownsThisGarden} />
              <div className="flex gap-2">
                <SaveGardenButton garden={asGarden(garden)} />
                <ShareModal
                  doi={garden.doi}
                />
                <GardenDropdownOptions garden={asGarden(garden)} />
              </div>
            </div>
            
            {/* Description with Markdown */}
            <GardenDescription garden={asGarden(garden)} />
            
            {/* Functions, Datasets, Papers, and Notebooks tabs */}
            <div className="mt-6">
              <Tabs 
                defaultValue={
                  garden.modal_functions?.length ? "functions" : 
                  datasets.length ? "datasets" : 
                  papers.length ? "papers" : 
                  notebooks.length ? "notebooks" :
                  "functions"
                } 
                className="w-full"
              >
                <TabsList className="mb-2 bg-gray-100 p-0.5">
                  <TabsTrigger value="functions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Functions</TabsTrigger>
                  <TabsTrigger value="datasets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Datasets {datasets.length > 0 && `(${datasets.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="papers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Papers {papers.length > 0 && `(${papers.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="repositories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Repositories {repositories.length > 0 && `(${repositories.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="notebooks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Notebooks {notebooks.length > 0 && `(${notebooks.length})`}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="functions" className="mt-0 relative">
                  <Card className="border-0 shadow-none bg-transparent">
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
                
                <TabsContent value="datasets" className="mt-0 relative">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="pt-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <DatabaseIcon className="h-5 w-5 mr-2 text-green" />
                            Datasets
                          </h3>
                          
                          {ownsThisGarden && (garden.modal_functions?.length ?? 0) > 0 && (
                            <AddMaterialWithFunctionSelect
                              garden={garden}
                              materialType="datasets"
                              onSuccess={handleMaterialAdded}
                            />
                          )}
                        </div>
                        
                        {datasets.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8 py-2">
                            {datasets.map((dataset) => (
                              <DatasetCard 
                                key={dataset.doi || dataset.title} 
                                dataset={dataset} 
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findFunctionsWithMaterial}
                                onUpdate={refreshMaterials}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No datasets associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="papers" className="mt-0 relative">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="pt-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <BookIcon className="h-5 w-5 mr-2 text-green" />
                            Papers
                          </h3>
                          
                          {ownsThisGarden && (garden.modal_functions?.length ?? 0) > 0 && (
                            <AddMaterialWithFunctionSelect
                              garden={garden}
                              materialType="papers"
                              onSuccess={handleMaterialAdded}
                            />
                          )}
                        </div>
                        
                        {papers.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8 py-2">
                            {papers.map((paper) => (
                              <PaperCard 
                                key={paper.doi || paper.title} 
                                paper={paper} 
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findFunctionsWithMaterial}
                                onUpdate={refreshMaterials}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No papers associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="repositories" className="mt-0 relative">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="pt-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <FolderGit2 className="h-5 w-5 mr-2 text-green" />
                            Repositories
                          </h3>
                          
                          {ownsThisGarden && (garden.modal_functions?.length ?? 0) > 0 && (
                            <AddMaterialWithFunctionSelect
                              garden={garden}
                              materialType="repositories"
                              onSuccess={handleMaterialAdded}
                            />
                          )}
                        </div>
                        
                        {repositories.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8 py-2">
                            {repositories.map((repository) => (
                              <RepositoryCard 
                                key={repository.url || repository.repo_name} 
                                repository={repository} 
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findFunctionsWithMaterial}
                                onUpdate={refreshMaterials}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No repositories associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notebooks" className="mt-0 relative">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="pt-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <Laptop className="h-5 w-5 mr-2 text-green" />
                            Notebooks
                          </h3>
                          
                          {ownsThisGarden && (garden.modal_functions?.length ?? 0) > 0 && (
                            <AddMaterialWithFunctionSelect
                              garden={garden}
                              materialType="notebooks"
                              onSuccess={handleMaterialAdded}
                            />
                          )}
                        </div>
                        
                        {notebooks.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8 py-2">
                            {notebooks.map((notebook) => (
                              <NotebookCard 
                                key={notebook.url} 
                                notebook={notebook} 
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findFunctionsWithMaterial}
                                onUpdate={refreshMaterials}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No notebooks associated with this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Metadata Details */}
          <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Metadata</h3>
              
              {/* DOI Field */}
              <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 font-medium">
                    DOI
                  </p>
                  <CopyButton 
                    content={garden.doi} 
                    hint="Copy DOI" 
                    className="ml-2" 
                    icon={<ClipboardIcon className="h-4 w-4" />}
                  />
                </div>
                <div className="mt-0.5">
                  <p className="font-medium font-mono text-gray-800 overflow-hidden overflow-ellipsis">
                    {garden.doi}
                  </p>
                </div>
              </div>
              
              <EditableMetadataField
                label="Authors"
                value={garden.authors}
                fieldName="authors"
                garden={asGarden(garden)}
                ownsThisGarden={ownsThisGarden}
                isArray={true}
              />
              
              <EditableMetadataField
                label="Year"
                value={garden.year}
                fieldName="year"
                garden={asGarden(garden)}
                ownsThisGarden={ownsThisGarden}
              />
              
              <EditableMetadataField
                label="Version"
                value={garden.version}
                fieldName="version"
                garden={asGarden(garden)}
                ownsThisGarden={ownsThisGarden}
              />
              
              <EditableTags
                garden={asGarden(garden)}
                ownsThisGarden={ownsThisGarden}
              />
              
              {/* Citation */}
              <div className="mt-4 bg-white rounded-md p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 font-medium">Citation</p>
                  <CopyButton 
                    content={`@software{
  title = {${garden.title}},
  year = {${garden.year || 'n.d.'}},
  publisher = {Garden AI},
  doi = {${garden.doi}}
}`}
                    hint="Copy Citation"
                    icon={<ClipboardIcon className="h-4 w-4" />}
                  />
                </div>
                <CitationBlock garden={asGarden(garden)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GardenPage = () => {
  const { doi } = useParams();
  const [searchParams] = useSearchParams();
  const isNewlyCreated = searchParams.get('newlyCreated') === 'true';
  
  const auth = useGlobusAuth();
  const { data: garden, isLoading, isError, refetch } = useGetGarden(doi || '');
  const { mutate: patchGarden } = usePatchGarden();

  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (isError || !garden) {
    return <NotFoundPage />;
  }

  if (garden.is_archived) {
    return <TombstonePage garden={garden} />;
  }

  // Cast garden to ExtendedGarden to support our type definitions
  const extendedGarden: ExtendedGarden = {
    ...garden,
    current_user_id: auth.isAuthenticated ? auth?.authorization?.user?.sub : undefined,
    datasets: [],
    papers: [],
    repositories: [],
    notebooks: [],
    entrypoints: garden.entrypoints?.map(entrypoint => ({
      ...entrypoint,
      base_image_uri: entrypoint.base_image_uri || '',
      full_image_uri: entrypoint.full_image_uri || '',
      notebook_url: entrypoint.notebook_url || '',
      owner_identity_id: garden.owner_identity_id,
      doi_is_draft: entrypoint.doi_is_draft || false,
      modal_app_id: (entrypoint as any).modal_app_id || 0
    })),
    modal_functions: garden.modal_functions?.map(fn => ({
      ...fn,
      owner_identity_id: garden.owner_identity_id
    }))
  };
  
  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;

  const handleUpdateGarden = (data: Partial<ExtendedGarden>) => {
    patchGarden({
      doi: garden.doi,
      garden: data
    });
  };

  return (
    <MaterialsProvider garden={extendedGarden} refetchGarden={async () => { await refetch(); }}>
      <GardenContent 
        garden={extendedGarden} 
        ownsThisGarden={ownsThisGarden} 
        isNewlyCreated={isNewlyCreated}
        updateGarden={({ doi, garden: data }) => patchGarden({ doi, garden: data })}
      />
    </MaterialsProvider>
  );
};

// Add a type guard function to convert ExtendedGarden to Garden where needed
const asGarden = (garden: ExtendedGarden): Garden => {
  const { datasets, papers, repositories, notebooks, current_user_id, ...gardenProps } = garden;
  
  // Convert the entrypoints to the format expected by Garden
  const standardEntrypoints = garden.entrypoints?.map(ep => {
    const { 
      datasets, papers, repositories, notebooks,
      ...standardEntrypoint 
    } = ep;
    return standardEntrypoint;
  });
  
  return {
    ...gardenProps,
    entrypoints: standardEntrypoints as any, // Type assertion needed here
    modal_functions: garden.modal_functions as any // Type assertion needed here
  };
};

export default GardenPage;