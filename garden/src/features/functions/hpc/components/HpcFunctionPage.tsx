import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useGetHpcFunction } from "../api/useGetHpcFunction";
import { usePatchHpcFunction } from "../api/usePatchHpcFunction";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGarden } from "@/features/gardens/api/useGetGarden";

import NotFoundPage from "@/components/NotFoundPage";

import { Separator } from "@/components/shadcn/separator";
import Breadcrumb from "@/components/Breadcrumb";

import { LinkIcon } from "lucide-react";
import { HpcFunctionMetadataResponse as HpcFunction, HpcFunctionPatchRequest } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import CopyButton from "@/components/CopyButton";
import AssociatedMaterials from "../../shared/components/AssociatedMaterials";
import { FunctionSidebar } from "../../shared/components/FunctionSidebar";
import { EditableCodeField } from "@/components/EditableCodeField";
import { EditableMetadataField, EditableTitle } from "@/components/shared/metadata";
import { SUPER_USERS } from "@/utils/utils";
import { GardenFunction, TypedHpcFunction } from "../../shared/types/function.types";

const HpcFunctionPage = () => {
  const { id, doi: gardenDOI } = useParams() as { id: string; doi?: string };
  const { data: hpcFunction, isError, isLoading } = useGetHpcFunction(id);
  const { data: garden, isLoading: isGardenLoading } = gardenDOI ? useGetGarden(gardenDOI) : { data: undefined, isLoading: false };
  const auth = useGlobusAuth();
  const isSuperUser = SUPER_USERS.includes(auth.authorization?.user?.sub ?? "");
  const ownsThisFunction = isSuperUser;

  if (isLoading || (gardenDOI && isGardenLoading)) return <LoadingOverlay />;

  if (isError || !hpcFunction) return <NotFoundPage />;

  // Create a typed GardenFunction object
  const gardenFunction: GardenFunction = {
    ...hpcFunction,
    functionType: 'hpc',
  };

  // Create breadcrumb items based on whether we navigated from a garden
  const breadcrumbItems = gardenDOI && garden
    ? [
      { label: "Home", link: "/" },
      { label: garden.title, link: `/garden/${encodeURIComponent(gardenDOI)}` },
      { label: hpcFunction.title }
    ]
    : [
      { label: "Home", link: "/" },
      { label: hpcFunction.title }
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
          <HpcFunctionHeader
            hpcFunction={gardenFunction as TypedHpcFunction}
            gardenDOI={gardenDOI}
            ownsThisFunction={ownsThisFunction}
          />
          <HpcFunctionBody hpcFunction={gardenFunction as TypedHpcFunction} ownsThisFunction={ownsThisFunction} />
          <HpcFunctionExample hpcFunction={gardenFunction as TypedHpcFunction} ownsThisFunction={ownsThisFunction} gardenDOI={gardenDOI} />
          <AssociatedMaterials
            resource={gardenFunction}
            ownsThisFunction={ownsThisFunction}
          />
        </div>

        {/* Sidebar */}
        <FunctionSidebar
          gardenFunction={gardenFunction}
          ownsThisFunction={ownsThisFunction}
        />
      </div>
    </div>
  );
};

export const HpcFunctionHeader = ({ hpcFunction, gardenDOI, ownsThisFunction }: {
  hpcFunction: TypedHpcFunction;
  gardenDOI?: string;
  ownsThisFunction: boolean;
}) => {
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(hpcFunction.id);

  const handleUpdate = useCallback(async (updateData: HpcFunctionPatchRequest) => {
    await patchHpcFunction(updateData);
  }, [patchHpcFunction]);

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <EditableTitle
        entity={hpcFunction}
        ownsThisEntity={ownsThisFunction}
        onUpdate={handleUpdate}
      />
      <div className="flex items-center gap-2">
        <CopyButton
          icon={<LinkIcon className="h-4 w-4" />}
          content={gardenDOI
            ? `${window.location.origin}/garden/${encodeURIComponent(gardenDOI)}/hpc-functions/${hpcFunction.id}`
            : `${window.location.origin}/hpc-functions/${hpcFunction.id}`}
          hint="Copy Link"
          className="border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export const HpcFunctionBody = ({ hpcFunction, ownsThisFunction }: { hpcFunction: TypedHpcFunction; ownsThisFunction: boolean }) => {
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(hpcFunction.id);

  const handleUpdate = useCallback(async (updateData: HpcFunctionPatchRequest) => {
    await patchHpcFunction(updateData);
  }, [patchHpcFunction]);

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={hpcFunction.description || ""}
        fieldName="description"
        entity={hpcFunction}
        ownsThisEntity={ownsThisFunction}
        onUpdate={handleUpdate}
      />
      <Separator className="my-3" />
    </div>
  );
};

export const HpcFunctionExample = ({ hpcFunction, ownsThisFunction, gardenDOI }: { hpcFunction: TypedHpcFunction; ownsThisFunction: boolean; gardenDOI?: string; }) => {
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(hpcFunction.id);

  const doiExpression = gardenDOI ? `'${gardenDOI}'` : "my_garden_doi"

  // Create example text with fallback to default placeholder
  const defaultExample = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(${doiExpression})

# Note: HPC function execution happens via Globus Compute.
input = ['Data Here']
future = my_garden.${hpcFunction.function_name}.submit(input, endpoint='my-globus-compute-endpoint')
results = future.result()`;

  const handleSave = useCallback(async (newValue: string) => {
    await patchHpcFunction({
        example_usage: newValue
    });
  }, [patchHpcFunction]);

  return (
    <EditableCodeField
      label="Example Usage"
      value={hpcFunction.example_usage || defaultExample}
      fieldName="example_usage"
      onSave={handleSave}
      ownsThisEntity={ownsThisFunction}
      language="python"
      editing={false}
      showSaveButton={true}
    />
  );
};

export default HpcFunctionPage;