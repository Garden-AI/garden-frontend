import React, { useState, useEffect } from "react";
import { Garden } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchGardenByDOI, useSearchGardens } from "../api/search";

const MetadataEditing = () => {
    const initialMetadata = {
        id: null,
        contributors: '',
        doi: '',
        description: '',
        entrypoints: '',
        datasets: '',
    };
    const [metadata, setMetadata] = useState(initialMetadata);
    const { doi } = useParams();
    const navigate = useNavigate();

    const { data: garden, isLoading, isError } = useSearchGardenByDOI("*");


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

    const handleInputChange = (e) => {
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
                        value={metadata.contributors}
                        onChange={handleInputChange}
                        placeholder="Contributors"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">DOI</p>
                    <input
                        type="text"
                        name="doi"
                        value={metadata.doi}
                        onChange={handleInputChange}
                        placeholder="DOI"
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
                    <input
                        type="text"
                        name="entrypoints"
                        value={metadata.entrypoints}
                        onChange={handleInputChange}
                        placeholder="Entrypoints"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="space-y-2">
                    <p className="text-gray-600">Datasets</p>
                    <input
                        type="text"
                        name="datasets"
                        value={metadata.datasets}
                        onChange={handleInputChange}
                        placeholder="Datasets"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default MetadataEditing;
