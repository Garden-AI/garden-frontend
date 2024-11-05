import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "@/components/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";

import { EditGardenForm } from "./components/EditGardenForm";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useGetGarden } from "../view/api/useGetGarden";
import { useGetUserInfo } from "@/features/users/view/api/useGetUserInfo";

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

      <EditGardenForm garden={garden} />
    </div>
  );
};
export default EditGardenPage;
