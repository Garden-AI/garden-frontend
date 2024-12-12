import React from "react";

import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkIcon, FlaskConicalIcon } from "lucide-react";
import { toast } from "sonner";

import Breadcrumb from "@/components/Breadcrumb";
import CopyButton from "@/components/CopyButton";
import EntrypointBox from "./EntrypointBox";
import ModalFunctionBox from "./ModalFunctionBox";
import GardenDropdownOptions from "@/features/gardens/components/GardenDropdownOptions";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import RelatedGardens from "@/features/gardens/components/RelatedGardens";
import ShareModal from "@/components/ShareModal";
import TombstonePage from "@/components/TombstonePage";
import LoadingSpinner from "@/components/LoadingSpinner";

import { useGetGarden } from "../api/useGetGarden";
import { usePatchGarden } from "../api/usePatchGarden";
import { useQueryClient } from "@tanstack/react-query";
import { Garden } from "@/types";

import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import SaveGardenButton from "./SaveGardenButton";

const GardenPage = () => {
  const { doi } = useParams();
  if (!doi) {
    return <NotFoundPage />;
  }

  const auth = useGlobusAuth();
  const { data: garden, isLoading, isError } = useGetGarden(doi);
  const { mutate: updateGarden } = usePatchGarden();

  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (isError || !garden) {
    return <NotFoundPage />;
  }

  if (garden.is_archived) {
    return <TombstonePage garden={garden} />;
  }
  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;

  return (
    <div className="mx-auto max-w-7xl px-8 pt-16 font-display">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          {
            label: garden.title,
            link: `/garden/${encodeURIComponent(garden.doi)}`,
          },
        ]}
      />
      <GardenHeader garden={garden} ownsThisGarden={ownsThisGarden} />
      <GardenBody garden={garden} />
      {ownsThisGarden && garden.is_test && <VisibilityWarning garden={garden} updateGarden={updateGarden} />}
      <GardenAccordion garden={garden} />
      <RelatedGardens doi={garden.doi} />
    </div>
  );
};

const GardenHeader = ({ garden, ownsThisGarden }: { garden: Garden, ownsThisGarden: boolean }) => {
  return (
    <div className="my-8 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl sm:text-3xl">{garden.title}</h1>
        {ownsThisGarden && garden.is_archived && (
          <Badge className="ml-4 mt-1 px-3 text-sm" variant={"default"}>
            {"Archived"}
          </Badge>
        )}
      </div>
      <div className="flex items-center">
        <CopyButton
          icon={<LinkIcon />}
          content={`https://doi.org/${garden.doi}`}
          hint="Copy Link"
        />
        <ShareModal doi={garden.doi} />
        <SaveGardenButton garden={garden} />
        <GardenDropdownOptions garden={garden} />
      </div>
    </div>
  );
};

