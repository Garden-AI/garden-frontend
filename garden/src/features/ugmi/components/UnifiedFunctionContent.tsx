import React from "react";
import { useGetModalFunction } from "../../functions/modal/api/useGetModalFunction";
import {
    ModalFunctionHeader,
    ModalFunctionBody,
    ModalFunctionExample,
} from "../../functions/modal/components/ModalFunctionPage";
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

    const currentModalFunction = freshModalFunction || modalFunction;

    const gardenFunction: GardenFunction = {
        ...currentModalFunction,
        functionType: 'modal',
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
            <ModalFunctionHeader
                modalFunction={currentModalFunction}
                ownsThisFunction={ownsThisFunction}
            />
            <ModalFunctionBody modalFunction={currentModalFunction} ownsThisFunction={ownsThisFunction} />
            <ModalFunctionExample
                modalFunction={currentModalFunction}
                ownsThisFunction={ownsThisFunction}
            />
            <AssociatedMaterials
                resource={gardenFunction}
                ownsThisFunction={ownsThisFunction}
            />
        </div>
    );
};

