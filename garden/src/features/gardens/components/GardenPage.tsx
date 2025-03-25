import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DatabaseIcon, BookIcon, ClipboardIcon, CodeIcon, FunctionSquare, ScrollTextIcon } from "lucide-react";
import { useCallback } from 'react';

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
import { useGlobusAuth } from "@globus/react-auth-context";

import { MaterialsProvider } from '@/features/materials/contexts/MaterialsContext';
import { useDatasetManagement, usePaperManagement, useRepositoryManagement, useNotebookManagement } from '@/features/materials/hooks/useMaterialManagement';

import { Garden } from "@/types";

import {
  GardenDescription,
  CitationBlock,
  VisibilityWarning,
  EditableTitle,
  ReviewNotice,
  AddMaterialWithFunctionSelect,
  AddModalFunctionSelector,
  DatasetCard,
  PaperCard,
  RepositoryCard,
  NotebookCard
} from "./garden-page";

import { Metadata, EditableMetadataField } from "@/components/shared/metadata";

interface GardenContentProps {
  garden: Garden;
  ownsThisGarden: boolean;
  isNewlyCreated: boolean;
}

const GardenContent = ({ garden, ownsThisGarden, isNewlyCreated }: GardenContentProps) => {
  const { materials: datasets, refreshMaterials: refreshDatasets, findFunctionsWithMaterial: findDatasetFunctions } = useDatasetManagement(garden);
  const { materials: papers, refreshMaterials: refreshPapers, findFunctionsWithMaterial: findPaperFunctions } = usePaperManagement(garden);
  const { materials: repositories, refreshMaterials: refreshRepositories, findFunctionsWithMaterial: findRepositoryFunctions } = useRepositoryManagement(garden);
  const { materials: notebooks, refreshMaterials: refreshNotebooks, findFunctionsWithMaterial: findNotebookFunctions } = useNotebookManagement(garden);
  const { mutateAsync: patchGarden } = usePatchGarden();

  // Callback to refresh all materials after adding/updating/removing
  const handleMaterialsChange = useCallback(async () => {
    await Promise.all([
      refreshDatasets(),
      refreshPapers(),
      refreshRepositories(),
      refreshNotebooks()
    ]);
  }, [refreshDatasets, refreshPapers, refreshRepositories, refreshNotebooks]);

  const handleMaterialAdded = useCallback(async () => {
    await handleMaterialsChange();
  }, [handleMaterialsChange]);

  const handleMaterialUpdated = useCallback(async () => {
    await handleMaterialsChange();
  }, [handleMaterialsChange]);

  const handleMaterialRemoved = useCallback(async () => {
    await handleMaterialsChange();
  }, [handleMaterialsChange]);

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

      {garden.is_test && ownsThisGarden && <VisibilityWarning garden={garden} updateGarden={patchGarden} />}

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
                  <TabsTrigger value="functions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Functions {((garden.entrypoints?.length || 0) + (garden.modal_functions?.length || 0)) > 0 &&
                      `(${(garden.entrypoints?.length || 0) + (garden.modal_functions?.length || 0)})`}
                  </TabsTrigger>
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
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <FunctionSquare className="h-5 w-5 mr-2 text-green" />
                            Functions
                          </h3>
                          
                          {ownsThisGarden && (
                            <AddModalFunctionSelector
                              garden={garden}
                              onSuccess={handleMaterialAdded}
                            />
                          )}
                        </div>
                        
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
                                key={dataset.doi}
                                dataset={dataset}
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findDatasetFunctions}
                                onUpdate={handleMaterialUpdated}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No datasets associated with the functions in this garden</p>
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
                                findAffectedFunctions={findPaperFunctions}
                                onUpdate={handleMaterialUpdated}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No papers associated with the functions in this garden</p>
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
                            <CodeIcon className="h-5 w-5 mr-2 text-green" />
                            Code Repositories
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
                            {repositories.map((repo) => (
                              <RepositoryCard
                                key={repo.url}
                                repository={repo}
                                isOwner={ownsThisGarden}
                                garden={garden}
                                findAffectedFunctions={findRepositoryFunctions}
                                onUpdate={handleMaterialUpdated}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No repositories associated with the functions in this garden</p>
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
                            <ScrollTextIcon className="h-5 w-5 mr-2 text-green" />
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
                                findAffectedFunctions={findNotebookFunctions}
                                onUpdate={handleMaterialUpdated}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No notebooks associated with the functions in this garden</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Metadata Details */}
          <Metadata entity={garden} ownsThisEntity={ownsThisGarden}>
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
              label="Model Authors"
              helpText="Orginial authors of the models in this Garden"
              value={garden.authors}
              fieldName="authors"
              entity={garden}
              ownsThisEntity={ownsThisGarden}
              isArray={true}
              onUpdate={async (updateData) => {
                await patchGarden({
                  doi: garden.doi,
                  garden: updateData
                });
              }}
            />

            <EditableMetadataField
              label="Gardeners"
              helpText="Creator and contributors to this Garden"
              value={[garden.owner, ...(garden.contributors || [])]}
              fieldName="contributors"
              entity={garden}
              ownsThisEntity={ownsThisGarden}
              isArray={true}
              onUpdate={async (updateData) => {
                await patchGarden({
                  doi: garden.doi,
                  garden: updateData
                });
              }}
            />

            <EditableMetadataField
              label="Year"
              helpText="Year this Garden was created"
              value={garden.year}
              fieldName="year"
              entity={garden}
              ownsThisEntity={ownsThisGarden}
              onUpdate={async (updateData) => {
                await patchGarden({
                  doi: garden.doi,
                  garden: updateData
                });
              }}
            />

            <EditableMetadataField
              label="Version"
              helpText="Garden version"
              value={garden.version}
              fieldName="version"
              entity={garden}
              ownsThisEntity={ownsThisGarden}
              onUpdate={async (updateData) => {
                await patchGarden({
                  doi: garden.doi,
                  garden: updateData
                });
              }}
            />

            <EditableMetadataField
              label="Tags"
              helpText="Tags help users discover this Garden"
              value={garden.tags}
              fieldName="tags"
              entity={garden}
              ownsThisEntity={ownsThisGarden}
              isArray={true}
              onUpdate={async (updateData) => {
                await patchGarden({
                  doi: garden.doi,
                  garden: updateData
                });
              }}
            />

            {/* Citation */}
            <div className="mt-4 bg-white rounded-md p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">Cite this Garden</p>
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
          </Metadata>
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

  return (
    <MaterialsProvider garden={garden} refetchGarden={async () => { await refetch(); }}>
      <GardenContent
        garden={garden}
        ownsThisGarden={ownsThisGarden}
        isNewlyCreated={isNewlyCreated}
      />
    </MaterialsProvider>
  );
};

export default GardenPage;