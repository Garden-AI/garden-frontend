import { Entrypoint } from "@/types";
import { useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/shadcn/button";
import { cn } from "@/utils/form.utils";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetEntrypoints } from "@/features/entrypoints/api/useGetEntrypoints";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "@/components/shadcn/card";

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
    <Card
      className="cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => navigate(`/entrypoint/${text}`)}
    >
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle className="text-xl">{entrypoint.title || "Untitled"}</CardTitle>
          <div className="flex-end flex">
            {canEditEntrypoint && (
              <button
                onClick={handleEditEntrypointClick}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm",
                )}
              >
                Edit Function
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <MarkdownCardContent 
        className="max-h-[120px] overflow-hidden"
        content={entrypoint.description || "No description available"}
      />
      {entrypoint.tags && entrypoint.tags.length > 0 && (
        <CardFooter className="flex gap-2 text-black">
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
        </CardFooter>
      )}
    </Card>
  );
};

export default EntrypointBox;
