import { useParams } from "react-router-dom";

import { useSearchGardenByDOI } from "@/api";

import EntrypointTabs from "@/components/EntrypointTabs";
import AssociatedMaterials from "@/components/AssociatedMaterials";
import NotFoundPage from "@/pages/NotFoundPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";
import EntrypointFunction from "@/components/EntrypointFunction";
import CopyButton from "@/components/CopyButton";
import { Link as LinkIcon, Eye, TagIcon } from "lucide-react";
import ShareModal from "@/components/ShareModal";
import { Entrypoint, Garden } from "@/api/types";

const EntrypointPage = () => {
  const { doi } = useParams() as { doi: string };

  const { data: garden, isLoading, isError } = useSearchGardenByDOI(doi!);

  if (isLoading) return <LoadingSpinner />;

  const entrypoint = garden?.entrypoints?.find(
    (entrypoint) => entrypoint.doi === doi,
  );
  if (isError || !garden || !entrypoint) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
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
      <EntrypointHeader entrypoint={entrypoint} doi={doi} />
      <EntrypointBody garden={garden} entrypoint={entrypoint} />
      <EntrypointFunction gardenDOI={garden.doi} entrypoint={entrypoint} />
      <AssociatedMaterials entrypoint={entrypoint} />
      <EntrypointTabs entrypoint={entrypoint} />
    </div>
  );
};

function EntrypointHeader({
  entrypoint,
  doi,
}: {
  entrypoint: Entrypoint;
  doi: string;
}) {
  return (
    <div className="mb-4 flex gap-x-2">
      <h1 className="text-xl md:text-3xl">{entrypoint.title}</h1>
      <div className="hidden flex-col items-center md:flex md:flex-row">
        <CopyButton
          hint="Copy Link"
          content={window.location.href}
          icon={<LinkIcon />}
          className="border-none bg-transparent"
        />
        <ShareModal doi={doi} />
      </div>
    </div>
  );
}

function EntrypointBody({
  garden,
  entrypoint,
}: {
  garden: Garden;
  entrypoint: Entrypoint;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <span>
          Version {garden.version} | {garden.year} |
        </span>
        <TagIcon className="h-4 w-4" />
        <span>{entrypoint.tags?.join(", ")}</span>
      </div>

      <div className="mb-6 flex items-center space-x-2 text-base md:text-lg ">
        <span className="font-semibold">Contributors:</span>
        <span>{garden.authors?.join(", ")}</span>
      </div>

      <div className="mb-2 flex items-center gap-2 text-lg md:text-xl">
        <Eye />
        <h2>At a glance</h2>
      </div>
      <p className="mb-6">{garden.description}</p>

      <Separator className="mb-12" />
    </div>
  );
}
export default EntrypointPage;
