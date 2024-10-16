import { Entrypoint } from "@/api/types";
import { useNavigate, Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetEntrypoints } from "@/api";
import { useGlobusAuth } from "./auth/useGlobusAuth";

const EntrypointBox = ({ entrypoint }: { entrypoint: Entrypoint }) => {
  const navigate = useNavigate();
  const text = entrypoint?.doi ? entrypoint.doi.replace("/", "%2f") : "";
  const auth = useGlobusAuth();
  const { data: entrypoints } = useGetEntrypoints({
    owner_uuid: auth.authorization?.user?.sub,
  });

  if (!entrypoint) {
    return null;
  }

  const canEditEntrypoint =
    auth.authorization?.user && entrypoints?.some((e: Entrypoint) => e.doi === entrypoint.doi);

  const handleEditEntrypointClick = (e: any) => {
    e.stopPropagation();
    navigate(`/entrypoint/${encodeURIComponent(entrypoint?.doi)}/edit`);
  };

  return (
    <div
      className="flex flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm hover:cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/entrypoint/${text}`)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl">{entrypoint.title || "Untitled"}</h2>
          <div className="flex-end flex">
            {canEditEntrypoint && (
              <button
                onClick={handleEditEntrypointClick}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm",
                )}
              >
                Edit Entrypoint
              </button>
            )}
          </div>
        </div>
        <div className="max-h-[120px] overflow-y-hidden">
          <p className="h-[160px] overflow-y-hidden bg-gradient-to-b from-black to-white bg-clip-text text-transparent">
            {entrypoint.description || "No description available"}
          </p>
        </div>
      </div>
      {entrypoint.tags && entrypoint.tags.length > 0 ? (
        <div className="flex gap-2 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <div>
            <span>{entrypoint.tags?.join(", ")}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EntrypointBox;
