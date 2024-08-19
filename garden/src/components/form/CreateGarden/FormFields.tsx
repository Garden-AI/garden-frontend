import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";
import { GardenCreateFormData } from "./schemas";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { FormNavigation } from "./FormNavigation";
import { tagOptions, initialEntrypoints } from "./constants";
import WithTooltip from "@/components/WithTooltip";
import { useGetEntrypoints } from "@/api";
import { cn } from "@/lib/utils";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";

const Step1 = () => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">General</h2>
        <p className="text-sm text-gray-700">
          General information about your Garden.
        </p>
      </div>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Garden Title *</FormLabel>
            <FormControl>
              <Input placeholder="My Garden" {...field} />
            </FormControl>
            <FormDescription>
              This is your Garden's public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your garden"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A high level overview of your Garden, its purpose, and its
              contents. This will be displayed on the Garden page and appear in
              search results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tags <span className="text-gray-500">(optional)</span>
            </FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                groupBy="group"
                placeholder="Add tags to your garden"
                creatable
                hideClearAllButton
                defaultOptions={tagOptions}
                maxSelected={5}
                hidePlaceholderWhenSelected
                inputProps={{ maxLength: 32 }}
                onChange={field.onChange}
                value={field.value}
              />
            </FormControl>
            <FormDescription>
              Tags to help categorize and improve the discoverability your
              Garden.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
