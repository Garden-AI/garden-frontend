import React from 'react';
import { ModalFunction } from '@/types';
import DisplayMetadataField from '@/components/shared/metadata/DisplayMetadataField';

interface FunctionMetricsProps {
    modalFunction: ModalFunction;
}

export const FunctionMetrics = ({ modalFunction }: FunctionMetricsProps) => {
    return (
        <div className="bg-white rounded-md p-3 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Function Metrics</h3>
            <DisplayMetadataField
                label="Invocations"
                helpText="Number of times this function has been run"
                value={modalFunction.num_invocations ? modalFunction.num_invocations.toString() : "0"}
            />
        </div>
    );
}; 