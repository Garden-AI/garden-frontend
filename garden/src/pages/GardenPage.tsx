import { useParams, Link, Outlet } from "react-router-dom";
import EntrypointBox from "../components/EntrypointBox";
import Breadcrumb from "../components/Breadcrumb";
import { Entrypoint, Garden } from "@/api/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShareModal from "@/components/ShareModal";
import NotFoundPage from "./NotFoundPage";
import CopyButton from "@/components/CopyButton";
import RelatedGardens from "@/components/RelatedGardens";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../api/getUserInfo";
import { useGetUserGardens } from "../api/getUserGardens";
import { useGetGarden } from "@/api";
import { useEffect } from "react";
import { useGardenContext } from "@/components/garden/Context";
// import GardenDropdownOptions from "@/components/GardenDropdownOptions";

export default function GardenPage() {
  const { doi } = useParams();
  if (!doi) {
    return <NotFoundPage />;
  }

  const {
    data: garden,
    isLoading: fetchGardensLoading,
    isError: fetchGardensError,
  } = useGetGarden(doi);

  const {
    data: userGardens,
    isLoading: userGardensLoading,
    isError: userGardensError,
  } = useGetUserGardens();

  const gardenContext = useGardenContext();

  useEffect(() => {
    if (garden) {
      gardenContext.updateGarden(garden);
    }
  }, [garden]);

  const canEditGarden = (() => {
    if (!garden || !userGardens) return false;

    for (const userGarden of userGardens) {
      if (userGarden.doi === garden.doi) {
        // return true when adding edit button back in
        // change back to return false later
        return true;
      }
    }
    return false;
  })();

  if (fetchGardensLoading || userGardensLoading) {
    return <LoadingSpinner />;
  }
  if (fetchGardensError || userGardensError || !garden) {
    return <NotFoundPage />;
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
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
      <GardenHeader garden={garden} />
      <GardenBody garden={garden} canEditGarden={canEditGarden} />
      <GardenAccordion garden={garden} />
      <RelatedGardens doi={garden.doi} />
    </div>
  );
}

function GardenHeader({ garden }: { garden: Garden }) {
  return (
    <div className="my-8 flex items-center justify-between gap-2 sm:gap-4">
      <h1 className="text-2xl sm:text-3xl">{garden.title}</h1>
      <div className="flex items-center">
        <CopyButton
          icon={<LinkIcon />}
          content={window.location.href}
          hint="Copy Link"
        />
        <ShareModal doi={garden.doi} />
        {/* <GardenDropdownOptions garden={garden} /> */}
      </div>
    </div>
  );
}

function GardenBody({
  garden,
  canEditGarden,
}: {
  garden: Garden;
  canEditGarden: boolean;
}) {
  const navigate = useNavigate();

  const handleEditGardenClick = () => {
    navigate(`metadataEditing`); //
  };

  return (
    <div className="mb-20 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
      <div className="flex w-full flex-row justify-between">
        <div className="mb-4">
          <h2 className="font-semibold">Contributors</h2>
          <p>{garden.authors?.join(", ")}</p>
        </div>
        {canEditGarden && (
          <button
            onClick={handleEditGardenClick}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm",
            )}
          >
            Edit Garden
          </button>
        )}
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
          <CopyButton
            content={garden.doi}
            hint="Copy DOI"
            className="h-8 w-8 p-0.5"
          />
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Description</h2>
        <p>{garden.description}</p>
      </div>
    </div>
  );
}

function GardenAccordion({ garden }: { garden: Garden }) {
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
    <Tabs defaultValue="entrypoints" className="mb-12 min-h-[400px] w-full">
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
        <TabsContent
          key={name}
          value={name.toLowerCase()}
          className="px-4 py-8"
        >
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function EntrypointsTab({ garden }: { garden: Garden }) {
  const entrypoints = garden.entrypoints;
  if (!entrypoints || entrypoints.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">
          No Entrypoints Found
        </h2>
        <p className="mt-2 text-gray-600">
          There are no entrypoints linked to this resource.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entrypoints.map((entrypoint: any) => (
        <EntrypointBox
          key={entrypoint.doi}
          entrypoint={entrypoint}
          isEditing={false}
        />
      ))}
    </div>
  );
}

function DatasetsTab({ garden }: { garden: Garden }) {
  const datasets = garden.entrypoints
    ?.map((e: Entrypoint) => e.datasets || [])
    .reduce((acc, val) => acc.concat(val), []);

  if (!datasets || datasets.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">
          No Datasets Found
        </h2>
        <p className="mt-2 text-gray-600">
          There are no datasets linked to this resource.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-16 grid grid-cols-1 gap-2 px-4 pt-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-4 ">
        {datasets?.map((dataset: any) => (
          <Card
            key={dataset.doi}
            className="rounded-lg border border-gray-200 shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {dataset.title}
              </CardTitle>
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
      {datasets.some((dataset) =>
        dataset.url.toString().includes("foundry"),
      ) && (
        <div>
          <p className="mb-8 text-center text-lg">
            One or more of these datasets uses Foundry, here is how you can view
            it:
          </p>
          <div className="rounded-xl bg-gray-800 py-6 pl-6 text-white sm:mx-8 lg:mx-32">
            <code className="leading-loose">
              <span className="text-gray-400">
                # Make sure you've imported and instantiated foundry <br />
              </span>
              <span className="text-purple">from</span> foundry{" "}
              <span className="text-purple">import</span> Foundry <br />
              f = Foundry()
              <br />
              <br />
              <span className="text-gray-400">
                # Load the data here <br />
              </span>
              f.load(
              <span className="text-green">'DOI goes here'</span>, globus=
              <span className="text-orange">False</span>)
              <br />
              res = f.load_data()
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
}
