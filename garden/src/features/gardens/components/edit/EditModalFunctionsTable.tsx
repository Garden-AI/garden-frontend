import { Button } from "@/components/shadcn/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import WithTooltip from "@/components/WithTooltip";
import { cn } from "@/utils/form.utils";
import { useGetUserModalFunctions } from "../../../modal/api/useGetUserModalFunctions";
import { GardenPatchFormData } from "../EditGardenschemas";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGlobusAuth } from "@globus/react-auth-context";

interface EditModalFunctionsTableProps {
  published?: boolean;
}

/**
 * Component for editing modal functions in a garden
 * Unlike SelectModalFunctionsTable, this shows ALL user functions with garden functions pre-checked
 */
export const EditModalFunctionsTable = ({ 
  published = false 
}: EditModalFunctionsTableProps) => {
  const { watch, setValue } = useFormContext<GardenPatchFormData>();
  const auth = useGlobusAuth();
  
  // Get the selected modal function IDs from the form
  const selectedIds = watch("modal_function_ids") || [];
  
  // Fetch ALL user's modal functions (without exclusion)
  const {
    data: functions,
    refetch,
    isFetching,
    isLoading
  } = useGetUserModalFunctions({
    enabled: !!auth?.authorization?.user?.sub,
  });

  const handleCheckboxChange = (id: number) => {
    if (published) return; // Prevent changes if published
    
    const updatedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId: number) => selectedId !== id)
      : [...selectedIds, id];
    
    setValue("modal_function_ids", updatedIds, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="mb-4 text-xl font-bold">Your Modal Functions</h3>
        <div className="flex items-center pr-4 text-sm">
          <span className="text-gray-500">{isFetching && "Refreshing..."}</span>
          <WithTooltip hint="Refresh">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
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
      <div className="relative mb-4 rounded-md border bg-white">
        <div className="max-h-[480px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/12"></TableHead>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="w-1/6 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex h-24 items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : functions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No modal functions available
                  </TableCell>
                </TableRow>
              ) : (
                functions?.map((func) => (
                  <TableRow key={func.id}>
                    <TableCell className="w-1/12 text-center">
                      <Checkbox
                        checked={selectedIds.includes(func.id)}
                        onCheckedChange={() => handleCheckboxChange(func.id)}
                        value={func.id}
                        disabled={published}
                      />
                    </TableCell>
                    <TableCell className="w-1/4 truncate whitespace-normal break-words">
                      {func.title || func.function_name}
                    </TableCell>
                    <TableCell className="w-1/2 truncate whitespace-normal break-words">
                      {func.description || "No description available"}
                    </TableCell>
                    <TableCell className="w-1/6 text-center">
                      <Link
                        to={`/modal-functions/${func.id}`}
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
        </div>
        {published && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 backdrop-blur-sm">
            <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Garden is Published</h3>
              <p className="text-gray-600">Modal functions cannot be edited in a published garden.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 