import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DatabaseIcon, BookIcon, ClipboardIcon, FolderGit2 } from "lucide-react";
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

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";

import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import SaveGardenButton from "./SaveGardenButton";
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
  RepositoryCard
} from "./garden-page";

// Import our new hooks and context
import { MaterialsProvider } from '../contexts/MaterialsContext';
import { useDatasetManagement, usePaperManagement, useRepositoryManagement } from '../hooks/useMaterialManagement';

interface GardenContentProps {
  garden: ExtendedGarden;
  ownsThisGarden: boolean;
  isNewlyCreated: boolean;
  updateGarden: (data: Partial<ExtendedGarden>) => void;
}

const GardenContent = ({ garden, ownsThisGarden, isNewlyCreated, updateGarden }: GardenContentProps) => {
  // Use our new material management hooks
  const { materials: datasets, refreshMaterials, findFunctionsWithMaterial } = useDatasetManagement(garden);
  const { materials: papers } = usePaperManagement(garden);
  const { materials: repositories } = useRepositoryManagement(garden);

  // Callback to refresh data after adding materials
  const handleMaterialAdded = useCallback(() => {
    refreshMaterials();
  }, [refreshMaterials]);

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
      
      {garden.is_test && ownsThisGarden && <VisibilityWarning garden={garden} updateGarden={updateGarden} />}
      
      {/* Hero Metadata Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md border border-gray-100 p-6 mb-6">
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
              <Tabs 
                defaultValue={
                  garden.modal_functions?.length ? "functions" : 
                  datasets.length ? "datasets" : 
                  papers.length ? "papers" : 
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
                <CitationBlock garden={garden} />
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

  // Cast garden to ExtendedGarden to support our type definitions
  const extendedGarden = garden as ExtendedGarden;
  
  // Set current user ID on the garden object for ownership checks
  if (auth.isAuthenticated && auth?.authorization?.user?.sub) {
    extendedGarden.current_user_id = auth.authorization.user.sub;
  }
  
  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;

  return (
    <MaterialsProvider garden={extendedGarden} refetchGarden={refetch}>
      <GardenContent 
        garden={extendedGarden} 
        ownsThisGarden={ownsThisGarden} 
        isNewlyCreated={isNewlyCreated}
        updateGarden={updateGarden}
      />
    </MaterialsProvider>
  );
};

export default GardenPage;