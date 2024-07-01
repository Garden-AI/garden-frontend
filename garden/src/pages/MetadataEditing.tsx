import React, { useState, useEffect } from "react";
import { Garden } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import  SampleGardenComponent from "../components/example";

const MetadataEditing = () => {
    const initialMetadata = {
        /* default values are prev vals*/
        id: null,
        contributors: '',
        doi: '',
        description: '',
        /* get fields from garden object????*/
    }
    const [metadata, setMetadata] = useState(initialMetadata);
    const { doi } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMetadata({ ...metadata, [name]: value });
    };
   
    return (
        <div className="font-display flex flex-col gap-5 m-20">
            {/*<SampleGardenComponent />*/}
            <h1 className = "text-2xl sm:text-3xl">Edit INSERT GARDEN TITLE HERE</h1>
            <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Contributors</p>
                        <input
                            type="text"
                            name="Contributors"
                            value={metadata.firstname}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">DOI</p>
                        <input
                            type="text"
                            name="doi"
                            value={metadata.lastname}
                            onChange={handleInputChange}
                            placeholder="doi" /*insert original doi*/
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Description</p>
                        <input
                            type="text"
                            name="description"
                            value={metadata.phone}
                            onChange={handleInputChange}
                            placeholder="description"
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Entrypoints</p>
                        <input
                            type="email"
                            name="Entrypoints"
                            value={metadata.email}
                            onChange={handleInputChange}
                            placeholder="Entrypoints"
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Datasets</p>
                        <input
                            type="text"
                            name="Datasets"
                            value={metadata.affiliations}
                            onChange={handleInputChange}
                            placeholder="Datasets"
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                </div>
            </div>
        </div>
    );
}

export default MetadataEditing;