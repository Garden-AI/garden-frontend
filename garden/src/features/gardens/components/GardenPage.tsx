import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Breadcrumb from "@/components/Breadcrumb";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import TombstonePage from "@/components/TombstonePage";

import { useGetGarden } from "../api/useGetGarden";
import { useGlobusAuth } from "@globus/react-auth-context";

import { MaterialsProvider } from '@/features/materials/contexts/MaterialsContext';

import { Garden } from "@/types";

import {
  VisibilityWarning,
  ReviewNotice,
} from "./garden-page";
import { GardenMetadataSidebar } from "./GardenMetadataSidebar";
import { SUPER_USERS } from "@/utils/utils";
import { GardenHeader, GardenContentView, GardenPublishModal } from "./shared/GardenComponents";

interface GardenContentProps {
  garden: Garden;
  ownsThisGarden: boolean;
  isNewlyCreated: boolean;
}

const GardenContent = ({ garden, ownsThisGarden, isNewlyCreated }: GardenContentProps) => {
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
            <GardenHeader
              garden={garden}
              ownsThisGarden={ownsThisGarden}
              setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
            />

            <GardenContentView
              garden={garden}
              ownsThisGarden={ownsThisGarden}
            />
          </div>
          {/* Metadata Details */}
          <GardenMetadataSidebar
            garden={garden}
            ownsThisGarden={ownsThisGarden}
          />
        </div>
      </div>

      <GardenPublishModal
        garden={garden}
        isPublishGardenModalOpen={isPublishGardenModalOpen}
        setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
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