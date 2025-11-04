import React from 'react';
import { GardenFunction, isModalFunction, isHpcFunction } from "../types/function.types";
import { EditableMetadataField } from '@/components/shared/metadata';
import EditableEndpointsField from '@/components/shared/metadata/EditableEndpointsField';

interface FunctionMetadataProps {
    gardenFunction: GardenFunction;
    ownsThisFunction: boolean;
    updateFunction: (updateData: Partial<GardenFunction>) => Promise<void>;
    formatHardwareSpec: (spec: { [key: string]: string } | undefined | null) => string[];
}

export const FunctionMetadata = ({
    gardenFunction,
    ownsThisFunction,
    updateFunction,
    formatHardwareSpec,
}: FunctionMetadataProps) => {
    return (
        <>
            <EditableMetadataField
                label="Model Authors"
                helpText="Original authors of the model"
                value={gardenFunction.authors}
                fieldName="authors"
                entity={gardenFunction}
                ownsThisEntity={ownsThisFunction}
                isArray={true}
                onUpdate={updateFunction}
            />

            <EditableMetadataField
                label="Gardeners"
                helpText="Creator and contributors to this function and related materials"
                value={isModalFunction(gardenFunction) ? [gardenFunction.owner, ...(gardenFunction.contributors || [])] : gardenFunction.contributors || []}
                fieldName="contributors"
                entity={gardenFunction}
                ownsThisEntity={ownsThisFunction}
                isArray={true}
                onUpdate={updateFunction}
            />

            <EditableMetadataField
                label="Year"
                helpText="Year this function was published"
                value={gardenFunction.year}
                fieldName="year"
                entity={gardenFunction}
                ownsThisEntity={ownsThisFunction}
                onUpdate={updateFunction}
            />

            <EditableMetadataField
                label="Tags"
                helpText="Tags help users discover your functions"
                value={gardenFunction.tags}
                fieldName="tags"
                entity={gardenFunction}
                ownsThisEntity={ownsThisFunction}
                isArray={true}
                onUpdate={updateFunction}
            />

            {isModalFunction(gardenFunction) && (
                <EditableMetadataField
                    label="Hardware Specifications"
                    helpText="Compute resources allocated for the function"
                    value={formatHardwareSpec(gardenFunction.hardware_spec as { [key: string]: string } | undefined | null)}
                    fieldName="hardware_spec"
                    entity={gardenFunction}
                    ownsThisEntity={false} // Read-only
                    isArray={true}
                    onUpdate={updateFunction}
                />
            )}

            {isHpcFunction(gardenFunction) && (
                <EditableEndpointsField
                    label="Available Endpoints"
                    helpText="Globus Compute endpoints where this function is available"
                    availableEndpoints={gardenFunction.available_endpoints}
                    ownsThisEntity={ownsThisFunction}
                    onUpdate={updateFunction as any}
                />
            )}
        </>
    );
}; 