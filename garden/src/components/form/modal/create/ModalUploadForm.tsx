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
import { useCreateGarden } from "@/api";
import { useState } from "react";

export const ModalUploadForm = () => {
  const auth = useGlobusAuth();
  const { mutateAsync: createModalApp } = useCreateModalApp();
  const [isParsingFile, setIsParsingFile] = useState(false);

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
      }),
    ),
    mode: "onSubmit",
    defaultValues: {
      fileContents: "",
      modal_functions: [],
    },
  });

  const onSubmit = async (values: any) => {
    if (!auth.authorization?.user?.sub) {
      throw new Error("Must be authenticated");
    }
    try {
      createModalApp({
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
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 p-20">
      <Form {...form}>
        <h1 className="text-2xl font-bold">Create Modal App</h1>
        <div className="grid w-full max-w-sm items-center gap-1.5">
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
        </div>

        <ModalFunctions />
        <Button type="submit">Submit</Button>
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
      <div className="flex items-center justify-between">
        <FormField
          control={control}
          name={`modal_functions.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="destructive" onClick={remove}>
          Remove
        </Button>
      </div>

      <FormField
        control={control}
        name={`modal_functions.${index}.function_name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Function Name</FormLabel>
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
            <FormLabel>Description</FormLabel>
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
