import React from "react";
import { CreateGardenForm } from "./CreateGardenForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetGlobusGroups } from "@/features/gardens/api/useGetGlobusGroups";
import ModalAppUploadPage from "@/features/modal/components/ModalAppUploadPage";
import { OverallProgress } from "@/components/progress/OverallProgress";
import { useState } from "react";
import { GlobusGroupError } from "@/features/globus/components/GlobusGroupError";

/**
 * Main garden creation page
 * Renders the garden creation form that can optionally use a modal app ID from the URL params
 * Or show a modal app upload form when deploy=modal-app query param is present
 */
const CreateGardenPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modalAppId = searchParams.get("modalAppId");
  const deployType = searchParams.get("deploy");
  const { data: groups } = useGetGlobusGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Callback for tracking form submission state
  const onFormStateChange = (submitting: boolean) => {
    setIsSubmitting(submitting);
  };

  if (!groups?.find((group) => group.id === import.meta.env.VITE_GLOBUS_GROUP_UUID)) {
    return <GlobusGroupError />;
  }

  // If deploy=modal-app, show the Modal App upload form (Phase 1)
  if (deployType === "modal-app") {
    return (
      <div className="mx-auto max-w-6xl px-8 py-16 font-display">
        <OverallProgress currentPhase={1} />
        <ModalAppUploadPage
          onSuccess={(id: number) => {
            navigate(`/garden/create?modalAppId=${id}`);
          }}
        />
      </div>
    );
  }

  // If modalAppId is present, show the garden creation form (Phase 2)
  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      {modalAppId && <OverallProgress currentPhase={2} isSubmitting={isSubmitting} />}
      <CreateGardenForm
        modalAppId={modalAppId}
        hasModalApp={!!modalAppId}
        onFormStateChange={onFormStateChange}
      />
    </div>
  );
};

export default CreateGardenPage;
