import React from 'react';
import { ModalFunction } from '@/types';
import DisplayMetadataField from '@/components/shared/metadata/DisplayMetadataField';

interface FunctionMetricsProps {
    modalFunction: ModalFunction;
}

export const FunctionMetrics = ({ modalFunction }: FunctionMetricsProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Function Metrics</h3>
            <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <DisplayMetadataField
                    label="Invocations"
                    helpText="Number of times this function has been run"
                    value={modalFunction.num_invocations ? modalFunction.num_invocations.toString() : "0"}
                />
            </div>
        </div>
    );
}; 