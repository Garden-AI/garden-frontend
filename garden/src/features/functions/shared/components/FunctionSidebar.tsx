import React from 'react';
import { GardenFunction, isModalFunction } from "../types/function.types";
import { usePatchModalFunction } from '../../modal/api/usePatchModalFunction';
import { FunctionMetadata } from './FunctionMetadata';
import { FunctionMetrics } from './FunctionMetrics';
import Metadata from '@/components/shared/metadata/Metadata';

interface FunctionSidebarProps {
    gardenFunction: GardenFunction,
    ownsThisFunction: boolean,
}

export const FunctionSidebar = ({
    gardenFunction,
    ownsThisFunction,
}: FunctionSidebarProps) => {
    const { mutate: patchModalFunction } = usePatchModalFunction();

    const updateFunction = async (updateData: Partial<GardenFunction>) => {
        if (isModalFunction(gardenFunction)) {
            await patchModalFunction({
                id: gardenFunction.id,
                modalFunction: updateData,
            });
        } else {
            // TODO: implement patch for HPC function
            console.log("Patching HPC function not implemented yet");
        }
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
            entity={gardenFunction}
            ownsThisEntity={ownsThisFunction}
        >
            <FunctionMetadata
                gardenFunction={gardenFunction}
                ownsThisFunction={ownsThisFunction}
                updateFunction={updateFunction}
                formatHardwareSpec={formatHardwareSpec}
            />
            <FunctionMetrics
                gardenFunction={gardenFunction}
            />
        </Metadata>
    );
}
