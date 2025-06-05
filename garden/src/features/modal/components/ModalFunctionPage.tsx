import React from "react";
import { useParams } from "react-router-dom";

import { useGetModalFunction } from "../api/useGetModalFunction";
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGarden } from "@/features/gardens/api/useGetGarden";

import NotFoundPage from "@/components/NotFoundPage";

import { Separator } from "@/components/shadcn/separator";
import Breadcrumb from "@/components/Breadcrumb";

import { LinkIcon } from "lucide-react";
import { ModalFunction } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import CopyButton from "@/components/CopyButton";
import ModalAssociatedMaterials from "@/features/materials/components/ModalAssociatedMaterials";
import { FunctionSidebar } from "./FunctionMetadataSidebar";
import { EditableCodeField } from "@/components/EditableCodeField";
import { EditableMetadataField, EditableTitle } from "@/components/shared/metadata";
import { SUPER_USERS } from "@/utils/utils";

// Extend ModalFunction type to include owner_identity_id
type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
};

const ModalFunctionPage = () => {
  const { id, doi: gardenDOI } = useParams() as { id: string; doi?: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);
  const { data: garden, isLoading: isGardenLoading } = gardenDOI ? useGetGarden(gardenDOI) : { data: undefined, isLoading: false };
  const auth = useGlobusAuth();
  const isSuperUser = SUPER_USERS.includes(auth.authorization?.user?.sub);
  const ownsThisFunction = auth.isAuthenticated && (modalFunction?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

  if (isLoading || (gardenDOI && isGardenLoading)) return <LoadingOverlay />;

  if (isError || !modalFunction) return <NotFoundPage />;

  // Create breadcrumb items based on whether we navigated from a garden
  const breadcrumbItems = gardenDOI && garden
    ? [
      { label: "Home", link: "/" },
      { label: garden.title, link: `/garden/${encodeURIComponent(gardenDOI)}` },
      { label: modalFunction.title }
    ]
    : [
      { label: "Home", link: "/" },
      { label: modalFunction.title }
    ];

  return (
    <div className="container mb-6 max-w-7xl mx-auto px-4 md:px-6 pt-6 font-display">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <Breadcrumb
            className="mb-3"
            crumbs={breadcrumbItems}
          />
          <ModalFunctionHeader
            modalFunction={modalFunction as ModalFunctionWithOwner}
            gardenDOI={gardenDOI}
            ownsThisFunction={ownsThisFunction}
          />
          <ModalFunctionBody modalFunction={modalFunction} ownsThisFunction={ownsThisFunction} />
          <ModalFunctionExample modalFunction={modalFunction} ownsThisFunction={ownsThisFunction} gardenDOI={gardenDOI} />
          <ModalAssociatedMaterials
            resource={modalFunction}
            ownsThisFunction={ownsThisFunction}
          />
        </div>

        {/* Sidebar */}
        <FunctionSidebar
          modalFunction={modalFunction}
          ownsThisFunction={ownsThisFunction}
        />
      </div>
    </div>
  );
};

const ModalFunctionHeader = ({ modalFunction, gardenDOI, ownsThisFunction }: {
  modalFunction: ModalFunctionWithOwner;
  gardenDOI?: string;
  ownsThisFunction: boolean;
}) => {
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <EditableTitle
        entity={modalFunction}
        ownsThisEntity={ownsThisFunction}
        onUpdate={async (updateData) => {
          await patchModalFunction({
            id: modalFunction.id,
            modalFunction: updateData
          });
        }}
      />
      <div className="flex items-center gap-2">
        <CopyButton
          icon={<LinkIcon className="h-4 w-4" />}
          content={gardenDOI
            ? `${window.location.origin}/garden/${encodeURIComponent(gardenDOI)}/modal-functions/${modalFunction.id}`
            : `${window.location.origin}/modal-functions/${modalFunction.id}`}
          hint="Copy Link"
          className="border-none bg-transparent"
        />
      </div>
    </div>
  );
};

const ModalFunctionBody = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction; ownsThisFunction: boolean }) => {
  const { mutate: patchModalFunction } = usePatchModalFunction();

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={modalFunction.description || ""}
        fieldName="description"
        entity={modalFunction}
        ownsThisEntity={ownsThisFunction}
        onUpdate={async (updateData) => {
          await patchModalFunction({
            id: modalFunction.id,
            modalFunction: updateData
          });
        }}
      />
      <Separator className="my-3" />
    </div>
  );
};

const ModalFunctionExample = ({ modalFunction, ownsThisFunction, gardenDOI }: { modalFunction: ModalFunction; ownsThisFunction: boolean; gardenDOI?: string; }) => {
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();

  const doiExpression = gardenDOI ? `'${gardenDOI}'` : "my_garden_doi"

  // Create example text with fallback to default placeholder
  const defaultExample = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(${doiExpression})

input = ['Data Here']
return my_garden.${modalFunction.function_name}(input)`;

  const handleSave = async (newValue: string) => {
    await patchModalFunction({
      id: modalFunction.id,
      modalFunction: {
        example_usage: newValue
      }
    });
  };

  return (
    <EditableCodeField
      label="Example Usage"
      value={modalFunction.example_usage || defaultExample}
      fieldName="example_usage"
      onSave={handleSave}
      ownsThisFunction={ownsThisFunction}
      language="python"
    />
  );
};

export default ModalFunctionPage;
