import React, { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormSchemaType, EntrypointListItem } from "./FormSchema";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ExternalLink } from "lucide-react";

const initialEntrypoints: EntrypointListItem[] = [
  {
    doi: "10.26311/3p8f-se33",
    title: "Bandgap model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
  {
    doi: "10.26311/mk1a-ve41",
    title:
      "Lithium solid state electrolyte conductivity model. Lithium solid state electrolyte conductivity model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
  {
    doi: "10.26311/17nn-hj98",
    title: "Metallic glass Rc model (LLM data)",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
];

interface SelectEntrypointsProps {
  form: UseFormReturn<FormSchemaType>;
}

export const SelectEntrypoints: React.FC<SelectEntrypointsProps> = ({
  form,
}) => {
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "entrypoint_ids",
  });

  const [selectedEntrypoints, setSelectedEntrypoints] = useState<string[]>(
    fields.map((field) => field.doi),
  );

  const handleEntrypointToggle = (doi: string) => {
    setSelectedEntrypoints((prev) => {
      const newSelection = prev.includes(doi)
        ? prev.filter((id) => id !== doi)
        : [...prev, doi];

      const newFields = initialEntrypoints.filter((ep) =>
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
        <h3 className="mb-4 text-xl font-bold">Available Entrypoints</h3>
        <div className="mb-4 min-h-[250px] overflow-x-auto border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12"></TableHead>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="w-1/6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialEntrypoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No entrypoints available
                  </TableCell>
                </TableRow>
              ) : (
                initialEntrypoints.map((ep) => (
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

      <p className="text-sm text-gray-500">
        Not seeing the Entrypoint you're looking for? You can create a new one
        by following{" "}
        <Dialog>
          <DialogTrigger className="text-primary transition hover:text-primary/80">
            {" "}
            these instructions.
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-2xl font-medium">
              Create a new Entrypoint
            </DialogTitle>
            <p className="text-sm text-gray-700">
              Create a new Entrypoint to add to your Garden.
            </p>
          </DialogContent>
        </Dialog>
      </p>
    </div>
  );
};

export default SelectEntrypoints;
