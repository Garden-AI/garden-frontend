import React, { useCallback } from "react";
import { useGetHpcFunction } from "../../functions/hpc/api/useGetHpcFunction";
import { usePatchHpcFunction } from "../../functions/hpc/api/usePatchHpcFunction";
import { FunctionHeader } from "../../functions/shared/components/FunctionHeader";
import { FunctionBody } from "../../functions/shared/components/FunctionBody";
import { FunctionExample } from "../../functions/shared/components/FunctionExample";
import AssociatedMaterials from "../../functions/shared/components/AssociatedMaterials";
import { HpcFunction, HpcFunctionPatchRequest } from "@/types";
import { GardenFunction } from "../../functions/shared/types/function.types";

type UnifiedHpcFunctionContentProps = {
    hpcFunction: HpcFunction;
    ownsThisFunction: boolean;
};

export const UnifiedHpcFunctionContent = ({
    hpcFunction,
    ownsThisFunction,
}: UnifiedHpcFunctionContentProps) => {
    // Fetch fresh HPC function data to ensure updates are reflected
    const { data: freshHpcFunction } = useGetHpcFunction(hpcFunction.id.toString());
    const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(hpcFunction.id);

    const currentHpcFunction = freshHpcFunction || hpcFunction;

    const gardenFunction: GardenFunction = {
        ...currentHpcFunction,
        functionType: 'hpc',
    };

    const handleUpdate = useCallback(async (updateData: HpcFunctionPatchRequest) => {
        await patchHpcFunction(updateData);
    }, [patchHpcFunction]);

    const generateDefaultExample = (functionName: string) => {
        return `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

# Note: HPC function execution happens via Globus Compute.
input = ['Data Here']
future = my_garden.${functionName}.submit(input, endpoint='my-globus-compute-endpoint')
results = future.result()`;
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
            <FunctionHeader
                functionData={currentHpcFunction}
                functionType="hpc"
                ownsThisFunction={ownsThisFunction}
                onUpdate={handleUpdate}
            />
            <FunctionBody
                functionData={currentHpcFunction}
                ownsThisFunction={ownsThisFunction}
                onUpdate={handleUpdate}
            />
            <FunctionExample
                functionData={currentHpcFunction}
                ownsThisFunction={ownsThisFunction}
                onUpdate={handleUpdate}
                generateDefaultExample={generateDefaultExample}
            />
            <AssociatedMaterials
                resource={gardenFunction}
                ownsThisFunction={ownsThisFunction}
            />
        </div>
    );
};
