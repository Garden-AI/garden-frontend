import React, { useCallback } from "react";
import { LinkIcon } from "lucide-react";
import { EditableTitle } from "@/components/shared/metadata";
import CopyButton from "@/components/CopyButton";
import { generateFunctionUrl } from "../utils/url.utils";

interface FunctionHeaderProps<T extends Record<string, any>> {
  functionData: T & { id: number; title: string };
  functionType: 'modal' | 'hpc';
  gardenDOI?: string;
  ownsThisFunction: boolean;
  onUpdate: (updateData: Partial<T>) => Promise<void>;
}

export const FunctionHeader = <T extends Record<string, any>>({
  functionData,
  functionType,
  gardenDOI,
  ownsThisFunction,
  onUpdate,
}: FunctionHeaderProps<T>) => {
  const handleUpdate = useCallback(
    async (updateData: Partial<T>) => {
      await onUpdate(updateData);
    },
    [onUpdate]
  );

  const functionUrl = generateFunctionUrl(functionType, functionData.id, gardenDOI);

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <EditableTitle
        entity={functionData as any}
        ownsThisEntity={ownsThisFunction}
        onUpdate={handleUpdate}
      />
      <div className="flex items-center gap-2">
        <CopyButton
          icon={<LinkIcon className="h-4 w-4" />}
          content={functionUrl}
          hint="Copy Link"
          className="border-none bg-transparent"
        />
      </div>
    </div>
  );
};
