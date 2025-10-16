import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import {
  DatabaseIcon,
  BookIcon,
  CodeIcon,
  FunctionSquare,
  ScrollTextIcon,
  LucideIcon,
} from "lucide-react";
import { Garden } from "@/types";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import HpcFunctionCard from "@/features/functions/hpc/components/HpcFunctionCard";
import {
  useDatasetManagement,
  usePaperManagement,
  useRepositoryManagement,
  useNotebookManagement,
} from "@/features/materials/hooks/useMaterialManagement";
import { getUniqueItemCount } from "../utils/garden.utils";

import FunctionManager from "./garden-page/FunctionManager";

import { AddMaterialWithFunctionSelect, MaterialCardWithRemoval } from "@/features/materials";

const TabTrigger = ({
  icon: Icon,
  name,
  count,
  value,
}: {
  icon: LucideIcon;
  name: string;
  count: number;
  value: string;
}) => {
  return (
    <TabsTrigger
      value={value}
      className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4" />
        <span className="ml-1.5 hidden lg:block">{name}</span>
        {count > 0 && <span className="ml-1 hidden sm:inline">({count})</span>}
      </div>
    </TabsTrigger>
  );
};

export const GardenTabbedSection = ({
  garden,
  ownsThisGarden,
}: {
  garden: Garden;
  ownsThisGarden: boolean;
}) => {
  const {
    materials: datasets,
    refreshMaterials: refreshDatasets,
    findFunctionsWithMaterial: findDatasetFunctions,
  } = useDatasetManagement(garden);
  const {
    materials: papers,
    refreshMaterials: refreshPapers,
    findFunctionsWithMaterial: findPaperFunctions,
  } = usePaperManagement(garden);
  const {
    materials: repositories,
    refreshMaterials: refreshRepositories,
    findFunctionsWithMaterial: findRepositoryFunctions,
  } = useRepositoryManagement(garden);
  const {
    materials: notebooks,
    refreshMaterials: refreshNotebooks,
    findFunctionsWithMaterial: findNotebookFunctions,
  } = useNotebookManagement(garden);

  // Callback to refresh all materials after adding/updating/removing
  const handleMaterialsChange = useCallback(async () => {
    await Promise.all([
      refreshDatasets(),
      refreshPapers(),
      refreshRepositories(),
      refreshNotebooks(),
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
    <Tabs
      defaultValue={
        garden.modal_functions?.length || garden.hpc_functions?.length || garden.entrypoints?.length
          ? "functions"
          : datasets.length
            ? "datasets"
            : papers.length
              ? "papers"
              : notebooks.length
                ? "notebooks"
                : "functions"
      }
      className="flex w-full flex-col"
    >
      <TabsList className="mb-2 grid grid-cols-5 bg-gray-200 p-0.5">
        <TabTrigger
          icon={FunctionSquare}
          count={
            (garden.modal_functions?.length || 0) +
            (garden.hpc_functions?.length || 0) +
            (garden.entrypoints?.length || 0)
          }
          name="Functions"
          value="functions"
        />
        <TabTrigger
          icon={DatabaseIcon}
          count={getUniqueItemCount(garden.modal_functions, "datasets")}
          name="Datasets"
          value="datasets"
        />
        <TabTrigger
          icon={ScrollTextIcon}
          count={getUniqueItemCount(garden.modal_functions, "papers")}
          name="Papers"
          value="papers"
        />
        <TabTrigger
          icon={CodeIcon}
          count={getUniqueItemCount(garden.modal_functions, "repositories")}
          name="Repos"
          value="repositories"
        />
        <TabTrigger
          icon={BookIcon}
          count={getUniqueItemCount(garden.modal_functions, "notebooks")}
          name="Notebooks"
          value="notebooks"
        />
      </TabsList>

      <TabsContent value="functions" className="relative mt-0">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <FunctionSquare className="mr-2 h-5 w-5 text-green" />
                  Functions
                </h3>

                {ownsThisGarden && (
                  <FunctionManager garden={garden} onSuccess={handleMaterialAdded} />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {garden.entrypoints?.map((entrypoint, index) => (
                  <EntrypointBox key={index} entrypoint={entrypoint} />
                ))}
                {garden.modal_functions?.map((modalFunction, index) => (
                  <ModalFunctionBox
                    key={index}
                    modalFunction={modalFunction}
                    gardenDoi={garden.doi}
                  />
                ))}
                {garden.hpc_functions?.map((hpcFunction, index) => (
                  <HpcFunctionCard key={index} hpcFunction={hpcFunction} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="datasets" className="relative mt-0">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <DatabaseIcon className="mr-2 h-5 w-5 text-green" />
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
                  {datasets.map((dataset, index) => (
                    <MaterialCardWithRemoval
                      key={dataset.doi || index}
                      material={dataset}
                      materialType="dataset"
                      findAffectedFunctions={findDatasetFunctions}
                      ownsThisGarden={ownsThisGarden}
                      onMaterialUpdated={handleMaterialUpdated}
                      onMaterialRemoved={handleMaterialRemoved}
                      garden={garden}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No datasets associated with the functions in this garden
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="papers" className="relative mt-0">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <BookIcon className="mr-2 h-5 w-5 text-green" />
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
                  {papers.map((paper, index) => (
                    <MaterialCardWithRemoval
                      key={paper.doi || paper.title || index}
                      material={paper}
                      materialType="paper"
                      findAffectedFunctions={findPaperFunctions}
                      ownsThisGarden={ownsThisGarden}
                      onMaterialUpdated={handleMaterialUpdated}
                      onMaterialRemoved={handleMaterialRemoved}
                      garden={garden}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No papers associated with the functions in this garden
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="repositories" className="relative mt-0">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <CodeIcon className="mr-2 h-5 w-5 text-green" />
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
                  {repositories.map((repo, index) => (
                    <MaterialCardWithRemoval
                      key={repo.url || index}
                      material={repo}
                      materialType="repository"
                      findAffectedFunctions={findRepositoryFunctions}
                      ownsThisGarden={ownsThisGarden}
                      onMaterialUpdated={handleMaterialUpdated}
                      onMaterialRemoved={handleMaterialRemoved}
                      garden={garden}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No repositories associated with the functions in this garden
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notebooks" className="relative mt-0">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <ScrollTextIcon className="mr-2 h-5 w-5 text-green" />
                  Notebooks
                </h3>

                {ownsThisGarden && (
                  <AddMaterialWithFunctionSelect
                    garden={garden}
                    materialType="notebooks"
                    onSuccess={handleMaterialAdded}
                  />
                )}
              </div>

              {notebooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 py-2">
                  {notebooks.map((notebook, index) => (
                    <MaterialCardWithRemoval
                      key={notebook.url || index}
                      material={notebook}
                      materialType="notebook"
                      findAffectedFunctions={findNotebookFunctions}
                      ownsThisGarden={ownsThisGarden}
                      onMaterialUpdated={handleMaterialUpdated}
                      onMaterialRemoved={handleMaterialRemoved}
                      garden={garden}
                    />
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No notebooks associated with the functions in this garden
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
