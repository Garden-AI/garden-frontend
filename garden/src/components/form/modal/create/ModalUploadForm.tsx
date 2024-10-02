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

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

export const ModalUploadForm = () => {
  const auth = useGlobusAuth();
  const { mutateAsync: createModalApp } = useCreateModalApp();
  const { mutateAsync: createGarden } = useCreateGarden();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        // file: z
        //   .instanceof(File)
        //   .refine((file) => {
        //     return !file || file.size <= MAX_UPLOAD_SIZE;
        //   }, "File size must be less than 3MB")
        //   .refine((file) => {
        //     return file.type === "text/x-python";
        //   }, "File must be a Python file"),

        modal_functions: z
          .array(
            z.object({
              title: z.string().min(1, { message: "Function title is required" }),
              description: z.string(),
              function_name: z.string().min(1, { message: "Function name is required" }),
              year: z.string().min(4, { message: "Year must be 4 digits" }),
              is_archived: z.boolean(),
            }),
          )
          .min(1, { message: "At least one function is required." }),
      }),
    ),
    mode: "onSubmit",
    defaultValues: {
      file: undefined,
      modal_functions: [],
    },
  });

  const onSubmit = async ({ file, modal_functions }: any) => {
    if (!auth.authorization?.user?.sub) {
      throw new Error("Must be authenticated");
    }
    try {
      createModalApp(
        {
          owner_identity_id: auth.authorization?.user?.sub,
          modal_functions,
        },
        {
          onSuccess(data, variables, context) {
            console.log(data);
            createGarden({
              owner_identity_id: auth.authorization.user.sub!,
            });
          },
        },
      );
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
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">File</FormLabel>
                <FormControl>
                  <Input
                    id="file"
                    type="file"
                    accept=".py"
                    onChange={(event) => {
                      if (event.target.files) return field.onChange(event.target.files[0]);
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

  // console.log(fields);

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
