import { EditEntrypointForm } from "./EditEntrypointForm";
import Breadcrumb from "@/components/Breadcrumb";
import { useGetEntrypoint, useSearchGardenByDOI } from "@/api";
import NotFoundPage from "@/pages/NotFoundPage";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetUserInfo } from "@/api/getUserInfo";

export default function EditEntrypointPage() {
  const { doi } = useParams<{ doi: string }>();
  const navigate = useNavigate();
  if (!doi) {
    return <NotFoundPage />;
  }

  const { data: entrypoint, isLoading: entrypointLoading } =
    useGetEntrypoint(doi);
  const { data: garden, isLoading: gardenLoading } = useSearchGardenByDOI(doi);
  const { data: user, isLoading: userLoading } = useGetUserInfo();

  if (entrypointLoading || gardenLoading || userLoading) {
    return <LoadingSpinner />;
  }

  if (!entrypoint || !garden || !user) {
    return <NotFoundPage />;
  }

  if (user.identity_id !== entrypoint.owner_identity_id) {
    navigate(`/entrypoint/${encodeURIComponent(entrypoint.doi)}`);
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 font-display">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          {
            label: garden.title,
            link: `/garden/${encodeURIComponent(garden.doi)}`,
          },
          {
            label: entrypoint.title,
            link: `/entrypoint/${encodeURIComponent(entrypoint.doi)}`,
          },
          { label: `Edit ${entrypoint.title}` },
        ]}
      />

      <h1 className="mb-8 text-4xl font-medium sm:text-3xl">Edit Entrypoint</h1>
      <EditEntrypointForm entrypoint={entrypoint} />
    </div>
  );
}
