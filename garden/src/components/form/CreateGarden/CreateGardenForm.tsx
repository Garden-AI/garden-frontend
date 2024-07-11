import { useForm, useFormContext } from "react-hook-form";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { useBlocker, useNavigate } from "react-router-dom";
import { useCreateGarden, useMintDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { useState } from "react";
import { formSchema, FormSchemaType } from "./FormSchema";
import { transformFormToRequest } from "./transformers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../UnsavedChangesDialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CreateGardenForm: React.FC = () => {
  const navigate = useNavigate();
  const createGarden = useCreateGarden();
  const mintDOI = useMintDOI();
  const auth = useGlobusAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      authors: [],
      contributors: [],
      entrypoint_ids: [],
      doi_is_draft: true,
      description: "",
      publisher: "Gardens-AI",
      year: "2024",
      language: "en",
      tags: [],
      version: "1.0.0",
    },
  });

  const { step, nextStep, prevStep, isFirstStep, isLastStep } =
    useMultiStepForm(form);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: FormSchemaType) => {
    setIsSubmitting(true);
    try {
      const ownerId = auth?.authorization?.user?.sub;
      if (!ownerId) {
        throw new Error("User not authenticated");
      }

      const { doi } = await mintDOI.mutateAsync();
      const requestData = transformFormToRequest(values, doi, ownerId);

      await createGarden.mutateAsync(requestData);

      toast.success("Garden created successfully!");
      setIsSubmitting(false);
      navigate(`/garden/${encodeURIComponent(doi)}`);
    } catch (error) {
      setIsSubmitting(false);
      toast.warning("Error creating garden. Please fix errors.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <p className="pr-8 text-right text-lg font-semibold text-black/40">
          {step} / 4
        </p>
        <AnimatePresence mode="wait">
          {framerMotionSteps[step - 1]}
        </AnimatePresence>

        <FormNavigation
          step={step}
          nextStep={nextStep}
          prevStep={prevStep}
          isSubmitting={isSubmitting}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
        />
      </Form>
      <UnsavedChangesDialog blocker={blocker} />
      <LoadingOverlay isSubmitting={isSubmitting} />
    </form>
  );
};

const LoadingOverlay = ({ isSubmitting }: { isSubmitting: boolean }) =>
  isSubmitting && (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
      <LoadingSpinner />
    </div>
  );

const FormNavigation = ({
  step,
  nextStep,
  prevStep,
  isSubmitting,
  isFirstStep,
  isLastStep,
}: {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}) => (
  <div className="mt-8 flex justify-end gap-2">
    <Button
      type="button"
      variant="outline"
      onClick={prevStep}
      disabled={isFirstStep}
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
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

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const stepComponents = [Step1, Step2, Step3, Step4];

const framerMotionSteps = stepComponents.map((StepComponent, index) => (
  <motion.div
    key={index}
    variants={formVariants}
    className="min-h-[600px]"
    initial={index === 0 ? "visible" : "hidden"}
    animate="visible"
    exit="exit"
  >
    <StepComponent />
  </motion.div>
));

const getFieldsForStep = (step: number) => {
  switch (step) {
    case 1:
      return ["title", "description", "tags"];
    case 2:
      return ["entrypoint_ids"];
    case 3:
      return ["authors", "contributors"];
    case 4:
      return ["language", "version"];
    default:
      return [];
  }
};

const useMultiStepForm = (
  // form: useFormProps<FormSchemaType>,
  form: any,
  initialStep = 1,
  maxSteps = 4,
) => {
  const [step, setStep] = useState(initialStep);

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, maxSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return {
    step,
    nextStep,
    prevStep,
    isFirstStep: step === 1,
    isLastStep: step === maxSteps,
  };
};
