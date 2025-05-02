import CopyButton from "@/components/CopyButton";
import { ClipboardIcon, } from "lucide-react";
import { Garden } from "@/types";
import { usePatchGarden } from "../api/usePatchGarden";
import { Metadata, EditableMetadataField } from "@/components/shared/metadata";
import { CitationBlock } from "./garden-page";

export const GardenMetadataSidebar = ({garden, ownsThisGarden}: {garden: Garden, ownsThisGarden: boolean}) => {
    const { mutate: patchGarden } = usePatchGarden();
    const updateGarden = async (updateData: Partial<Garden>) => {
        await patchGarden({
            doi: garden.doi,
            garden: updateData
        });
    };

    return (
        <Metadata name={"Garden"} entity={garden} ownsThisEntity={ownsThisGarden}>
            {/* DOI Field */}
            <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                        DOI
                    </p>
                    <CopyButton
                        content={garden.doi}
                        hint="Copy DOI"
                        className="ml-2"
                        icon={<ClipboardIcon className="h-4 w-4" />}
                    />
                </div>
                <div className="mt-0.5">
                    <p className="font-medium font-mono text-gray-800 overflow-hidden overflow-ellipsis">
                        {garden.doi}
                    </p>
                </div>
            </div>

            <EditableMetadataField
                label="Model Authors"
                helpText="Original authors of the models in this Garden"
                value={garden.authors}
                fieldName="authors"
                entity={garden}
                ownsThisEntity={ownsThisGarden}
                isArray={true}
                onUpdate={updateGarden}
            />

            <EditableMetadataField
                label="Gardeners"
                helpText="Creator and contributors to this Garden"
                value={[garden.owner, ...(garden.contributors || [])]}
                fieldName="contributors"
                entity={garden}
                ownsThisEntity={ownsThisGarden}
                isArray={true}
                onUpdate={updateGarden}
            />

            <EditableMetadataField
                label="Year"
                helpText="Year this Garden was created"
                value={garden.year}
                fieldName="year"
                entity={garden}
                ownsThisEntity={ownsThisGarden}
                onUpdate={updateGarden}
            />

            <EditableMetadataField
                label="Tags"
                helpText="Tags help users discover this Garden"
                value={garden.tags}
                fieldName="tags"
                entity={garden}
                ownsThisEntity={ownsThisGarden}
                isArray={true}
                onUpdate={updateGarden}
            />

            {/* Citation */}
            <div className="mt-4 bg-white rounded-md p-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">Cite this Garden</p>
                    <CopyButton
                        content={`@software{
  title = {${garden.title}},
  year = {${garden.year || 'n.d.'}},
  publisher = {Garden AI},
  doi = {${garden.doi}}
}`}
                        hint="Copy Citation"
                        icon={<ClipboardIcon className="h-4 w-4" />}
                    />
                </div>
                <CitationBlock garden={garden} />
            </div>
        </Metadata>)
};