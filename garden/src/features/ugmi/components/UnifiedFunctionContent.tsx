import React, { useCallback } from "react";
import { useGetModalFunction } from "../../functions/modal/api/useGetModalFunction";
import { usePatchModalFunction } from "../../functions/modal/api/usePatchModalFunction";
import { FunctionHeader } from "../../functions/shared/components/FunctionHeader";
import { FunctionBody } from "../../functions/shared/components/FunctionBody";
import { FunctionExample } from "../../functions/shared/components/FunctionExample";
import AssociatedMaterials from "../../functions/shared/components/AssociatedMaterials";
import { ModalFunction } from "@/types";
import { GardenFunction } from "../../functions/shared/types/function.types";
import LoadingSpinner from "@/components/LoadingSpinner";

type UnifiedFunctionContentProps = {
    modalFunction: ModalFunction;
    ownsThisFunction: boolean;
};

export const UnifiedFunctionContent = ({
    modalFunction,
    ownsThisFunction,
}: UnifiedFunctionContentProps) => {
    // Fetch full modal function metadata (search results are incomplete)
    const { data: freshModalFunction, isLoading } = useGetModalFunction(modalFunction.id.toString());
    const { mutateAsync: patchModalFunction } = usePatchModalFunction();

    // Define callback before early return to avoid hook order issues
    const handleUpdate = useCallback(async (updateData: Partial<ModalFunction>) => {
        if (!freshModalFunction) return;
        await patchModalFunction({
            id: freshModalFunction.id,
            modalFunction: updateData
        });
    }, [patchModalFunction, freshModalFunction]);

    // Wait for full metadata before rendering
    if (isLoading || !freshModalFunction) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const currentModalFunction = freshModalFunction;

    const gardenFunction: GardenFunction = {
        ...currentModalFunction,
        functionType: 'modal',
    };

    const generateDefaultExample = (functionName: string) => {
        return `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

input = ['Data Here']
return my_garden.${functionName}(input)`;
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
            <FunctionHeader
                functionData={currentModalFunction}
                functionType="modal"
                ownsThisFunction={ownsThisFunction}
                onUpdate={handleUpdate}
            />
            <FunctionBody
                functionData={currentModalFunction}
                ownsThisFunction={ownsThisFunction}
                onUpdate={handleUpdate}
            />
            <FunctionExample
                functionData={currentModalFunction}
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

