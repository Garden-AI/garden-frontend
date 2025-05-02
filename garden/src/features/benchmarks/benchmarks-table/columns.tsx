// React import is needed for JSX in header functions
import React, { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/shadcn/tooltip";

export type BenchmarkResult = {
    function_name: string
    function_id: string
    garden: string
    garden_doi: string
    rmsd?: number
    Ksrme?: number
    rsqrd?: number
    mae?: number
    prec?: number
    daf?: number
    f1?: number
    acc?: number
    cps?: number
}

// Custom header component with tooltip
const HeaderWithTooltip = ({ label, tooltip }: { label: string, tooltip: string }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={40}>
                <TooltipTrigger asChild>
                    <div>{label}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const columns: ColumnDef<BenchmarkResult>[] = [
    {
        header: () => <HeaderWithTooltip label="Function" tooltip="The name of the function or model being benchmarked" />,
        accessorKey: "function_name",
        cell: ({ row }) => {
            const functionId = row.original.function_id;
            const gardenDoi = row.original.garden_doi;
            const functionName = row.original.function_name;

            return gardenDoi
                ? <Link to={`/garden/${encodeURIComponent(gardenDoi)}/modal-functions/${functionId}`} className="text-green hover:underline">{functionName}</Link>
                : <Link to={`/modal-functions/${functionId}`} className="text-green hover:underline">{functionName}</Link>;
        }
    },
    {
        header: () => <HeaderWithTooltip label="Garden" tooltip="The garden containing the function" />,
        accessorKey: "garden",
        cell: ({ row }) => {
            const gardenDoi = row.original.garden_doi;
            const gardenName = row.original.garden;

            return <Link to={`/garden/${encodeURIComponent(gardenDoi)}`} className="text-blue-600 hover:underline">{gardenName}</Link>;
        }
    },
    {
        header: () => <HeaderWithTooltip label="RMSD" tooltip="Root Mean Squared Displacement - Measures the average displacement between predicted and reference structures after relaxation (lower is better)" />,
        accessorKey: "rmsd",
    },
    {
        header: () => <HeaderWithTooltip label="Ksrme" tooltip="Symmetric relative mean error in predicted phonon mode contributions to thermal conductivity (lower is better)" />,
        accessorKey: "Ksrme",
    },
    {
        header: () => <HeaderWithTooltip label="R²" tooltip="Coefficient of determination - Measures how well the model predictions explain the variance in the observed data (higher is better)" />,
        accessorKey: "rsqrd",
    },
    {
        header: () => <HeaderWithTooltip label="MAE" tooltip="Mean Absolute Error - Average of absolute differences between predicted and observed values (lower is better)" />,
        accessorKey: "mae",
    },
    {
        header: () => <HeaderWithTooltip label="Prec" tooltip="Precision of classifying thermodynamic stability - Ratio of true positives to all predicted positives (higher is better)" />,
        accessorKey: "prec",
    },
    {
        header: () => <HeaderWithTooltip label="DAF" tooltip="Discovery Acceleration Factor - Measures how much better ML models classify thermodynamic stability compared to random guessing (higher is better)" />,
        accessorKey: "daf",
    },
    {
        header: () => <HeaderWithTooltip label="F1" tooltip="F1 Score - Harmonic mean of precision and recall for stable/unstable material classification (higher is better)" />,
        accessorKey: "f1",
    },
    {
        header: () => <HeaderWithTooltip label="Acc" tooltip="Accuracy of classifying thermodynamic stability - Proportion of correct predictions among all predictions (higher is better)" />,
        accessorKey: "acc",
    },
    {
        header: () => <HeaderWithTooltip label="CPS" tooltip="Combined Performance Score - Weighted average of discovery (F1), structure optimization (RMSD), and phonon performance (κSRME) metrics (higher is better)" />,
        accessorKey: "cps",
    },
];