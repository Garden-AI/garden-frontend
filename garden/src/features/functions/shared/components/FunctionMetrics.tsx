import React from 'react';
import { GardenFunction } from "../types/function.types";
import DisplayMetadataField from '@/components/shared/metadata/DisplayMetadataField';

interface FunctionMetricsProps {
    gardenFunction: GardenFunction;
}

export const FunctionMetrics = ({ gardenFunction }: FunctionMetricsProps) => {
    return (
        <div className="bg-white rounded-md p-3 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Function Metrics</h3>
            <DisplayMetadataField
                label="Invocations"
                helpText="Number of times this function has been run"
                value={gardenFunction.num_invocations ? gardenFunction.num_invocations.toString() : "0"}
            />
        </div>
    );
}; 