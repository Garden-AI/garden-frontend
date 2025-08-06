import { MLIPTableRow } from "./types";
import { Check, X } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/shadcn/tooltip";
import { Link } from "react-router-dom";

interface Props {
  data: MLIPTableRow[];
}

export const MLIPTable = ({ data }: Props) => {
  const headerCols: { label: string; tooltip: string }[] = [
    { label: "Model", tooltip: "MLIP architecture / family" },
    { label: "Checkpoint", tooltip: "Trained weights identifier" },
    { label: "CPS", tooltip: "Combined Performance Score (higher is better)" },
    { label: "Cloud?", tooltip: "Is this MLIP deployable on Garden Cloud?" },
    { label: "Cloud $/1k", tooltip: "Estimated cost to relax 1k materials in the cloud" },
    { label: "HPC?", tooltip: "Is this MLIP deployable on partner HPC clusters?" },
    { label: "HPC node h/1k", tooltip: "Node-hours to relax 1k materials on HPC" },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative w-full overflow-x-auto sm:overflow-x-visible rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md shadow-lg">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-100/40 via-white/20 to-transparent pointer-events-none" />

      <table className="relative z-10 min-w-full text-sm">
        <thead className="bg-slate-100/80 text-slate-700 font-semibold uppercase tracking-wide text-xs">
          <tr>
            {headerCols.map((col) => (
              <th key={col.label} className="px-6 py-3 text-left">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-help">
                      {col.label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8} className="z-50 max-w-xs text-xs shadow-lg rounded-md bg-white">
                    {col.tooltip}
                  </TooltipContent>
                </Tooltip>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={`${row.architecture}-${row.checkpoint}`}
              className={`group border-t border-slate-200 transition-colors ${
                index % 2 === 0 ? "bg-white/60" : "bg-white/40"
              } hover:bg-indigo-50/30`}
            >
              {/* Model cell with link */}
              <td className="px-6 py-2.5 font-medium whitespace-nowrap">
                <Link
                  to={row.modelLink}
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
                >
                  <span>{row.architecture}</span>
                  <svg
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </td>

              {/* Checkpoint cell with external link */}
              <td className="px-6 py-2.5">
                <a
                  href={row.checkpointLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-indigo-600 hover:underline"
                >
                  {row.checkpoint}
                </a>
              </td>

              {/* CPS */}
              <td className="px-6 py-2.5 font-semibold text-slate-800">
                {row.cps.toFixed(3)}
              </td>

              {/* Cloud available */}
              <td className="px-6 py-2.5 text-center">
                {row.cloudAvailable ? (
                  <Check className="h-4 w-4 text-green-600 inline" />
                ) : (
                  <X className="h-4 w-4 text-slate-400 inline" />
                )}
              </td>

              {/* Cloud cost */}
              <td className="px-6 py-2.5 text-slate-700">
                {row.cloudCostPerK !== null ? `$${row.cloudCostPerK.toFixed(2)}` : "—"}
              </td>

              {/* HPC available */}
              <td className="px-6 py-2.5 text-center">
                {row.hpcAvailable ? (
                  <Check className="h-4 w-4 text-green-600 inline" />
                ) : (
                  <X className="h-4 w-4 text-slate-400 inline" />
                )}
              </td>

              {/* HPC node hours */}
              <td className="px-6 py-2.5 text-slate-700">
                {row.hpcNodeHoursPerK !== null ? row.hpcNodeHoursPerK.toFixed(2) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </TooltipProvider>
  );
};