import React from 'react';
import { GardenFunction, isModalFunction, isHpcFunction } from "../types/function.types";
import { usePatchModalFunction } from '../../modal/api/usePatchModalFunction';
import { usePatchHpcFunction } from '../../hpc/api/usePatchHpcFunction';
import { FunctionMetadata } from './FunctionMetadata';
import { FunctionMetrics } from './FunctionMetrics';
import Metadata from '@/components/shared/metadata/Metadata';
import { formatHardwareSpec } from '../utils/hardware.utils';

interface FunctionSidebarProps {
    gardenFunction: GardenFunction,
    ownsThisFunction: boolean,
}

export const FunctionSidebar = ({
    gardenFunction,
    ownsThisFunction,
}: FunctionSidebarProps) => {
    const { mutate: patchModalFunction } = usePatchModalFunction();
    const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(
        isHpcFunction(gardenFunction) ? gardenFunction.id : undefined
    );

    const updateFunction = async (updateData: Partial<GardenFunction>) => {
        if (isModalFunction(gardenFunction)) {
            await patchModalFunction({
                id: gardenFunction.id,
                modalFunction: updateData,
            });
        } else if (isHpcFunction(gardenFunction)) {
            await patchHpcFunction(updateData);
        }
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
