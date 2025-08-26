import React from "react";
import { useGetGarden } from "../../gardens/api/useGetGarden";
import { MaterialsProvider } from "../../materials/contexts/MaterialsContext";
import TombstonePage from "@/components/TombstonePage";
import {
    GardenHeader,
    GardenContentView,
    GardenPublishModal,
} from "../../gardens/components/shared/GardenComponents";
import { Garden } from "@/types";

type UnifiedGardenContentProps = {
    garden: Garden;
    ownsThisGarden: boolean;
};

export const UnifiedGardenContent = ({
    garden,
    ownsThisGarden,
}: UnifiedGardenContentProps) => {
    const [isPublishGardenModalOpen, setIsPublishGardenModalOpen] = React.useState(false);

    // Fetch fresh garden data to ensure updates are reflected
    const { data: freshGarden, refetch } = useGetGarden(garden.doi);

    // Use fresh data if available, fallback to prop
    const currentGarden = freshGarden || garden;

    const memoizedRefetch = React.useCallback(async () => {
        await refetch();
    }, [refetch]);

    // Show tombstone page for archived gardens
    if (currentGarden.is_archived) {
        return (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent">
                <TombstonePage garden={currentGarden} />
            </div>
        );
    }

    return (
        <MaterialsProvider garden={currentGarden} refetchGarden={memoizedRefetch}>
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
                <div className="mb-6">
                    <GardenHeader
                        garden={currentGarden}
                        ownsThisGarden={ownsThisGarden}
                        setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
                    />

                    <GardenContentView garden={currentGarden} ownsThisGarden={ownsThisGarden} />
                </div>

                <GardenPublishModal
                    garden={currentGarden}
                    isPublishGardenModalOpen={isPublishGardenModalOpen}
                    setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
                />
            </div>
        </MaterialsProvider>
    );
};
