import React, { useEffect, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useGetEntrypoints } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Minus, GripVertical } from "lucide-react";
import WithTooltip from "@/components/WithTooltip";

import { FormSchemaType, EntrypointListItem } from "./FormSchema";

const initialEntrypoints: EntrypointListItem[] = [
  { doi: "1", title: "Home", description: "Main page" },
  { doi: "2", title: "About", description: "About us page" },
  { doi: "3", title: "Contact", description: "Contact page" },
];

interface SelectEntrypointsProps {
  form: UseFormReturn<FormSchemaType>;
}

function SortableItem({
  doi,
  title,
  description,
  onRemove,
}: EntrypointListItem & { onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: doi });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-1/12">
        <GripVertical className="outline-none" {...attributes} {...listeners} />
      </TableCell>
      <TableCell className="w-1/3 truncate">{title}</TableCell>
      <TableCell className="w-1/3 truncate">{description}</TableCell>
      <TableCell className="w-1/12">
        <WithTooltip hint="Remove entrypoint">
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Minus className="h-4 w-4 text-xs" />
          </Button>
        </WithTooltip>
      </TableCell>
    </TableRow>
  );
}

export const SelectEntrypoints: React.FC<SelectEntrypointsProps> = ({
  form,
}) => {
  const { data: availableEntrypoints } = useGetEntrypoints({
    userId: "1234",
    gardenId: "5678",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "entrypoint_ids",
  });

  const [availableEntrypointList, setAvailableEntrypointList] =
    useState<EntrypointListItem[]>(initialEntrypoints);

  useEffect(() => {
    const entrypoints = availableEntrypoints || initialEntrypoints;
    const selectedIds = new Set((fields || []).map((f) => f.doi));
    setAvailableEntrypointList(
      entrypoints.filter((ep) => !selectedIds.has(ep.doi)),
    );
  }, [availableEntrypoints, fields]);

  const handleAddEntrypoint = (entrypoint: EntrypointListItem) => {
    append(entrypoint);
  };

  const handleRemoveEntrypoint = (index: number) => {
    remove(index);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields?.findIndex((f) => f.doi === active.id) ?? -1;
      const newIndex = fields?.findIndex((f) => f.doi === over.id) ?? -1;
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  return (
    <div>
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Available Entrypoints</h2>
        <div className={`mb-4 min-h-[250px] overflow-x-hidden border`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="w-1/12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableEntrypointList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No entrypoints available
                  </TableCell>
                </TableRow>
              ) : (
                availableEntrypointList.map((ep) => (
                  <TableRow key={ep.doi} className="h-16">
                    <TableCell className="w-1/3 truncate">{ep.title}</TableCell>
                    <TableCell className="w-1/2 truncate">
                      {ep.description}
                    </TableCell>
                    <TableCell className="w-1/12">
                      <WithTooltip hint="Add entrypoint">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddEntrypoint(ep)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </WithTooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="">
        <h2 className="mb-4 text-xl font-bold">Selected Entrypoints</h2>
        <div className="mb-4 min-h-[250px] overflow-auto border">
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12"></TableHead>
                  <TableHead className="w-1/3">Name</TableHead>
                  <TableHead className="w-1/3">Description</TableHead>
                  <TableHead className="w-1/12"></TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={fields?.map((f) => f.doi) ?? []}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {!fields || fields.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        No entrypoints selected
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => (
                      <SortableItem
                        key={field.doi}
                        {...field}
                        onRemove={() => handleRemoveEntrypoint(index)}
                      />
                    ))
                  )}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default SelectEntrypoints;
