import React from "react";
import { useGetModalFunction } from "../../functions/modal/api/useGetModalFunction";
import {
    ModalFunctionHeader,
    ModalFunctionBody,
    ModalFunctionExample,
} from "../../functions/modal/components/ModalFunctionPage";
import ModalAssociatedMaterials from "../../materials/components/ModalAssociatedMaterials";
import { ModalFunction } from "@/types";

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

    // Use fresh data if available, fallback to prop
    const currentModalFunction = freshModalFunction || modalFunction;

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
            <ModalAssociatedMaterials
                resource={currentModalFunction}
                ownsThisFunction={ownsThisFunction}
            />
        </div>
    );
};

