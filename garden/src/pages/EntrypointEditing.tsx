import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePatchEntrypoint } from "../api/entrypoints/useEditEntrypoint";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { toast } from "sonner";
import MultipleSelector from "@/components/ui/multiple-select";
import { EntrypointCreateRequest } from "@/api/types";
import { useGetEntrypoint } from "@/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EntrypointEditing() {
  const { doi } = useParams() as { doi: string };
  const { data: entrypoint, isLoading } = useGetEntrypoint(doi);

  const nav = useNavigate();
  const location = useLocation();
  const currGarden = location.state?.garden;
  const { mutate: updateEntrypoint, isPending } = usePatchEntrypoint();
  const auth = useGlobusAuth();

  const [entrypointData, setEntrypointData] = useState<
    Partial<EntrypointCreateRequest>
  >({});

  useEffect(() => {
    if (entrypoint) {
      setEntrypointData({
        title: entrypoint.title || "",
        description: entrypoint.description || "",
        authors: entrypoint.authors || [],
        tags: entrypoint.tags || [],
      });
    }
  }, [entrypoint]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntrypointData({ ...entrypointData, [name]: value });
  };

  const handleSave = () => {
    if (!auth?.authorization?.user?.sub) {
      toast.error("You must be authenticated to save changes.");
      return;
    }
    if (!entrypointData.title?.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    const dataToSend: Partial<EntrypointCreateRequest> = {
      ...entrypoint,
      title: entrypointData.title,
      description: entrypointData.description,
      authors: entrypointData.authors,
      tags: entrypointData.tags,
    };

    updateEntrypoint({ doi, entrypoint: dataToSend });
  };

  if (isLoading || !entrypoint) {
    return <LoadingSpinner />;
  }

  const backToGardenPage = () => {
    nav(`/entrypoint/${encodeURIComponent(`${entrypoint.doi}`)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
      {isPending && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          {
            label: currGarden.title,
            link: `/garden/${encodeURIComponent(currGarden.doi)}`,
          },
          {
            label: entrypoint.title,
            link: `/entrypoint/${encodeURIComponent(entrypoint.doi)}`,
          },
          { label: `Edit "${entrypoint.title}"` },
        ]}
      />
      <h1 className="mb-4 text-2xl sm:text-3xl">Edit '{entrypoint.title}'</h1>
      <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={entrypointData.title || ""}
            onChange={handleInputChange}
            placeholder="Title"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            type="text"
            name="description"
            value={entrypointData.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
          />
        </div>

        <div className="space-y-2">
          <Label>Authors</Label>
          <MultipleSelector
            placeholder="Edit Authors"
            creatable
            value={entrypointData.authors?.map((author) => ({
              label: author,
              value: author,
            }))}
            onChange={(newValue) =>
              setEntrypointData({
                ...entrypointData,
                authors: newValue.map((item) => item.value),
              })
            }
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Tags</p>
          <MultipleSelector
            placeholder="Edit Tags"
            creatable
            value={entrypointData.tags?.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            onChange={(newValue) =>
              setEntrypointData({
                ...entrypointData,
                tags: newValue.map((item) => item.value),
              })
            }
            className="bg-white"
          />
        </div>
        <div className="flex flex-row justify-end">
          <button
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "mr-2 flex flex-row items-center gap-2 rounded-lg border border-green bg-white px-2 py-1 text-sm text-green",
            )}
            onClick={backToGardenPage}
            disabled={!auth?.authorization?.user?.sub}
          >
            Cancel
          </button>
          <button
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm",
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
}
