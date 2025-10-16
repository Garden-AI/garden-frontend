import React from "react";
import { GardenFunction, isModalFunction, isHpcFunction } from "../types/function.types";
import { Dataset, Paper, Repository, Notebook, ModalFunction } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { DatabaseIcon, BookIcon, CodeIcon, ScrollTextIcon, FileTextIcon, AppWindowIcon, PlusCircle, LucideIcon, FunctionSquare, TestTube } from "lucide-react";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/shadcn/button";
import { usePatchModalFunction } from "../../modal/api/usePatchModalFunction";
import { usePatchHpcFunction } from "../../hpc/api/usePatchHpcFunction";
import { toast } from "sonner";

// Import the modal components
import { DatasetModal } from "../../../materials/components/modals/DatasetModal";
import { PaperModal } from "../../../materials/components/modals/PaperModal";
import { RepositoryModal } from "../../../materials/components/modals/RepositoryModal";
import { NotebookModal } from "../../../materials/components/modals/NotebookModal";

// Import the card components
import { DatasetCard, PaperCard, RepositoryCard, NotebookCard } from "../../../materials/components/cards/MaterialCards";

interface AssociatedMaterialsProps {
  resource: GardenFunction;
  ownsThisFunction: boolean;
  doi?: string;
}

const TabTrigger = ({ icon: Icon, name, value, count }: { icon: LucideIcon, name: string, value: string, count?: number }) => {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
    >
      <div className="flex items-center justify-center">
        <Icon className="h-4 w-4" />
        <span className="hidden lg:block ml-1.5">{name}</span>
        {count !== undefined && count > 0 && (
          <span className="hidden sm:inline ml-1">({count})</span>
        )}
      </div>
    </TabsTrigger>
  );
};

