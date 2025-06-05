import React from 'react';
import { InfoIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';
import Markdown from '@/components/Markdown';

export interface DisplayMetadataFieldProps {
    label: string;
    value: string | string[] | undefined | null;
    helpText?: string;
    isArray?: boolean;
    isMarkdown?: boolean; // To handle markdown content like descriptions
}

const DisplayMetadataField = ({
    label,
    value,
    helpText,
    isArray = false,
    isMarkdown = false,
}: DisplayMetadataFieldProps) => {
    const displayValue = () => {
        if (isArray) {
            const arrayValue = Array.isArray(value) ? value : [];
            if (arrayValue.length > 0) {
                return (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {arrayValue.map((item, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                );
            }
            return <p className="text-gray-400 italic text-sm">No {label.toLowerCase()} added</p>;
        }

        if (isMarkdown) {
            return (
                <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800">
                    <Markdown content={value as string || ''} />
                </div>
            );
        }

        if (value && typeof value === 'string' && value.trim() !== '') {
            return <p className="font-medium text-gray-800">{value}</p>;
        }

        return <p className="font-medium text-gray-800"><span className="text-gray-400 italic">No {label.toLowerCase()} added</span></p>;
    };

    return (
        <div
            className="border border-transparent bg-white rounded-md py-1.5 px-2.5"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <p className="text-sm text-gray-500 font-medium">
                        {label}
                    </p>
                    {helpText && (
                        <TooltipProvider delayDuration={50}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InfoIcon className="text-gray-500 m-1.5 h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent className="p-2">
                                    {helpText}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {/* No edit button needed for display-only field */}
            </div>
            <div className="mt-0.5">
                {displayValue()}
            </div>
        </div>
    );
};

export default DisplayMetadataField; 