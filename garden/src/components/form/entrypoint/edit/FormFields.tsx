import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector from "@/components/ui/multiple-select";
import AssociatedMaterials from "./AssociatedMaterials";

export default function FormFields() {
  const navigate = useNavigate();
  const form = useFormContext();

  return (
    <div className="space-y-12 rounded-xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Entrypoint</h1>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">General</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter entrypoint title" {...field} className="w-full" />
                </FormControl>
                <FormDescription>
                  Provide a concise, descriptive title for your entrypoint. This will be displayed
                  and used in search results.
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
                <FormLabel className="font-bold text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your entrypoint..."
                    className="resize-vertical min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-600">
                  Provide a clear, informative description of your entrypoint. This will help users
                  understand its purpose and content.
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
                <FormLabel className="font-bold text-gray-700">Tags</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    className="w-full"
                    placeholder="Add relevant tags"
                    creatable
                    onChange={(value) => {
                      field.onChange(value.map((v: any) => v.value));
                    }}
                    value={field.value.map((v: any) => ({ value: v, label: v }))}
                  />
                </FormControl>
                <FormDescription>
                  Add descriptive tags to improve discoverability and categorization of your
                  entrypoint.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">Contributors</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Authors *</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    placeholder="Add authors"
                    creatable
                    onChange={(value) => {
                      field.onChange(value.map((v: any) => v.value));
                    }}
                    value={field.value.map((v: any) => ({ value: v, label: v }))}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  List the primary contributors to this entrypoint. Include at least one author to
                  properly attribute the work.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">
          Associated Materials
        </h2>
        <AssociatedMaterials />
      </section>

      <div className="mt-8 flex justify-end gap-x-4">
        <Button type="button" variant="outline" onClick={() => navigate("/")} className="px-6 py-2">
          Cancel
        </Button>
        <Button type="submit" className="px-6 py-2 text-white ">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