const AssociatedMaterials = ({ resource, ownsThisFunction, doi }: AssociatedMaterialsProps) => {
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  // TODO: Refactor to avoid calling this hook when not an HPC function
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(isHpcFunction(resource) ? resource.id : -1);

  const datasets = resource.datasets || [];
  const papers = resource.papers || [];
  const repositories = resource.repositories || [];
  const notebooks = resource.notebooks || [];

  const handleAddMaterial = async (type: 'datasets' | 'papers' | 'repositories' | 'notebooks', material: Dataset | Paper | Repository | Notebook) => {
    try {
      const currentMaterials = resource[type] || [];
      const updatedMaterials = [...currentMaterials, material];

      if (isModalFunction(resource)) {
        await patchModalFunction({
          id: resource.id,
          modalFunction: { [type]: updatedMaterials }
        });
      } else if (isHpcFunction(resource)) {
        await patchHpcFunction({ [type]: updatedMaterials });
      }

      toast.success(`${type.slice(0, -1)} added successfully`);
    } catch (error) {
      toast.error(`Failed to add ${type.slice(0, -1)}`);
      console.error('Error adding material:', error);
    }
  };

  const handleUpdateMaterial = async (type: 'datasets' | 'papers' | 'repositories' | 'notebooks', index: number, material: Dataset | Paper | Repository | Notebook) => {
    try {
      const currentMaterials = resource[type] || [];
      const updatedMaterials = [...currentMaterials];
      updatedMaterials[index] = material;

      if (isModalFunction(resource)) {
        await patchModalFunction({
          id: resource.id,
          modalFunction: { [type]: updatedMaterials }
        });
      } else if (isHpcFunction(resource)) {
        await patchHpcFunction({ [type]: updatedMaterials });
      }

      toast.success(`${type.slice(0, -1)} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${type.slice(0, -1)}`);
      console.error('Error updating material:', error);
    }
  };

  const handleDeleteMaterial = async (type: 'datasets' | 'papers' | 'repositories' | 'notebooks', index: number) => {
    try {
      const currentMaterials = resource[type] || [];
      const updatedMaterials = currentMaterials.filter((_: any, i: number) => i !== index);

      if (isModalFunction(resource)) {
        await patchModalFunction({
          id: resource.id,
          modalFunction: { [type]: updatedMaterials }
        });
      } else if (isHpcFunction(resource)) {
        await patchHpcFunction({ [type]: updatedMaterials });
      }

      toast.success(`${type.slice(0, -1)} removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove ${type.slice(0, -1)}`);
      console.error('Error removing material:', error);
    }
  };

  return (
    <div className="mt-6">
      <Tabs
        defaultValue="function"
        className="w-full min-h-[400px]"
      >
        <TabsList className="mb-2 bg-gray-200 p-0.5 grid grid-cols-6">
          <TabTrigger
            icon={FunctionSquare}
            name="Function"
            value="function"
          />
          {isModalFunction(resource) && (
            <TabTrigger
              icon={FileTextIcon}
              name="App Text"
              value="apptext"
            />
          )}
          {isHpcFunction(resource) && resource.test_functions && resource.test_functions.length > 0 && (
            <TabTrigger
              icon={TestTube}
              name="Tests"
              value="tests"
              count={resource.test_functions.length}
            />
          )}
          <TabTrigger
            icon={DatabaseIcon}
            name="Datasets"
            value="datasets"
            count={datasets.length}
          />
          <TabTrigger
            icon={ScrollTextIcon}
            name="Papers"
            value="papers"
            count={papers.length}
          />
          <TabTrigger
            icon={CodeIcon}
            name="Repos"
            value="repositories"
            count={repositories.length}
          />
          <TabTrigger
            icon={BookIcon}
            name="Notebooks"
            value="notebooks"
            count={notebooks.length}
          />
        </TabsList>

        {/* Function Tab */}
        <TabsContent value="function" className="mt-0 relative p-4">
          <Card className="rounded-none bg-white p-4">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                {resource.function_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <SyntaxHighlighter>{resource.function_text}</SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Text Tab */}
        {isModalFunction(resource) && (
          <TabsContent value="apptext" className="mt-0 relative p-4">
            {!resource.file_contents ? (
              <div className="px-4 py-6 text-center sm:px-6">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-base font-medium text-gray-800">No Full Text Available</h2>
                <p className="mt-1 text-sm text-gray-600">The complete source code for this modal function is not available.</p>
              </div>
            ) : (
              <Card className="rounded-none bg-white">
                <CardHeader className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AppWindowIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Complete Source Code</span>
                    </div>
                    <CopyButton
                      hint="Copy full source"
                      content={resource.file_contents}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Includes all imports, helper functions, and dependencies for this Modal function.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <SyntaxHighlighter className="rounded-none text-sm">
                      {resource.file_contents}
                    </SyntaxHighlighter>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Tests Tab */}
        {isHpcFunction(resource) && resource.test_functions && resource.test_functions.length > 0 && (
            <TabsContent value="tests" className="mt-0 relative p-4">
                {resource.test_functions.map((testFunc, index) => (
                    <Card key={index} className="rounded-none bg-white p-4 mb-4">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-bold text-gray-800">
                                Test Function {index + 1}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 py-4">
                            <SyntaxHighlighter>{testFunc}</SyntaxHighlighter>
                        </CardContent>
                    </Card>
                ))}
            </TabsContent>
        )}

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="mt-0 relative">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <DatabaseIcon className="h-5 w-5 mr-2 text-green" />
                    Datasets
                  </h3>
                  {ownsThisFunction && (
                    <DatasetModal
                      context={{}}
                      onSave={(data) => handleAddMaterial('datasets', data)}
                      trigger={
                        <Button type="button" variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add dataset
                        </Button>
                      }
                    />
                  )}
                </div>

                {datasets.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {datasets.map((dataset, index) => (
                      <DatasetCard
                        key={dataset.doi || index}
                        dataset={dataset}
                        isOwner={ownsThisFunction}
                        context={{
                          parentFunction: resource as ModalFunction, // TODO: Refactor MaterialCards to be generic
                          parentDoi: doi
                        }}
                        onUpdate={(data) => handleUpdateMaterial('datasets', index, data)}
                        onDelete={() => handleDeleteMaterial('datasets', index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No datasets associated with this function</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Papers Tab */}
        <TabsContent value="papers" className="mt-0 relative">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <BookIcon className="h-5 w-5 mr-2 text-green" />
                    Papers
                  </h3>
                  {ownsThisFunction && (
                    <PaperModal
                      context={{ modalFunction: resource as ModalFunction }} // TODO: Refactor MaterialModals to be generic
                      onSave={(data) => handleAddMaterial('papers', data)}
                      trigger={
                        <Button type="button" variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add paper
                        </Button>
                      }
                    />
                  )}
                </div>

                {papers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {papers.map((paper, index) => (
                      <PaperCard
                        key={paper.doi || paper.title || index}
                        paper={paper}
                        isOwner={ownsThisFunction}
                        context={{
                          parentFunction: resource as ModalFunction, // TODO: Refactor MaterialCards to be generic
                          parentDoi: doi
                        }}
                        onUpdate={(data) => handleUpdateMaterial('papers', index, data)}
                        onDelete={() => handleDeleteMaterial('papers', index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No papers associated with this function</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repositories Tab */}
        <TabsContent value="repositories" className="mt-0 relative">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <CodeIcon className="h-5 w-5 mr-2 text-green" />
                    Repositories
                  </h3>
                  {ownsThisFunction && (
                    <RepositoryModal
                      context={{}}
                      onSave={(data) => handleAddMaterial('repositories', data)}
                      trigger={
                        <Button type="button" variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add repository
                        </Button>
                      }
                    />
                  )}
                </div>

                {repositories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {repositories.map((repo, index) => (
                      <RepositoryCard
                        key={repo.url || index}
                        repository={repo}
                        isOwner={ownsThisFunction}
                        context={{
                          parentFunction: resource as ModalFunction, // TODO: Refactor MaterialCards to be generic
                          parentDoi: doi
                        }}
                        onUpdate={(data) => handleUpdateMaterial('repositories', index, data)}
                        onDelete={() => handleDeleteMaterial('repositories', index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No repositories associated with this function</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notebooks Tab */}
        <TabsContent value="notebooks" className="mt-0 relative">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <ScrollTextIcon className="h-5 w-5 mr-2 text-green" />
                    Notebooks
                  </h3>
                  {ownsThisFunction && (
                    <NotebookModal
                      context={{}}
                      onSave={(data) => handleAddMaterial('notebooks', data)}
                      trigger={
                        <Button type="button" variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add notebook
                        </Button>
                      }
                    />
                  )}
                </div>

                {notebooks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {notebooks.map((notebook, index) => (
                      <NotebookCard
                        key={notebook.url || index}
                        notebook={notebook}
                        isOwner={ownsThisFunction}
                        context={{
                          parentFunction: resource as ModalFunction, // TODO: Refactor MaterialCards to be generic
                          parentDoi: doi
                        }}
                        onUpdate={async (updatedNotebook) => {
                          await handleUpdateMaterial('notebooks', index, updatedNotebook);
                        }}
                        onDelete={() => handleDeleteMaterial('notebooks', index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No notebooks associated with this function</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociatedMaterials; 