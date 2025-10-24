import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/form.utils";

interface OverallProgressProps {
  currentPhase: number;
  isCompleted?: boolean;
  isSubmitting?: boolean;
  functionType?: 'modal' | 'hpc';
}

export const OverallProgress = ({
  currentPhase,
  isCompleted = false,
  isSubmitting = false,
  functionType = 'modal'
}: OverallProgressProps) => {
  const phases = [
    { number: 1, label: functionType === 'hpc' ? "Upload HPC Functions" : "Deploy Modal App" },
    { number: 2, label: "Create Garden" }
  ];

  // Calculate progress percentage based on phase and state
  const getProgressPercentage = () => {
    if (currentPhase <= 1 && !isCompleted) return 33; // Stop just before first point completes
    if (currentPhase === 1 && isCompleted) return 50; // Phase 1 complete
    if (currentPhase === 2 && !isSubmitting) return 66; // Stop just before second point
    if (currentPhase === 2 && isSubmitting) return 100; // Form is submitting
    if (currentPhase >= 2) return 100; // Phase 2 or beyond
    return 0; // Shouldn't reach here
  };

  return (
    <div className="mb-6">
      <div className="mb-2">
        <h3 className="text-base font-medium text-gray-700">Progress</h3>
      </div>
      <div className="relative max-w-3xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-200"></div>

        {/* Progress Bar Fill - This shows completed steps */}
        <div
          className="absolute left-0 top-5 h-1 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>

        {/* Phases - Using a max-width container with better spacing */}
        <div className="relative max-w-md mx-auto px-8">
          <div className="flex w-full justify-between">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    currentPhase >= phase.number
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {currentPhase > phase.number ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <span className="text-base font-semibold">{phase.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    currentPhase >= phase.number ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 