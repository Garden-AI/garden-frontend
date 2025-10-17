import React, { useCallback } from "react";
import { useGetModalFunction } from "../../functions/modal/api/useGetModalFunction";
import { usePatchModalFunction } from "../../functions/modal/api/usePatchModalFunction";
import { FunctionHeader } from "../../functions/shared/components/FunctionHeader";
import { FunctionBody } from "../../functions/shared/components/FunctionBody";
import { FunctionExample } from "../../functions/shared/components/FunctionExample";
import AssociatedMaterials from "../../functions/shared/components/AssociatedMaterials";
import { ModalFunction } from "@/types";
import { GardenFunction } from "../../functions/shared/types/function.types";

type UnifiedFunctionContentProps = {
    modalFunction: ModalFunction;
    ownsThisFunction: boolean;
};

export const UnifiedFunctionContent = ({
    modalFunction,
    ownsThisFunction,
}: UnifiedFunctionContentProps) => {
    // Fetch fresh modal function data to ensure updates are reflected
    const { data: freshModalFunction } = useGetModalFunction(modalFunction.id.toString());
    const { mutateAsync: patchModalFunction } = usePatchModalFunction();

    const currentModalFunction = freshModalFunction || modalFunction;

    const gardenFunction: GardenFunction = {
        ...currentModalFunction,
        functionType: 'modal',
    };

    const handleUpdate = useCallback(async (updateData: Partial<ModalFunction>) => {
        await patchModalFunction({
            id: currentModalFunction.id,
            modalFunction: updateData
        });
    }, [patchModalFunction, currentModalFunction.id]);

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

