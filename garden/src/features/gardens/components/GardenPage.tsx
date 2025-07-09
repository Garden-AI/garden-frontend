import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Breadcrumb from "@/components/Breadcrumb";
import GardenDropdownOptions from "@/features/gardens/components/GardenDropdownOptions";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import TombstonePage from "@/components/TombstonePage";
import SaveGardenButton from "./SaveGardenButton";
import { PublishGardenModal } from "@/features/gardens/components/GardenDropdownOptions";

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";
import { useGlobusAuth } from "@globus/react-auth-context";

import { MaterialsProvider } from '@/features/materials/contexts/MaterialsContext';

import { Garden } from "@/types";

import {
  GardenDescription,
  VisibilityWarning,
  ReviewNotice,
} from "./garden-page";
import { GardenTabbedSection } from "./GardenTabbedSection";
import { GardenMetadataSidebar } from "./GardenMetadataSidebar";
import { EditableTitle } from "@/components/shared/metadata";

import { SUPER_USERS } from "@/utils/utils";

interface GardenContentProps {
  garden: Garden;
  ownsThisGarden: boolean;
  isNewlyCreated: boolean;
}

const GardenContent = ({ garden, ownsThisGarden, isNewlyCreated }: GardenContentProps) => {
  const { mutateAsync: patchGarden } = usePatchGarden();
  const isPublished = !garden.is_archived && !garden.doi_is_draft;
  const [isPublishGardenModalOpen, setIsPublishGardenModalOpen] = React.useState(false);

  return (
    <div className="container max-w-7xl">
      <div className="mt-2 mb-4">
        <Breadcrumb
          crumbs={[
            { label: "Home", link: "/" },
            { label: "Gardens", link: "/search" },
            { label: garden.title, link: `/garden/${garden.doi}` },
          ]}
        />
      </div>

      {/* Display review notice for newly created gardens */}
      <ReviewNotice
        isNewlyCreated={isNewlyCreated}
        ownsThisGarden={ownsThisGarden}
      />

      {ownsThisGarden && !isPublished && (
        <VisibilityWarning
          garden={garden}
          isPublishGardenModalOpen={isPublishGardenModalOpen}
          setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
        />
      )}

      {/* Hero Metadata Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Title, Description & Core Metadata */}
          <div className="lg:w-2/3">
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
              <div className="flex">
                <SaveGardenButton garden={garden} />
                <GardenDropdownOptions
                  garden={garden}
                  setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
                />
              </div>
            </div>

            <GardenDescription garden={garden} ownsThisGarden={ownsThisGarden} />

            {/* Tabbed Section */}
            <div className="mt-4">
              <GardenTabbedSection
                garden={garden}
                ownsThisGarden={ownsThisGarden}
              />
            </div>

          </div>
          {/* Metadata Details */}
          <GardenMetadataSidebar
            garden={garden}
            ownsThisGarden={ownsThisGarden}
          />
        </div>
      </div>

      <PublishGardenModal
        isOpen={isPublishGardenModalOpen}
        setIsOpen={setIsPublishGardenModalOpen}
        garden={garden}
      />
    </div>
  );
};

const GardenPage = () => {
  const { doi } = useParams();
  const [searchParams] = useSearchParams();
  const isNewlyCreated = searchParams.get('newlyCreated') === 'true';

  const auth = useGlobusAuth();
  const { data: garden, isLoading, isError, refetch } = useGetGarden(doi || '');

  const memoizedRefetch = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (isError || !garden) {
    return <NotFoundPage />;
  }

  if (garden.is_archived) {
    return <TombstonePage garden={garden} />;
  }

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub)
  const ownsThisGarden = auth?.isAuthenticated && (garden.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

  return (
    <MaterialsProvider garden={garden} refetchGarden={memoizedRefetch}>
      <GardenContent
        garden={garden}
        ownsThisGarden={ownsThisGarden}
        isNewlyCreated={isNewlyCreated}
      />
    </MaterialsProvider>
  );
};

export default GardenPage;