import React, { useCallback } from "react";
import { Separator } from "@/components/shadcn/separator";
import { EditableMetadataField } from "@/components/shared/metadata";

interface FunctionBodyProps<T extends Record<string, any>> {
  functionData: T & { description: string | null };
  ownsThisFunction: boolean;
  onUpdate: (updateData: Partial<T>) => Promise<void>;
}

export const FunctionBody = <T extends Record<string, any>>({
  functionData,
  ownsThisFunction,
  onUpdate,
}: FunctionBodyProps<T>) => {
  const handleUpdate = useCallback(
    async (updateData: Partial<T>) => {
      await onUpdate(updateData);
    },
    [onUpdate]
  );

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={functionData.description || ""}
        fieldName="description"
        entity={functionData as any}
        ownsThisEntity={ownsThisFunction}
        onUpdate={handleUpdate}
      />
      <Separator className="my-3" />
    </div>
  );
};
