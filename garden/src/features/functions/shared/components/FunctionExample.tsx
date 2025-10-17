import React, { useCallback } from "react";
import { EditableCodeField } from "@/components/EditableCodeField";

interface FunctionExampleProps<T extends Record<string, any>> {
  functionData: T & { function_name: string; example_usage?: string };
  ownsThisFunction: boolean;
  onUpdate: (updateData: Partial<T>) => Promise<void>;
  generateDefaultExample: (functionName: string, gardenDOI?: string) => string;
  gardenDOI?: string;
}

export const FunctionExample = <T extends Record<string, any>>({
  functionData,
  ownsThisFunction,
  onUpdate,
  generateDefaultExample,
  gardenDOI,
}: FunctionExampleProps<T>) => {
  const handleSave = useCallback(
    async (newValue: string) => {
      await onUpdate({ example_usage: newValue } as any);
    },
    [onUpdate]
  );

  const defaultExample = generateDefaultExample(functionData.function_name, gardenDOI);

  return (
    <EditableCodeField
      label="Example Usage"
      value={functionData.example_usage || defaultExample}
      fieldName="example_usage"
      onSave={handleSave}
      ownsThisEntity={ownsThisFunction}
      language="python"
      editing={false}
      showSaveButton={true}
    />
  );
};
