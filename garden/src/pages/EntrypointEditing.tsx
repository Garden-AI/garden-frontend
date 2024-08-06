import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import NotFoundPage from "./NotFoundPage";
import { useUpdateCurrUserEntrypoint } from "../api/entrypoints/updateCurrUserEntrypoint";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { toast } from "sonner";
import MultipleSelector from "@/components/ui/multiple-select";
import { EntrypointCreateRequest } from "@/api/types";

export default function EntrypointEditing() {
    const nav = useNavigate();
    const location = useLocation();
    const currEntrypoint = location.state?.entrypoint;
    const currGarden = location.state?.garden;

    // console.log("Location state:", location.state); 
    // console.log("current entrypoint", currEntrypoint);
    // console.log("current entrypint doi: ", currEntrypoint.doi);
    // console.log("current garden: ", currGarden);  
    
    const { mutate: updateEntrypoint } = useUpdateCurrUserEntrypoint();
    const auth = useGlobusAuth();

    const [entrypointData, setEntrypointData] = useState<Partial<EntrypointCreateRequest>>({
        title: currEntrypoint!.title,
        description: currEntrypoint?.description || null, 
        authors: currEntrypoint?.authors || [],
        tags: currEntrypoint?.tags || [],
    });

    useEffect(() => {
        if (currEntrypoint) {
            setEntrypointData({
                title: currEntrypoint!.title,
                description: currEntrypoint.description || null,
                authors: currEntrypoint.authors || [],
                tags: currEntrypoint.tags || [],
            });
        }
    }, [currEntrypoint]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setEntrypointData({ ...entrypointData, [name]: value });
    };

    const handleSave = () => {      
        if (!auth?.authorization?.user?.sub) {
            toast.error("You must be authenticated to save changes.");
            return;
        }
        if (! entrypointData.title?.trim()) {
            toast.error("Title cannot be empty");
            return;
        }  

        console.log("inside handle save function, current entrypoint data: ", currEntrypoint);

        const dataToSend = {
            ...currEntrypoint,
            title: entrypointData.title,
            description: entrypointData.description,
            authors: entrypointData.authors,
            tags: entrypointData.tags,
        };
    
        updateEntrypoint({ entrypointDOI: currEntrypoint.doi, entrypointData: dataToSend });
    };
    
    

    if (!currEntrypoint) {
        return <LoadingSpinner />;
    }

    const backToGardenPage = () =>{
        nav(`/entrypoint/${encodeURIComponent(`${currEntrypoint.doi}`)}`);
    }

    return (
        <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
            <Breadcrumb
                crumbs={[
                    { label: "Home", link: "/" },
                    { label: "Gardens", link: "/search" },
                    { label: currGarden.title, link: `/garden/${encodeURIComponent(currGarden.doi)}` },
                    {
                        label: currEntrypoint.title,
                        link: `/entrypoint/${encodeURIComponent(currEntrypoint.doi)}`,
                    },
                    { label: `Edit "${currEntrypoint.title}"`},
                ]}
            />
            <h1 className="text-2xl sm:text-3xl mb-4">Edit '{currEntrypoint.title}'</h1>
            <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
                <div className="space-y-2">
                    <p className="text-gray-600">Authors</p>
                    <MultipleSelector
                        placeholder="Edit Authors"
                        creatable
                        value={entrypointData.authors?.map(author => ({ label: author, value: author }))}
                        onChange={(newValue) =>
                            setEntrypointData({
                                ...entrypointData,
                                authors: newValue.map(item => item.value),
                            })
                        }
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Title</p>
                    <input
                        type="text"
                        name="title"
                        value={entrypointData.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Description</p>
                    <input
                        type="text"
                        name="description"
                        value={entrypointData.description ?? ""}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Tags</p>
                    <MultipleSelector
                        placeholder="Edit Tags"
                        creatable
                        value={entrypointData.tags?.map(tag => ({ label: tag, value: tag }))}
                        onChange={(newValue) =>
                            setEntrypointData({
                                ...entrypointData,
                                tags: newValue.map(item => item.value),
                            })
                        }
                        className="bg-white"
                    />
                </div>
                <div className="flex flex-row justify-end">
                    <button
                        className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "flex flex-row items-center gap-2 rounded-lg border border-green px-2 py-1 text-sm mr-2 bg-white text-green"
                        )}
                        onClick={backToGardenPage}
                        disabled={!auth?.authorization?.user?.sub}
                    >
                    Cancel
                    </button>
                    <button
                        className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                        )}
                        onClick={() => handleSave()}
                        disabled={!auth?.authorization?.user?.sub}
                    >
                        Save Edits
                    </button>
                </div>
            </div>
        </div>
    );
};
