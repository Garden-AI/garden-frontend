import React from "react";
import { CreateGardenForm } from "./CreateGardenForm";
import { FunctionTypeSelection } from "./FunctionTypeSelection";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetGlobusGroups } from "@/features/gardens/api/useGetGlobusGroups";
import ModalAppUploadPage from "@/features/functions/modal/components/ModalAppUploadPage";
import HpcFunctionUploadPage from "@/features/functions/hpc/components/HpcFunctionUploadPage";
import { OverallProgress } from "@/components/progress/OverallProgress";
import { useState } from "react";
import { GlobusGroupError } from "@/features/globus/components/GlobusGroupError";

/**
 * Main garden creation page
 * Flow:
 * 1. No params -> Show function type selection
 * 2. deploy=modal-app -> Modal upload (Phase 1)
 * 3. deploy=hpc-function -> HPC upload (Phase 1)
 * 4. modalAppId or hpcFunctionIds -> Garden creation form (Phase 2)
 */
const CreateGardenPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modalAppId = searchParams.get("modalAppId");
  const hpcFunctionIds = searchParams.get("hpcFunctionIds");
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

  // No params -> Show function type selection (Step 0)
  if (!deployType && !modalAppId && !hpcFunctionIds) {
    return (
      <div className="mx-auto max-w-6xl px-8 py-16 font-display">
        <FunctionTypeSelection />
      </div>
    );
  }

  // deploy=modal-app -> Show Modal App upload form (Phase 1)
  if (deployType === "modal-app") {
    return (
      <div className="mx-auto max-w-6xl px-8 py-16 font-display">
        <OverallProgress currentPhase={1} functionType="modal" />
        <ModalAppUploadPage
          onSuccess={(id: number) => {
            navigate(`/garden/create?modalAppId=${id}`);
          }}
        />
      </div>
    );
  }

  // deploy=hpc-function -> Show HPC Function upload form (Phase 1)
  if (deployType === "hpc-function") {
    return (
      <div className="mx-auto max-w-6xl px-8 py-16 font-display">
        <OverallProgress currentPhase={1} functionType="hpc" />
        <HpcFunctionUploadPage
          onSuccess={(ids: number[]) => {
            navigate(`/garden/create?hpcFunctionIds=${ids.join(",")}`);
          }}
        />
      </div>
    );
  }

  // modalAppId or hpcFunctionIds present -> Show garden creation form (Phase 2)
  const hpcFunctionIdArray = hpcFunctionIds?.split(",").map(id => parseInt(id, 10)) || undefined;
  const functionType = modalAppId ? 'modal' : hpcFunctionIds ? 'hpc' : 'modal';

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      {(modalAppId || hpcFunctionIds) && (
        <OverallProgress
          currentPhase={2}
          isSubmitting={isSubmitting}
          functionType={functionType}
        />
      )}
      <CreateGardenForm
        modalAppId={modalAppId || undefined}
        hpcFunctionIds={hpcFunctionIdArray}
        hasModalApp={!!modalAppId}
        hasHpcFunctions={!!hpcFunctionIds}
        onFormStateChange={onFormStateChange}
      />
    </div>
  );
};

export default CreateGardenPage;
