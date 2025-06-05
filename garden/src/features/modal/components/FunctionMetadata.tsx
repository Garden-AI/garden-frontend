import React from 'react';
import { ModalFunction } from '@/types';
import { EditableMetadataField } from '@/components/shared/metadata';

interface FunctionMetadataProps {
    modalFunction: ModalFunction;
    ownsThisFunction: boolean;
    updateFunction: (updateData: Partial<ModalFunction>) => Promise<void>;
    formatHardwareSpec: (spec: { [key: string]: string } | undefined | null) => string[];
}

export const FunctionMetadata = ({
    modalFunction,
    ownsThisFunction,
    updateFunction,
    formatHardwareSpec,
}: FunctionMetadataProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Function Metadata</h3>
            <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <EditableMetadataField
                    label="Model Authors"
                    helpText="Original authors of the models used by this function"
                    value={modalFunction.authors}
                    fieldName="authors"
                    entity={modalFunction}
                    ownsThisEntity={ownsThisFunction}
                    isArray={true}
                    onUpdate={updateFunction}
                />

                <EditableMetadataField
                    label="Gardeners"
                    helpText="Creator and contributors to this function and related materials"
                    value={[modalFunction.owner, ...(modalFunction.contributors || [])]}
                    fieldName="contributors" // Note: combines owner and contributors
                    entity={modalFunction}
                    ownsThisEntity={ownsThisFunction}
                    isArray={true}
                    onUpdate={updateFunction}
                />

                <EditableMetadataField
                    label="Year"
                    helpText="Year this function was published"
                    value={modalFunction.year}
                    fieldName="year"
                    entity={modalFunction}
                    ownsThisEntity={ownsThisFunction}
                    onUpdate={updateFunction}
                />

                <EditableMetadataField
                    label="Tags"
                    helpText="Tags help users discover your functions"
                    value={modalFunction.tags}
                    fieldName="tags"
                    entity={modalFunction}
                    ownsThisEntity={ownsThisFunction}
                    isArray={true}
                    onUpdate={updateFunction}
                />

                <EditableMetadataField
                    label="Hardware Specifications"
                    helpText="Compute resources allocated for the function"
                    value={formatHardwareSpec(modalFunction.hardware_spec)}
                    fieldName="hardware_spec"
                    entity={modalFunction}
                    ownsThisEntity={false} // Read-only
                    isArray={true}
                    onUpdate={updateFunction}
                />
            </div>
        </div>
    );
}; 