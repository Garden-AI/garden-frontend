import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSearchGardenByDOI, useSearchGardens } from "../api/search";
import EntrypointBox from "../components/EntrypointBox";
import DatasetBoxEntrypoint from "../components/DatasetBoxEntrypoint";
import LoadingSpinner from "../components/LoadingSpinner";
import NotFoundPage from "./NotFoundPage";

const MetadataEditing = () => {
    const initialMetadata = {
        id: null,
        contributors: '',
        doi: '',
        description: '',
        entrypoints: '',
        datasets: '',
    };
    // get rid of the below states and use context to share them with GardenPage!!!!!!
    // or share from parent component (?)
    const [datasets, setDatasets] = useState<Array<Object>>([]);
    const [showFoundry, setShowFoundry] = useState(false);

    const [metadata, setMetadata] = useState(initialMetadata);
    const { doi } = useParams() as { doi: string }; // extract doi from url

    const { data: garden, isLoading, isError } = useSearchGardenByDOI(doi!);

    if (isLoading) {
        return <LoadingSpinner />;
      }
      if (isError || !garden) {
        return <NotFoundPage />;
      }

    const foundry = () => {
        setShowFoundry(true);
    };

    useEffect(() => {
        if (garden) {
            setMetadata({
                id: null,
                contributors: '',
                doi: garden.doi || '',
                description: '',
                entrypoints: '',
                datasets: '',
            });
        }
    }, [garden]);
    
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setMetadata({ ...metadata, [name]: value });
    };

    return (
        
        <div className="font-display flex flex-col gap-5 m-20">
            <h1 className="text-2xl sm:text-3xl">Edit {garden?.title}</h1>
            <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
                <div className="space-y-2">
                    <p className="text-gray-600">Contributors</p>
                    <input
                        type="text"
                        name="contributors"
                        value={garden?.contributors}
                        onChange={handleInputChange}
                        placeholder="Contributors"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Description</p>
                    <input
                        type="text"
                        name="description"
                        value={garden?.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="space-y-2">
                    <p className="text-gray-600">Entrypoints</p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {garden?.entrypoints.map((entrypoint: any) => (
                        <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} isEditing={true}/>
                        ))}
                    </div>
                    
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="space-y-2">
                    <p className="text-gray-600">Datasets</p>
                    <div className="grid grid-cols-1 gap-2 pb-4 sm:gap-12 md:grid-cols-2 lg:px-24">
                        {datasets.length > 0 ? (
                        datasets.map((dataset, index: number) => (
                            <DatasetBoxEntrypoint
                            dataset={dataset}
                            showFoundry={foundry}
                            key={index}
                            />
                        ))
                        ) : (
                            <p className="col-span-2 pb-16 pt-8 text-center text-base sm:text-xl">
                                No datasets available for this garden
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataEditing;
