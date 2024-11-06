import { EditEntrypointForm } from "./EditEntrypointForm";
import Breadcrumb from "@/components/Breadcrumb";
import NotFoundPage from "@/components/NotFoundPage";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchGardenByDOI } from "@/features/search/api/useSearchGardenByDOI";
import { useGetUserInfo } from "@/features/users/api/useGetUserInfo";
import { useGetEntrypoint } from "../api/useGetEntrypoint";

export default function EditEntrypointPage() {
  const { doi } = useParams<{ doi: string }>();
  const navigate = useNavigate();
  if (!doi) {
    return <NotFoundPage />;
  }

  const { data: entrypoint, isLoading: entrypointLoading } = useGetEntrypoint(doi);
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
    <div className="mx-auto max-w-7xl px-8 pb-8 pt-16 font-display">
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

      <EditEntrypointForm entrypoint={entrypoint} />
    </div>
  );
}
