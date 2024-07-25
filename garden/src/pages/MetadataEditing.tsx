import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSearchGardenByDOI } from "../api/search/useSearchGardenByDOI";
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

const MetadataEditing = () => {
    const { doi } = useParams() as { doi: string }; // extract doi from url

    const { data: garden, isLoading, isError } = useSearchGardenByDOI(doi!);
    const { mutate: updateGarden } = useUpdateGarden();
    const auth = useGlobusAuth();

    interface GardenUpdateRequest{
        title: string;
        authors: string[];
        contributors: string[];
        description: string | null;
        entrypoint_ids: string[];
    }

    const [metadata, setMetadata] = useState<GardenUpdateRequest>({
        title: "",
        authors: [],
        contributors: [],
        description: "",
        entrypoint_ids: [],
    });

    const handleSave = (updatedGardenData: any) => {
        if (!auth?.authorization?.user?.sub) {
            toast.error("You must be authenticated to save changes.");
            return;
        }
        const dataToSend = {
            ...updatedGardenData,
            doi: doi,
        };
    
        console.log("Updating garden with data:", dataToSend);
        updateGarden({ doi, garden: dataToSend });    
    };    

    if (isLoading) {
        return <LoadingSpinner />;
      }
      if (isError || !garden) {
        return <NotFoundPage />;
      }

    useEffect(() => {
        if (garden) {
            setMetadata({
                title: garden.title || "",
                contributors: garden?.contributors || [],
                authors: garden?.authors || [],
                description: garden?.description || "",
                entrypoint_ids: [],
            });
        }
    }, [garden]);  

    
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setMetadata({ ...metadata, [name]: value });
    };
            

    return (
        <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
            <Breadcrumb
            crumbs={[
                { label: "Home", link: "/" },
                { label: "Gardens", link: "/search" },
                { label: garden.title,
                link: `/garden/${encodeURIComponent(`${garden.doi}`)}`, },
                { label: "Edit Garden" },
            ]}
            />
            <h1 className="text-2xl sm:text-3xl mb-4">Edit '{garden?.title}'</h1>
            <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
                <div className="space-y-2">
                    <p className="text-gray-600">Title</p>
                    <input
                        type="text"
                        name="title"
                        value={metadata?.title}
                        onChange={handleInputChange}
                        placeholder='Title'
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Contributors</p>
                    <MultipleSelector
                        placeholder="Edit Contributors"
                        creatable
                        value={metadata.contributors.map(contributor => ({ label: contributor, value: contributor }))}
                        onChange={(newValue) => setMetadata({
                        ...metadata,
                        contributors: newValue.map(item => item.value)
                        })}
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Authors</p>
                    <MultipleSelector
                        placeholder="Edit Authors"
                        creatable
                        value={metadata.authors.map(author => ({ label: author, value: author }))}
                        onChange={(newValue) => setMetadata({
                        ...metadata,
                        authors: newValue.map(item => item.value)
                        })}
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
                <hr className="h-px border-t-0 bg-gray-300 opacity-100 dark:opacity-100" />
                <div className="space-y-2">
                    <p className="text-gray-600">Entrypoints</p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {garden?.entrypoints?.map((entrypoint: any) => (
                        <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} isEditing={true}/>
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
