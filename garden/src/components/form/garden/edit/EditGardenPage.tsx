import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";
import { useGetGarden, useGetUserInfo } from "@/api";
import { EditGardenForm } from "./EditGardenForm";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const EditGardenPage = () => {
  const { doi } = useParams() as { doi: string };
  const navigate = useNavigate();
  const { data: garden, isLoading: gardenLoading, isError } = useGetGarden(doi!);
  const { data: user, isLoading: userLoading } = useGetUserInfo();

  if (gardenLoading || userLoading) {
    return <LoadingOverlay />;
  }

  if (isError || !garden || !user) {
    return <NotFoundPage />;
  }

  if (user.identity_id !== garden.owner_identity_id) {
    navigate(`/garden/${encodeURIComponent(garden.doi)}`);
    return null;
  }

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
          { label: `Edit ${garden.title}` },
        ]}
      />

      <h1 className="mb-4 text-2xl sm:text-3xl">Edit {garden.title}</h1>
      <EditGardenForm garden={garden} />
    </div>
  );
};
export default EditGardenPage;
