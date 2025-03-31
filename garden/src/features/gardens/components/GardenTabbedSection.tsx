import { useCallback } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DatabaseIcon, BookIcon, CodeIcon, FunctionSquare, ScrollTextIcon, LucideIcon } from "lucide-react";
import { Garden } from "@/types";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import { useDatasetManagement, usePaperManagement, useRepositoryManagement, useNotebookManagement } from '@/features/materials/hooks/useMaterialManagement';
import {
    AddMaterialWithFunctionSelect,
    AddModalFunctionSelector,
    DatasetCard,
    PaperCard,
    RepositoryCard,
    NotebookCard
} from "./garden-page";


const TabTrigger = ({ icon: Icon, name, count, value }: { icon: LucideIcon, name: string, count: number, value: string }) => {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
        >
            <div className="flex items-center justify-between">
                <Icon className="h-4 w-4" />
                <span className="hidden lg:block ml-1.5">{name}</span>
                {count> 0 && (
                    <span className="hidden sm:inline ml-1">
                        ({count})
                    </span>
                )}
            </div>
        </TabsTrigger>
    );
};


export const GardenTabbedSection = ({ garden, ownsThisGarden }: { garden: Garden, ownsThisGarden: boolean }) => {
    const { materials: datasets, refreshMaterials: refreshDatasets, findFunctionsWithMaterial: findDatasetFunctions } = useDatasetManagement(garden);
    const { materials: papers, refreshMaterials: refreshPapers, findFunctionsWithMaterial: findPaperFunctions } = usePaperManagement(garden);
    const { materials: repositories, refreshMaterials: refreshRepositories, findFunctionsWithMaterial: findRepositoryFunctions } = useRepositoryManagement(garden);
    const { materials: notebooks, refreshMaterials: refreshNotebooks, findFunctionsWithMaterial: findNotebookFunctions } = useNotebookManagement(garden);

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
        <Tabs
            defaultValue={
                garden.modal_functions?.length ? "functions" :
                    datasets.length ? "datasets" :
                        papers.length ? "papers" :
                            notebooks.length ? "notebooks" :
                                "functions"
            }
            className="flex flex-col w-full"
        >
            <TabsList className="mb-2 bg-gray-200 p-0.5 grid grid-cols-5">
                <TabTrigger
                    icon={FunctionSquare}
                    count={garden.modal_functions?.length || 0}
                    name="Functions"
                    value="functions"
                />
                <TabTrigger
                    icon={DatabaseIcon}
                    count={garden.modal_functions?.reduce((uniqueDatasets, mf) => {
                        const datasetIds = new Set(mf.datasets?.map(d => d.doi || d.url) || []);
                        datasetIds.forEach(id => uniqueDatasets.add(id));
                        return uniqueDatasets;
                    }, new Set()).size || 0}
                    name="Datasets" 
                    value="datasets"
                />
                <TabTrigger
                    icon={ScrollTextIcon}
                    count={garden.modal_functions?.reduce((uniquePapers, mf) => {
                        const paperIds = new Set(mf.papers?.map(p => p.doi || p.title) || []);
                        paperIds.forEach(id => uniquePapers.add(id));
                        return uniquePapers;
                    }, new Set()).size || 0}
                    name="Papers"
                    value="papers"
                />
                <TabTrigger
                    icon={CodeIcon}
                    count={garden.modal_functions?.reduce((uniqueRepos, mf) => {
                        const repoUrls = new Set(mf.repositories?.map(r => r.url) || []);
                        repoUrls.forEach(url => uniqueRepos.add(url));
                        return uniqueRepos;
                    }, new Set()).size || 0}
                    name="Repos"
                    value="repositories"
                />
                <TabTrigger
                    icon={BookIcon}
                    count={garden.modal_functions?.reduce((uniqueNotebooks, mf) => {
                        const notebookUrls = new Set(mf.notebooks?.map(n => n.url) || []);
                        notebookUrls.forEach(url => uniqueNotebooks.add(url));
                        return uniqueNotebooks;
                    }, new Set()).size || 0}
                    name="Notebooks"
                    value="notebooks"
                />
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
                                        gardenDoi={garden.doi}
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
    );
}