import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EntrypointBox from "../components/EntrypointBox";
import LoadingSpinner from "../components/LoadingSpinner";
import NotFoundPage from "./NotFoundPage";
import { useUpdateGarden } from "../api/editgarden";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { toast } from "sonner";
import MultipleSelector from "@/components/ui/multiple-select";
import { useGetGarden } from "../api/gardens/useGetGarden";
import { GardenCreateRequest } from "@/api/types";

const MetadataEditing = () => {
    const { doi } = useParams() as { doi: string }; 
    const { data: currGarden, isLoading, isError } = useGetGarden(doi!);
    const { mutate: updateGarden } = useUpdateGarden();
    const auth = useGlobusAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [metadata, setMetadata] = useState<Partial<GardenCreateRequest>>({
        title: "",
        authors: [],
        contributors: [],
        description: "",
        entrypoint_ids: [],
        //tags: []
    });

    useEffect(() => {
        if (currGarden) {
            setMetadata({
                title: currGarden.title || "",
                contributors: currGarden.contributors || [],
                authors: currGarden.authors || [],
                description: currGarden.description || "",
                entrypoint_ids: currGarden.entrypoint_ids || [],
                //tags: currGarden.tags || []
            });
        }
    }, [currGarden]);

    useEffect(() => {
        if (isUpdating) {
            toast.loading("Updating garden...", { id: "updating-garden" });
        } else {
            toast.dismiss("updating-garden");
        }
    }, [isUpdating]);

    const handleSave = (updatedGardenData: any) => {
        if (!auth?.authorization?.user?.sub) {
            toast.error("You must be authenticated to save changes.");
            return;
        }
        setIsUpdating(true);

        const dataToSend = {
            ...currGarden,
            ...updatedGardenData,
            doi: doi,
        };

        updateGarden(
            { doi, garden: dataToSend },
            {
                onSuccess: () => {
                    setIsUpdating(false);
                },
                onError: () => {
                    setIsUpdating(false);
                },
            }
        );
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setMetadata({ ...metadata, [name]: value });
    };

    if (isLoading ) {
        return <LoadingSpinner />
    }
    
    if (isError || !currGarden) {
        return <NotFoundPage />;
    }

    return (
        <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
            <Breadcrumb
                crumbs={[
                    { label: "Home", link: "/" },
                    { label: "Gardens", link: "/search" },
                    {
                        label: currGarden.title,
                        link: `/garden/${encodeURIComponent(`${currGarden.doi}`)}`,
                    },
                    { label: "Edit Garden" },
                ]}
            />
            <h1 className="text-2xl sm:text-3xl mb-4">Edit '{currGarden?.title}'</h1>
            <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
                <div className="space-y-2">
                    <p className="text-gray-600">Title</p>
                    <input
                        type="text"
                        name="title"
                        value={metadata?.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Contributors</p>
                    <MultipleSelector
                        placeholder="Edit Contributors"
                        creatable
                        value={metadata.contributors?.map(contributor => ({ label: contributor, value: contributor }))}
                        onChange={(newValue) =>
                            setMetadata({
                                ...metadata,
                                contributors: newValue.map(item => item.value),
                            })
                        }
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Authors</p>
                    <MultipleSelector
                        placeholder="Edit Authors"
                        creatable
                        value={metadata.authors!.map(author => ({ label: author, value: author }))}
                        onChange={(newValue) =>
                            setMetadata({
                                ...metadata,
                                authors: newValue.map(item => item.value),
                            })
                        }
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Description</p>
                    <input
                        type="text"
                        name="description"
                        value={metadata?.description ?? ""}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                    />
                </div>
                {/* add in tags later
                <div className="space-y-2">
                    <p className="text-gray-600">Tags</p>
                    <MultipleSelector
                        placeholder="Edit Tags"
                        creatable
                        value={metadata.tags?.map(tag => ({ label: tag, value: tag }))}
                        onChange={(newValue) =>
                            setMetadata({
                                ...metadata,
                                tags: newValue.map(item => item.value),
                            })
                        }
                        className="bg-white"
                    />
                </div>
                    */}
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="space-y-2">
                    <p className="text-gray-600">Entrypoints</p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {currGarden?.entrypoints?.map((entrypoint: any) => (
                            <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} isEditing={true} />
                        ))}
                    </div>
                </div>
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="flex justify-end">
                    <button
                        className={cn(
                            buttonVariants({ variant: "default", size: "lg" }),
                            "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                        )}
                        onClick={() => handleSave(metadata)}
                        disabled={!auth?.authorization?.user?.sub}
                    >
                        Save Edits
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetadataEditing;