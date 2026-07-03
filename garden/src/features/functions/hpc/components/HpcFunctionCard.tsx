import React from "react";
import { useNavigate } from "react-router-dom";
import { HpcFunctionMetadataResponse } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  MarkdownCardContent,
} from "@/components/shadcn/card";
import { FunctionSquare, Tag } from "lucide-react";

interface HpcFunctionCardProps {
  hpcFunction: HpcFunctionMetadataResponse;
  gardenDOI?: string;
}

const HpcFunctionCard = ({ hpcFunction, gardenDOI }: HpcFunctionCardProps) => {
  const navigate = useNavigate();

  if (!hpcFunction) {
    return null;
  }

  const handleClick = () => {
    if (gardenDOI) {
      navigate(`/garden/${encodeURIComponent(gardenDOI)}/hpc-functions/${hpcFunction.id}`);
    } else {
      navigate(`/hpc-functions/${hpcFunction.id}`);
    }
  };

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 pb-2 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-lg bg-teal/10 p-2 text-teal">
            <FunctionSquare className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-medium tracking-tight text-gray-800">
            {hpcFunction.title || "Untitled"}
          </CardTitle>
        </div>
      </CardHeader>

      <MarkdownCardContent
        className="max-h-[120px] flex-grow gap-3 overflow-hidden text-sm text-gray-700"
        content={hpcFunction.description || "No description available"}
      />

      {hpcFunction.tags && hpcFunction.tags.length > 0 && (
        <CardFooter className="flex flex-row items-center border-t border-gray-100 bg-gray-50/80 px-5 py-3 text-xs text-gray-600">
          <div className="flex w-full items-center justify-between gap-3">
            {/* Tags Section */}
            <div className="flex items-center gap-1 overflow-hidden">
              <Tag className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {hpcFunction.tags.slice(0, 2).join(", ")}
                {hpcFunction.tags.length > 2 ? "..." : ""}
              </span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default HpcFunctionCard;
