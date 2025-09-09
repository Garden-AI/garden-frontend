import React from "react";
import { Garden } from "@/types";
import { EditableTitle } from "@/components/shared/metadata";
import SaveGardenButton from "../SaveGardenButton";
import { ShareGardenButton } from "../ShareGardenButton";
import GardenDropdownOptions from "../GardenDropdownOptions";
import { PublishGardenModal } from "../GardenDropdownOptions";
import { GardenDescription } from "../garden-page";
import { GardenTabbedSection } from "../GardenTabbedSection";
import { usePatchGarden } from "../../api/usePatchGarden";

interface GardenHeaderProps {
    garden: Garden;
    ownsThisGarden: boolean;
    setIsPublishGardenModalOpen: (open: boolean) => void;
    redirectPath?: string;
    onAfterDelete?: () => void;
}

export const GardenHeader = ({ garden, ownsThisGarden, setIsPublishGardenModalOpen, redirectPath, onAfterDelete }: GardenHeaderProps) => {
    const { mutateAsync: patchGarden } = usePatchGarden();

    return (
        <div className="flex justify-between items-start mb-4">
            <EditableTitle
                entity={garden}
                ownsThisEntity={ownsThisGarden}
                onUpdate={async (updateData) => {
                    await patchGarden({
                        doi: garden.doi,
                        garden: updateData
                    });
                }}
            />
            <div className="flex items-center">
                <SaveGardenButton garden={garden} />
                <ShareGardenButton garden={garden} />
                <GardenDropdownOptions
                    garden={garden}
                    setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
                    redirectPath={redirectPath}
                    onAfterDelete={onAfterDelete}
                />
            </div>
        </div>
    );
};

interface GardenContentViewProps {
    garden: Garden;
    ownsThisGarden: boolean;
}

export const GardenContentView = ({ garden, ownsThisGarden }: GardenContentViewProps) => {
    return (
        <>
            <GardenDescription garden={garden} ownsThisGarden={ownsThisGarden} />

            <div className="mt-4">
                <GardenTabbedSection
                    garden={garden}
                    ownsThisGarden={ownsThisGarden}
                />
            </div>
        </>
    );
};

interface GardenPublishModalProps {
    garden: Garden;
    isPublishGardenModalOpen: boolean;
    setIsPublishGardenModalOpen: (open: boolean) => void;
}

export const GardenPublishModal = ({ garden, isPublishGardenModalOpen, setIsPublishGardenModalOpen }: GardenPublishModalProps) => {
    return (
        <PublishGardenModal
            isOpen={isPublishGardenModalOpen}
            setIsOpen={setIsPublishGardenModalOpen}
            garden={garden}
        />
    );
};
