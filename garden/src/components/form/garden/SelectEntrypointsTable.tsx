import React from "react";
import { useGetEntrypoints } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import WithTooltip from "@/components/WithTooltip";
import { cn } from "@/lib/utils";

export const SelectEntrypointsTable = () => {
  const { watch, setValue } = useFormContext();
  const auth = useGlobusAuth();

  const isPublished = watch("doi_is_draft") === false && watch("is_archived") === false;

  const {
    data: entrypoints,
    refetch,
    isFetching,
  } = useGetEntrypoints({
    owner_uuid: auth?.authorization?.user?.sub,
  });

  const selectedIds = watch("entrypoint_ids") || [];

  const handleCheckboxChange = (doi: string) => {
    if (isPublished) return; // Prevent changes if published
    const updatedIds = selectedIds.includes(doi)
      ? selectedIds.filter((id: string) => id !== doi)
      : [...selectedIds, doi];
    setValue("entrypoint_ids", updatedIds, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="mb-4 text-xl font-bold">Available Entrypoints</h3>
        <div className="flex items-center pr-4 text-sm">
          <span className="text-gray-300">{isFetching && "Refreshing..."}</span>
          <WithTooltip hint="Refresh">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refetch();
              }}
              type="button"
              disabled={isFetching}
              className={cn(
                "border-none bg-transparent p-2 hover:bg-transparent",
                isFetching && "cursor-not-allowed opacity-50",
              )}
            >
              <RefreshCcwIcon className={cn("h-5 w-5", isFetching && "animate-spin")} />
            </Button>
          </WithTooltip>
        </div>
      </div>
      <div className="relative mb-4 min-h-[250px] overflow-x-auto rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12"></TableHead>
              <TableHead className="w-1/4">Name</TableHead>
              <TableHead className="w-1/2">Description</TableHead>
              <TableHead className="w-1/6 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entrypoints?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No entrypoints available
                </TableCell>
              </TableRow>
            ) : (
              entrypoints?.map((ep) => (
                <TableRow key={ep.doi}>
                  <TableCell className="w-1/12 text-center">
                    <Checkbox
                      checked={selectedIds.includes(ep.doi)}
                      onCheckedChange={() => handleCheckboxChange(ep.doi)}
                      value={ep.doi}
                      disabled={isPublished}
                    />
                  </TableCell>
                  <TableCell className="w-1/4 truncate whitespace-normal break-words">
                    {ep.title}
                  </TableCell>
                  <TableCell className="w-1/2 truncate whitespace-normal break-words">
                    {ep.description}
                  </TableCell>
                  <TableCell className="w-1/6 text-center">
                    <Link
                      to={`/entrypoint/${encodeURIComponent(ep.doi)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" type="button">
                        View
                        <ExternalLink size={14} className="mb-0.5 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {isPublished && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 backdrop-blur-sm">
            <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Garden is Published</h3>
              <p className="text-gray-600">Entrypoints cannot be edited in a published garden.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