const Step2 = () => {
  const auth = useGlobusAuth();
  const form = useFormContext();
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "entrypoint_ids",
  });

  const {
    data: availableEntrypoints,
    isFetching,
    refetch,
  } = useGetEntrypoints({
    owner_uuid: auth?.authorization?.user?.sub,
  });

  const [selectedEntrypoints, setSelectedEntrypoints] = useState<string[]>(
    fields.map((field: any) => field.doi),
  );

  const handleEntrypointToggle = (doi: string) => {
    setSelectedEntrypoints((prev) => {
      const newSelection = prev.includes(doi)
        ? prev.filter((id) => id !== doi)
        : [...prev, doi];

      const newFields = availableEntrypoints?.filter((ep) =>
        newSelection.includes(ep.doi),
      );
      replace(newFields);

      return newSelection;
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="mb-2 text-2xl font-bold">Entrypoints</h2>
        <p className="text-sm text-gray-700">
          Your garden is comprised of one or more{" "}
          <span className="italic">Entrypoints</span>. An Entrypoint is a Python
          function that serves as an access point to a saved notebook session
          and can be executed remotely via any Garden it's published to.
        </p>
        <p className="text-sm text-gray-700">
          Select the Entrypoints you want to include in your Garden. You can add
          or remove Entrypoints at any time.
        </p>

        <p className="text-sm text-gray-700"></p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="mb-4 text-xl font-bold">Available Entrypoints</h3>
          <div className="flex items-center pr-4 text-sm">
            <span className="text-gray-300">
              {isFetching && "Refreshing..."}
            </span>
            <WithTooltip hint="Refresh">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  refetch();
                }}
                type="button"
                disabled={isFetching}
                className={cn(
                  "border-none bg-transparent p-2 hover:bg-transparent",
                  isFetching && "cursor-not-allowed opacity-50",
                )}
              >
                <RefreshCcwIcon
                  className={cn("h-5 w-5", isFetching && "animate-spin")}
                />
              </Button>
            </WithTooltip>
          </div>
        </div>

        <div className="mb-4 min-h-[250px] overflow-x-auto border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12"></TableHead>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className=" w-1/6 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableEntrypoints?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No entrypoints available
                  </TableCell>
                </TableRow>
              ) : (
                availableEntrypoints?.map((ep) => (
                  <TableRow key={ep.doi} className="">
                    <TableCell className="w-1/12 text-center">
                      <Checkbox
                        checked={selectedEntrypoints.includes(ep.doi)}
                        onCheckedChange={() => handleEntrypointToggle(ep.doi)}
                      />
                    </TableCell>
                    <TableCell className="w-1/4  truncate whitespace-normal break-words">
                      {ep.title}
                    </TableCell>
                    <TableCell className="w-1/2 truncate whitespace-normal break-words">
                      {ep.description}
                    </TableCell>
                    <TableCell className="w-1/6 text-center">
                      <Link
                        to={`/entrypoint/${encodeURIComponent(ep.doi)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" type="button">
                          View
                          <ExternalLink size={14} className="mb-0.5 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EntrypointCreateInstructions />
    </div>
  );
};

const EntrypointCreateInstructions = () => {
  const form = useFormContext();

  return (
    <div className="text-sm text-gray-500">
      Not seeing the Entrypoint you're looking for? You can create a new one by
      following{" "}
      <Dialog>
        <DialogTrigger className="text-primary transition hover:text-primary/80">
          {" "}
          these instructions.
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-x-auto overflow-y-scroll p-12 font-display xl:max-w-screen-xl">
          <DialogTitle className="text-3xl font-bold">
            Creating a new Entrypoint
          </DialogTitle>

          <DialogDescription className="mb-6 text-base text-gray-700">
            Entrypoints are Python functions that serve as an access point to a
            saved notebook session and can be executed remotely via any Garden
            it's published to. To add an entrypoint, first ensure you have the
            <a href="https://garden.ai/docs/cli" className="text-primary">
              {" "}
              Garden CLI
            </a>{" "}
            installed on your machine, and you are logged in. You can run
            <code className="rounded bg-gray-100 p-1">garden-ai whoami</code> to
            check if you are logged in.
          </DialogDescription>

          <div className="space-y-12">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Start a Notebook</h2>
              <div className="rounded-lg bg-gray-100 p-4">
                <pre>
                  <code className="">
                    garden-ai notebook start {"<PATH TO YOUR NOTEBOOK>"}{" "}
                    --base-image={"<BASE IMAGE>"}
                  </code>
                </pre>
              </div>
              <div className="">
                <p className="mt-2">
                  This command starts a Jupyter notebook in an isolated Docker
                  environment.
                </p>
                <p className="mt-2">
                  The <code>--base-image</code> flag specifies the base image to
                  use for the notebook- you can run{" "}
                  <code className="rounded bg-gray-100 p-1">
                    garden-ai notebook list-premade-images
                  </code>{" "}
                  to see the available base images.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Write your Entrypoint Function
              </h2>
              <p className="mb-2">
                In the notebook, define one or more entrypoint functions. This
                function will run on the remote server when someone invokes your
                model.
              </p>

              <p className="mb-4">
                To specify an entrypoint function, use the garden-entrypoint
                decorator:
              </p>
              <SyntaxHighlighter>
                {`from garden_ai import EntrypointMetadata, garden_entrypoint 

@garden_entrypoint(
    metadata=EntrypointMetadata(
        title="My Entrypoint",
        description="This is an example entrypoint",
        tags=["example", "entrypoint"],
        authors=["Shane", "Leek"],
    )
)
def my_entrypoint_function():
  # Your code here
  return`}
              </SyntaxHighlighter>

              <p className="mt-2 text-sm text-gray-500">
                For more information on the garden-entrypoint decorator,
                including more information about the EntrypointMetadata fields,
                check out the{" "}
                <a
                  href="https://garden-ai.readthedocs.io/en/latest/Entrypoints/#garden_ai.EntrypointMetadata"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Entrypoint Metadata API Reference
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Publish your Entrypoint
              </h2>
              <div className="">
                <p className="mb-4">
                  Use the following command to publish your notebook and
                  associated entrypoints:
                </p>
                <div className="rounded-lg bg-gray-100 p-4">
                  <pre>
                    <code className="text-sm">
                      garden-ai notebook publish {"<PATH TO YOUR NOTEBOOK>"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="mb-2 text-xl font-semibold">Success!</h3>
              <p className="mb-2">
                You can now add your new Entrypoint to your Garden by selecting
                it from the list of available Entrypoints.
              </p>

              <p className="mb-4">
                For a more comprehensive guide on creating and managing
                Entrypoints, see the{" "}
                <a
                  href="https://garden-ai.readthedocs.io/en/latest/user_guide/tutorial/"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  online tutorial
                </a>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Step3 = () => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Contributors</h2>
      <FormField
        control={form.control}
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authors *</FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                placeholder="Add authors"
                creatable
              />
            </FormControl>
            <FormDescription>
              The main researchers involved in producing the Garden. At least
              one author is required in order to register a DOI.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contributors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Contributors <span className="text-gray-500">(optional)</span>
            </FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                placeholder="Add contributors"
                creatable
              />
            </FormControl>
            <FormDescription>
              Acknowledge contributors to the development of this Garden,
              outside of those listed as authors.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const Step4 = () => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Miscellaneous</h2>

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <Input placeholder="en" {...field} />
            </FormControl>
            <FormDescription>The language of your Garden.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Version</FormLabel>
            <FormControl>
              <Input placeholder="1.0.0" {...field} />
            </FormControl>
            <FormDescription>The version of your Garden.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

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

const useMultiStepForm = (initialStep = 1, maxSteps = 4) => {
  const form = useFormContext();
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

export const FormFields = () => {
  const { step, nextStep, prevStep, isFirstStep, isLastStep } =
    useMultiStepForm();
  return (
    <div>
      <AnimatePresence mode="wait">
        {framerMotionSteps[step - 1]}
      </AnimatePresence>
      <FormNavigation
        step={step}
        nextStep={nextStep}
        prevStep={prevStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </div>
  );
};
