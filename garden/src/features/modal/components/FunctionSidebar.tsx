import React from 'react';
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { ModalFunction } from "@/types";
import { FunctionMetadata } from './FunctionMetadata';
import { FunctionMetrics } from './FunctionMetrics';
import Metadata from '@/components/shared/metadata/Metadata';

interface FunctionSidebarProps {
    modalFunction: ModalFunction,
    ownsThisFunction: boolean,
}

export const FunctionSidebar = ({
    modalFunction,
    ownsThisFunction,
}: FunctionSidebarProps) => {
    const { mutate: patchModalFunction } = usePatchModalFunction();
    const updateFunction = async (updateData: Partial<ModalFunction>) => {
        await patchModalFunction({
            id: modalFunction.id,
            modalFunction: updateData,
        });
    };

    const formatHardwareSpec = (spec: { [key: string]: string } | undefined | null): string[] => {
        if (!spec) {
            return [];
        }
        return Object.entries(spec).map(([key, value]) => {
            let displayKey = key;
            if (key.toLowerCase() === 'gpus' || key.toLowerCase() === 'cpu') {
                displayKey = key.toUpperCase();
            } else if (key.toLowerCase() === 'memory') {
                displayKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            }
            if (!value) {
                value = "Not Specified";
            }
            return `${displayKey}: ${value}`;
        });
    };

    return (
        <Metadata
            name={"Function"}
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
        >
            <FunctionMetadata
                modalFunction={modalFunction}
                ownsThisFunction={ownsThisFunction}
                updateFunction={updateFunction}
                formatHardwareSpec={formatHardwareSpec}
            />
            <FunctionMetrics
                modalFunction={modalFunction}
            />
        </Metadata>
    );
}
