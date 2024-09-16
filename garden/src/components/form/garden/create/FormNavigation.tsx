import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const FormNavigation = ({
  step,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
}: {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) => {
  const form = useFormContext();
  const { isSubmitting } = form.formState;

  return (
    <div className="mt-8 flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        className={cn(
          "opacity-100 transition",
          isFirstStep && "cursor-default opacity-0",
        )}
      >
        <ChevronLeft className={"mr-1 h-4 w-4"} />
        Back
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={nextStep}
        disabled={isLastStep}
        className={cn(isLastStep && "hidden")}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
      <Button
        type="submit"
        className={cn("hidden", isLastStep && "inline-block")}
      >
        {isSubmitting ? "Creating Garden..." : "Create Garden"}
      </Button>
    </div>
  );
};
