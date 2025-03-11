import { Entrypoint } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { cn } from "@/utils/form.utils";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetEntrypoints } from "@/features/entrypoints/api/useGetEntrypoints";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "@/components/shadcn/card";
import { Code, Edit } from "lucide-react";

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
      className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white cursor-pointer"
      onClick={() => navigate(`/entrypoint/${text}`)}
    >
      <CardHeader className="pt-5 pb-2 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="text-green-500 bg-green-50 p-2 rounded-lg flex-shrink-0">
            <Code className="h-4 w-4" />
          </div>
          <CardTitle className="font-medium text-lg text-gray-800 tracking-tight">
            {entrypoint.title || "Untitled"}
          </CardTitle>
        </div>
      </CardHeader>
      
      <MarkdownCardContent 
        className="pt-4 pb-2 text-sm text-gray-700 max-h-[120px] overflow-hidden"
        content={entrypoint.description || "No description available"}
      />
      
      <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex justify-between items-center">
        {entrypoint.tags && entrypoint.tags.length > 0 && (
          <div className="flex gap-2 text-gray-600 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span>{entrypoint.tags?.join(", ")}</span>
          </div>
        )}
        
        {canEditEntrypoint && (
          <div className="ml-auto">
            <Button
              variant="ghost" 
              size="sm"
              className="text-xs bg-green-50 text-green-600 hover:bg-green-100 h-7 px-3 rounded-md border border-green-100 shadow-sm"
              onClick={handleEditEntrypointClick}
            >
              <span className="flex items-center">
                Edit
                <Edit className="h-3 w-3 ml-1.5" />
              </span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EntrypointBox;
