import { LinkIcon } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { Metadata, EditableMetadataField } from "@/components/shared/metadata";
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { ModalFunction } from "@/types";

interface FunctionMetadataSidebarProps {
    modalFunction: ModalFunction,
    ownsThisFunction: boolean,
}

export const FunctionMetadataSidebar = ({
    modalFunction,
    ownsThisFunction,
}: FunctionMetadataSidebarProps) => {
    const { mutate: patchModalFunction } = usePatchModalFunction();
    const updateFunction = async (updateData: Partial<ModalFunction>) => {
        await patchModalFunction({
            id: modalFunction.id,
            modalFunction: updateData,
        });
    };

    // Helper function to format hardware specifications
    const formatHardwareSpec = (spec: { [key: string]: string } | undefined | null): string[] => {
        if (!spec) {
            return [];
        }
        return Object.entries(spec).map(([key, value]) => {
            let displayKey = key;
            if (key.toLowerCase() === 'gpus' || key.toLowerCase() === 'cpu') {
                displayKey = key.toUpperCase();
            } else if (key.toLowerCase() === 'memory') {
                displayKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            }
            if(!value) {
              value = "Not Specified";
            }
            return `${displayKey}: ${value}`;
        });
    };

    return (
        <Metadata name={"Function"} entity={modalFunction} ownsThisEntity={ownsThisFunction}>
          <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">DOI</p>
              <CopyButton 
                content={modalFunction.doi || ""} 
                hint="Copy DOI" 
                className="ml-2" 
                icon={<LinkIcon className="h-4 w-4" />}
              />
            </div>
            <div className="mt-0.5">
              <p className="font-medium font-mono text-gray-800 overflow-hidden overflow-ellipsis">
                {modalFunction.doi || "No DOI"}
              </p>
            </div>
          </div>

          <EditableMetadataField
            label="Model Authors"
            helpText="Original authors of the models used by this function"
            value={modalFunction.authors}
            fieldName="authors"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={updateFunction}
          />

          <EditableMetadataField
            label="Gardeners"
            helpText="Creator and contriubtors to this function and related materials"
            value={[modalFunction.owner, ...(modalFunction.contributors || [])]}
            fieldName="contributors"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={updateFunction}
          />

          <EditableMetadataField
            label="Year"
            helpText="Year this function was published"
            value={modalFunction.year}
            fieldName="year"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            onUpdate={updateFunction}
          />

          <EditableMetadataField
            label="Tags"
            helpText="Tags help users discover your functions"
            value={modalFunction.tags}
            fieldName="tags"
            entity={modalFunction}
            ownsThisEntity={ownsThisFunction}
            isArray={true}
            onUpdate={updateFunction}
          />

          {/* Add EditableMetadataField for Hardware Specifications (Read-Only) */}
          <EditableMetadataField
            label="Hardware Specifications"
            helpText="Compute resources allocated for the function"
            value={formatHardwareSpec(modalFunction.hardware_spec)}
            fieldName="hardware_spec"
            entity={modalFunction}
            ownsThisEntity={false}
            isArray={true}
            onUpdate={updateFunction}
          />

        </Metadata>
    );
}