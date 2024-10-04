import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateModalApp } from "@/api/modal/useCreateModalApp";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGardenAndDOI } from "@/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const ModalUploadForm = () => {
  const auth = useGlobusAuth();
  const { mutateAsync: createModalApp } = useCreateModalApp();
  const { createGardenAndDOI } = useCreateGardenAndDOI();
  const navigate = useNavigate();

  const [loadingText, setLoadingText] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(
      z.object({
        fileContents: z.string().min(1, { message: "A file is required" }),

        modal_functions: z
          .array(
            z.object({
              title: z.string().min(1, { message: "Function title is required" }),
              description: z.string(),
              function_name: z.string().min(1, { message: "Function name is required" }),
              year: z.string().min(4, { message: "Year must be 4 digits" }),
              is_archived: z.boolean(),
              doi: z.string().min(1, {
                message: "DOI is required",
              }),
            }),
          )
          .min(1, { message: "At least one function is required." }),
        title: z.string().min(1, { message: "Garden Title is required" }),
        description: z.string().min(1, { message: "Garden Description is required" }),
      }),
    ),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      fileContents: "",
      modal_functions: [
        {
          title: "",
          description: "",
          function_name: "",
          year: "2024",
          is_archived: false,
          doi: "fake_doi",
        },
      ],
    },
  });

  const onSubmit = async (values: any) => {
    if (!auth.authorization?.user?.sub) {
      throw new Error("Must be authenticated");
    }
    try {
      // Create the Modal App
      setLoadingText(() => "Creating modal app...");
      await createModalApp({
        file_contents: values.fileContents,
        requirements: [], // Will ultimately be handled by backend
        app_name: "example-get-started",
        version: "1.0.0",
        base_image_name: "python:3.8", // Will ultimately be handled by backend (I think)
        is_archived: false,
        modal_function_names: values.modal_functions.map((func: any) => func.function_name), // Will ultimately be handled by backend
        modal_functions: values.modal_functions,
        owner_identity_id: Number(auth.authorization.user.sub), // Right now backend expects int, should be a string ultimately but for now this is fine as it's not saving to DB
      });

      // Create the Garden
      setLoadingText(() => "Creating garden...");
      createGardenAndDOI({
        title: values.title,
        description: values.description,
        owner_identity_id: auth.authorization.user.sub,
        is_archived: false,
        publisher: "thegardens.ai",
        language: "en",
        version: "1.0.0",
      })
        .then(({ garden }) => {
          navigate(`/garden/${encodeURIComponent(garden.doi)}`);
        })
        .finally(() => {
          setLoadingText(() => "");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <h1 className="mb-8 text-2xl font-bold">Create Garden with Modal Functions</h1>
        <h2 className="mb-4 text-xl font-bold">Garden</h2>
        <div className="space-y-12 pb-12">
          <FormField
            control={form.control}
            name={`title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Title</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Garden Title" />
                </FormControl>
                <FormDescription>
                  The title of your Garden. This will be displayed on the Garden page and appear in
                  search results.
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
                <FormLabel className="font-bold">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Garden description" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  A high level overview of your Garden, its purpose, and its contents. This will be
                  displayed on the Garden page and appear in search results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h2 className="mb-4 text-xl font-bold">Modal Functions</h2>
        <div className="grid w-full items-center gap-1.5 space-y-12 pb-12">
          <FormField
            control={form.control}
            name="fileContents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">File</FormLabel>
                <FormControl>
                  <Input
                    id="file"
                    type="file"
                    accept=".py"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        try {
                          const fileContents = await fileToString(file);
                          field.onChange(fileContents);
                        } catch (error) {
                          console.error("Error reading file:", error);
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Your modal file containing your app definition</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <ModalFunctions />
        </div>

        <Button type="submit">Submit</Button>
        <LoadingOverlay text={loadingText} />
      </Form>
    </form>
  );
};

const ModalFunctions = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "modal_functions",
    control,
  });

  return (
    <div className="space-y-8">
      {fields.map((func, index) => (
        <ModalFunction key={func.id} index={index} remove={() => remove(index)} />
      ))}
      <Button
        type="button"
        onClick={() => {
          append({
            function_name: "",
            description: "",
            year: "2024",
            is_archived: false,
            doi: "fake_doi",
            title: "",
          });
        }}
      >
        Add Function
      </Button>
    </div>
  );
};

const ModalFunction = ({ index, remove }: { index: number; remove: () => void }) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-4 rounded-md border p-4">
      <FormLabel className="text-lg font-bold">Modal Function {index + 1}</FormLabel>
      <div className="flex items-center justify-between">
        <FormField
          control={control}
          name={`modal_functions.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {index > 0 && (
          <Button variant="destructive" onClick={remove}>
            Remove
          </Button>
        )}
      </div>

      <FormField
        control={control}
        name={`modal_functions.${index}.function_name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Function Name</FormLabel>
            <FormControl>
              <Input {...field} type="text" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`modal_functions.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell us about your modal function"
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

function fileToString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file: result is null"));
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(new Error(`Failed to read file: ${error.target?.error?.message || "Unknown error"}`));
    };

    reader.readAsText(file);
  });
}

const LoadingOverlay = ({ text }: { text: string }) => {
  return (
    text && (
      <div className="no-doc-scroll fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center space-y-4 bg-black/70">
        <h2 className="font-display text-2xl text-white">{text}</h2>
        <LoadingSpinner />
      </div>
    )
  );
};