const GardenBody = ({ garden }: { garden: Garden }) => {
  return (
    <div className="mb-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
      <div className="flex w-full flex-row justify-between">
        <div className="mb-4">
          <h2 className="font-semibold">Contributors</h2>
          <p>{garden.authors?.join(", ")}</p>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">DOI</h2>
        <div className="flex items-center">
          <a
            href={`https://doi.org/${garden.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline"
          >
            {garden.doi}
          </a>
          <CopyButton content={garden.doi} hint="Copy DOI" className="h-8 w-8 p-0.5" />
          <Badge 
            variant={garden.doi_is_draft ? "outline" : "default"}
            className="text-xs font-medium"
          >
            {garden.doi_is_draft ? "Draft" : "Registered"}
          </Badge>
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Description</h2>
        <p>{garden.description}</p>
      </div>
    </div>
  );
};

const VisibilityWarning = ({ garden, updateGarden }: { garden: Garden; updateGarden: Function }) => {
  if (!auth.isAuthenticated || garden.owner_identity_id !== auth.authorization?.user?.sub) {
    return null;
  }
  const [isUpdating, setIsUpdating] = React.useState(false);
  const queryClient = useQueryClient();

  const handleMakePublic = () => {
    setIsUpdating(true);
    updateGarden(
      {
        doi: garden.doi,
        garden: { is_test: false }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["gardens"] });
          queryClient.invalidateQueries({ queryKey: ["search"] });
        },
        onError: () => {
          toast.error("Failed to make garden public. Please try again.");
        },
        onSettled: () => {
          setIsUpdating(false);
        }
      }
    );
  };

  return (
    <div className="mb-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <FlaskConicalIcon className="mt-1 h-5 w-5 text-yellow-600" />
        <div>
          <h3 className="font-medium text-yellow-900">This is a Test Garden</h3>
          <p className="mt-1 text-sm text-yellow-700">
            This garden won't show up in search results. Other users can still access it directly if you share the link.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
            onClick={handleMakePublic}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <LoadingSpinner/>
                Making Public...
              </>
            ) : (
              "Make Garden Public"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const GardenAccordion = ({ garden }: { garden: Garden }) => {
  const tabs = [
    {
      name: "Entrypoints",
      content: <EntrypointsTab garden={garden} />,
    },

    {
      name: "Datasets",
      content: <DatasetsTab garden={garden} />,
    },
  ];
  return (
    <Tabs defaultValue="entrypoints" className="mb-12 mt-10 min-h-[400px] w-full">
      <TabsList className="m-0 grid w-full grid-cols-2 rounded-none bg-transparent p-0 ">
        {tabs.map(({ name }) => (
          <TabsTrigger
            key={name}
            value={name.toLowerCase()}
            className="m-0 rounded-none border-b-4 border-transparent bg-gray-100 bg-gradient-to-b py-2 text-base text-black transition-none hover:border-primary hover:from-gray-100 hover:from-70% hover:to-primary data-[state=active]:border-green data-[state=active]:bg-primary/30 data-[state=active]:bg-none"
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ name, content }) => (
        <TabsContent key={name} value={name.toLowerCase()} className="px-4 py-8">
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

const EntrypointsTab = ({ garden }: { garden: Garden }) => {
  const entrypoints = garden.entrypoints || [];
  const modalFunctions = garden.modal_functions || [];
  const entrypointBoxes = entrypoints.map((entrypoint: any) => (
    <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} />
  ));
  const modalFunctionBoxes = modalFunctions.map((modalFunction: any) => (
    <ModalFunctionBox key={modalFunction.id} modalFunction={modalFunction} />
  ));
  const functionBoxes = entrypointBoxes.concat(modalFunctionBoxes);

  if (!functionBoxes || functionBoxes.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">No Entrypoints Found</h2>
        <p className="mt-2 text-gray-600">There are no entrypoints linked to this resource.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{functionBoxes}</div>
  );
};

const DatasetsTab = ({ garden }: { garden: Garden }) => {
  const datasets =
    garden.entrypoints
      ?.map((entrypoint) => entrypoint.datasets || [])
      .flat()
      .filter((dataset, index, self) => {
        return index === self.findIndex((t) => t.doi === dataset.doi);
      }) || [];

  if (datasets.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">No Datasets Found</h2>
        <p className="mt-2 text-gray-600">There are no datasets linked to this resource.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-16 grid grid-cols-1 gap-2 px-4 pt-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-4 ">
        {datasets?.map((dataset: any) => (
          <Card key={dataset.doi} className="rounded-lg border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{dataset.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-gray-600">Data Type:</span>{" "}
                {dataset.data_type || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">DOI:</span>{" "}
                <a
                  href={`https://doi.org/${dataset.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {dataset.doi}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex justify-start ">
              <Button variant="default" size={"sm"} asChild className="text-xs">
                <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                  View Dataset
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {datasets.some((dataset) => dataset.url.toString().includes("foundry")) && (
        <div>
          <p className="mb-8 text-center text-lg">
            One or more of these datasets uses Foundry, here is how you can view it:
          </p>
          <div className="rounded-xl bg-gray-800 py-6 pl-6 text-white sm:mx-8 lg:mx-32">
            <code className="leading-loose">
              <span className="text-gray-400">
                # Make sure you've imported and instantiated foundry <br />
              </span>
              <span className="text-purple-600">from</span> foundry{" "}
              <span className="text-purple-600">import</span> Foundry <br />f{" "}
              <span className="text-indigo-400">=</span> Foundry()
              <br />
              <br />
              <span className="text-gray-400">
                # Load the data here <br />
              </span>
              dataset <span className="text-indigo-400">=</span> f.get_dataset(
              <span className="text-green">'DOI goes here'</span>)
              <br />
              dataset.get_as_dict()
            </code>
          </div>
          <p className="pt-8 text-center text-lg ">
            New to Foundry or need a refresher? Click{" "}
            <Link
              target="blank"
              to="https://ai-materials-and-chemistry.gitbook.io/foundry/"
              className="text-blue hover:underline"
            >
              here
            </Link>{" "}
            to learn more.
          </p>
        </div>
      )}
    </div>
  );
};

export default GardenPage;
