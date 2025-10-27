import React from "react";
import { useGetHpcFunction } from "../../functions/hpc/api/useGetHpcFunction";
import { HpcFunction } from "@/types";
import { HpcFunctionContent } from "../../functions/hpc/components/HpcFunctionContent";

type UnifiedHpcFunctionContentProps = {
    hpcFunction: HpcFunction;
    ownsThisFunction: boolean;
    onDeleteSuccess?: () => void;
};

export const UnifiedHpcFunctionContent = ({
    hpcFunction,
    ownsThisFunction,
    onDeleteSuccess,
}: UnifiedHpcFunctionContentProps) => {
    // Fetch fresh HPC function data to ensure updates are reflected
    const { data: freshHpcFunction } = useGetHpcFunction(hpcFunction.id.toString());

    const currentHpcFunction = freshHpcFunction || hpcFunction;

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
            <HpcFunctionContent
                hpcFunction={currentHpcFunction}
                ownsThisFunction={ownsThisFunction}
                onDeleteSuccess={onDeleteSuccess}
            />
        </div>
    );
};
