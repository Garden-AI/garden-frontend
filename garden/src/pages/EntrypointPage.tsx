import { useParams } from "react-router-dom";

import { useSearchGardenByDOI } from "@/api/search";

import EntrypointTabs from "@/components/EntrypointTabs";
import AssociatedMaterials from "@/components/AssociatedMaterials";
import NotFoundPage from "@/pages/NotFoundPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";
import EntrypointFunction from "@/components/EntrypointFunction";
import CopyButton from "@/components/CopyButton";
import { Link as LinkIcon, Eye, TagIcon } from "lucide-react";

const EntrypointPage = ({ bread }: { bread: any }) => {
  const { doi } = useParams() as { doi: string };

  const { data: garden, isLoading, isError } = useSearchGardenByDOI(doi!);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !garden || !garden.entrypoints[0]) return <NotFoundPage />;

  const entrypoint = garden.entrypoints[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10">
      <div className="font-display">
        <Breadcrumb
          crumbs={[
            { label: "Home", link: "/" },
            { label: "Gardens", link: "/search" },
            {
              label: garden.title,
              link: `/garden/${encodeURIComponent(`${garden.doi}`)}`,
            },
            { label: entrypoint.title },
          ]}
        />

        <header className="mb-4 flex items-start justify-between gap-x-2">
          <h1 className="text-xl font-semibold md:text-3xl">
            {entrypoint.title}
          </h1>
          <div className="hidden flex-col items-center md:flex md:flex-row">
            <CopyButton
              hint="Copy Link"
              content={window.location.href}
              icon={<LinkIcon />}
              className="border-none bg-transparent text-primary "
            />

            {/* <WithTooltip hint={"Share"}>
              <Button variant="link" onClick={() => console.log("modal")}>
                <Share2 />
              </Button>
            </WithTooltip> */}
            {/* <Modal /> */}
          </div>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <span>
            Version {garden.version} | {garden.year} |
          </span>
          <TagIcon className="h-4 w-4" />
          <span>{entrypoint.tags.join(", ")}</span>
        </div>

        <div className="mb-6 flex items-center space-x-2 text-base md:text-lg ">
          <span className="font-semibold">Contributors:</span>
          <span>{garden.authors.join(", ")}</span>
        </div>

        <div className="mb-2 flex items-center gap-2 text-lg md:text-xl">
          <h2>At a glance</h2>
          <Eye />
        </div>
        <p className="mb-6">{garden.description}</p>

        <Separator className="mb-12" />
        <EntrypointFunction gardenDOI={garden.doi} entrypoint={entrypoint} />
        <Separator className="mb-12" />
        <AssociatedMaterials entrypoint={entrypoint} />

        <EntrypointTabs entrypoint={entrypoint} />
      </div>
    </div>
  );
};

export default EntrypointPage;
