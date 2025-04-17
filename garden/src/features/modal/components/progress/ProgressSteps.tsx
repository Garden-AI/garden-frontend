import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/form.utils";

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps = [
    { number: 1, label: "Upload File" },
    { number: 2, label: "Validate" },
    { number: 3, label: "Edit Details" },
    { number: 4, label: "Deploy" },
  ];

  return (
    <div className="mb-8 mt-6 border-t pt-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Current Phase: Upload Modal App</h3>
      </div>
      <div className="relative max-w-4xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200"></div>
        
        {/* Progress Bar Fill - This shows completed steps with primary color */}
        <div 
          className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep - 1) / (steps.length - 1) * 75}%` }}
        ></div>
        
        {/* Steps */}
        <div className="relative flex justify-between px-6">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
                  currentStep > step.number
                    ? "border-primary bg-primary text-white" // Completed
                    : currentStep === step.number
                      ? "border-primary bg-primary text-white" // Current
                      : "border-gray-300 bg-white text-gray-400" // Upcoming
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span className="text-sm">{step.number}</span>
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-sm",
                  currentStep >= step.number ? "font-medium text-gray-900" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 