import { useParams } from "react-router-dom";
import { Link as LinkIcon, Eye, TagIcon } from "lucide-react";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";
import CopyButton from "@/components/CopyButton";
import ShareModal from "@/components/ShareModal";
import { Separator } from "@/components/shadcn/separator";
import { Entrypoint, Garden } from "@/types";
import { useGetEntrypoint } from "../api/useGetEntrypoint";
import { useSearchGardenByDOI } from "@/features/search/api/useSearchGardenByDOI";
import EntrypointTabs from "@/features/entrypoints/components/EntrypointTabs";
import EntrypointFunction from "@/features/entrypoints/components/EntrypointFunction";
import AssociatedMaterials from "@/features/gardens/components/AssociatedMaterials";
import Markdown from "@/components/Markdown";

const EntrypointPage = () => {
  const { doi } = useParams() as { doi: string };
  const { data: entrypoint, isError, isLoading } = useGetEntrypoint(doi);

  const { data: garden, isLoading: gardenIsLoading } = useSearchGardenByDOI(doi);

  if (isLoading || gardenIsLoading) return <LoadingOverlay />;

  if (isError || !entrypoint) return <NotFoundPage />;

  if (!garden) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-7xl px-8 pt-16 font-display">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          garden && {
            label: garden?.title,
            link: `/garden/${encodeURIComponent(garden.doi)}`,
          },
          { label: entrypoint.title },
        ]}
      />
      <EntrypointHeader entrypoint={entrypoint} doi={doi} />
      <EntrypointBody garden={garden} entrypoint={entrypoint} />
      <EntrypointFunction gardenDOI={garden.doi} entrypoint={entrypoint} />
      <AssociatedMaterials resource={entrypoint} />
      <EntrypointTabs entrypoint={entrypoint} />
    </div>
  );
};

const EntrypointHeader = ({ entrypoint, doi }: { entrypoint: Entrypoint; doi: string }) => {
  return (
    <div className="mb-4 ">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl md:text-3xl">{entrypoint.title}</h1>
        <div className="hidden flex-col items-center md:flex md:flex-row">
          <CopyButton
            hint="Copy Link"
            content={`https://doi.org/${doi}`}
            icon={<LinkIcon />}
            className="border-none bg-transparent"
          />
          <ShareModal doi={doi} />
        </div>
      </div>
    </div>
  );
};

const EntrypointBody = ({ garden, entrypoint }: { garden: Garden; entrypoint: Entrypoint }) => {
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
        <span>{entrypoint.authors?.join(", ")}</span>
      </div>

      <div className="mb-2 flex items-center gap-2 text-lg md:text-xl">
        <Eye />
        <h2>At a glance</h2>
      </div>
      <Markdown content={entrypoint.description || ""} className="mb-6" />

      <Separator className="mb-12" />
    </div>
  );
};
export default EntrypointPage;
