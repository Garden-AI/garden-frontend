import { useState } from "react";
import { ModalFunction } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Card, CardContent, CardHeader, CardTitle, MarkdownCardContent } from "@/components/shadcn/card";
import { DatabaseIcon, BookIcon, CodeIcon, ScrollTextIcon, FileTextIcon, AppWindowIcon } from "lucide-react";
import { useModalFunctionMaterials } from "../hooks/useModalFunctionMaterials";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";

// We'll import the card components directly from the garden page components
import { 
  PaperCard, 
  DatasetCard, 
  RepositoryCard, 
  NotebookCard 
} from "@/features/gardens/components/garden-page";

interface AssociatedMaterialsProps {
  resource: ModalFunction;
}

const AssociatedMaterials = ({ resource }: AssociatedMaterialsProps) => {
  // Get all materials from the modal function
  const { datasets, papers, repositories, notebooks } = useModalFunctionMaterials(resource);
  
  // Create a fake Garden object with just the minimum required for the card components
  const fakeGarden = {
    doi: resource.doi || '',
    modal_functions: [resource],
  };

  return (
    <div className="mt-6 mb-6">
      <Tabs 
        defaultValue="function" 
        className="w-full min-h-[400px]"
      >
        <TabsList className="mb-2 bg-gray-100 p-0.5 grid grid-cols-6">
          <TabsTrigger value="function" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Function
          </TabsTrigger>
          <TabsTrigger value="apptext" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            App Text
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

        {/* Function Tab */}
        <TabsContent value="function" className="mt-0 relative p-4">
          <Card className="rounded-none bg-white p-4">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                {resource.function_name}
              </CardTitle>
              <MarkdownCardContent 
                className="mt-1 text-gray-600"
                content={resource.description || ""}
              />
            </CardHeader>
            <CardContent className="px-6 py-4">
              <SyntaxHighlighter>{resource.function_text}</SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* App Text Tab */}
        <TabsContent value="apptext" className="mt-0 relative p-4">
          {!resource.file_contents ? (
            <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
              <h2 className="text-xl font-semibold text-gray-800">No Full Text Available</h2>
              <p className="mt-2 text-gray-600">The complete source code for this modal function is not available.</p>
            </div>
          ) : (
            <div className="prose prose-sm mx-auto mt-8 lg:prose-base 2xl:prose-xl">
              <div className="py-8">
                <p className="text-gray-700">
                  This is the complete source code for this Modal function, including imports and any helper functions.
                </p>
              </div>
              <div className="relative">
                <div className="absolute right-4 top-4 z-10">
                  <CopyButton
                    hint="Copy full source"
                    content={resource.file_contents}
                    className="bg-white shadow-md hover:bg-gray-50"
                  />
                </div>
                <SyntaxHighlighter>
                  {resource.file_contents}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Datasets Tab */}
        <TabsContent value="datasets" className="mt-0 relative">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <DatabaseIcon className="h-5 w-5 mr-2 text-green" />
                    Datasets
                  </h3>
                </div>
                
                {datasets.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {datasets.map((dataset) => (
                      <DatasetCard 
                        key={dataset.doi} 
                        dataset={dataset}
                        isOwner={false}
                        garden={fakeGarden as any}
                        findAffectedFunctions={() => []}
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
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <BookIcon className="h-5 w-5 mr-2 text-green" />
                    Papers
                  </h3>
                </div>
                
                {papers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {papers.map((paper) => (
                      <PaperCard 
                        key={paper.doi || paper.title} 
                        paper={paper}
                        isOwner={false}
                        garden={fakeGarden as any}
                        findAffectedFunctions={() => []}
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
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <CodeIcon className="h-5 w-5 mr-2 text-green" />
                    Code Repositories
                  </h3>
                </div>
                
                {repositories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {repositories.map((repo) => (
                      <RepositoryCard 
                        key={repo.url} 
                        repository={repo}
                        isOwner={false}
                        garden={fakeGarden as any}
                        findAffectedFunctions={() => []}
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
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <ScrollTextIcon className="h-5 w-5 mr-2 text-green" />
                    Notebooks
                  </h3>
                </div>
                
                {notebooks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 py-2">
                    {notebooks.map((notebook) => (
                      <NotebookCard 
                        key={notebook.url} 
                        notebook={notebook}
                        isOwner={false}
                        garden={fakeGarden as any}
                        findAffectedFunctions={() => []}
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