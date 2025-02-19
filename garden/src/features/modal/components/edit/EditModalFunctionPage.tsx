import { useParams, Navigate } from "react-router-dom";
import { useGetModalFunction } from "../../api/useGetModalFunction";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import { EditModalFunctionForm } from "./EditModalFunctionForm";
import Breadcrumb from "@/components/Breadcrumb";

const EditModalFunctionPage = () => {
  const { id } = useParams() as { id: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);
  const auth = useGlobusAuth();
  const isOwner = auth.isAuthenticated && modalFunction?.owner_identity_id === auth?.authorization?.user?.sub;

  if (isLoading) return <LoadingOverlay />;
  if (isError || !modalFunction) return <NotFoundPage />;
  if (!isOwner) return <Navigate to={`/modal-functions/${id}`} replace />;

  return (
    <div className="mx-auto max-w-7xl px-8 py-4 font-display md:py-16">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: modalFunction.title, link: `/modal-functions/${modalFunction.id}` },
          { label: "Edit" },
        ]}
      />
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Edit Modal Function</h1>
      </div>

      <div className="pb-8">
        <EditModalFunctionForm modalFunction={modalFunction} />
      </div>
    </div>
  );
};

export default EditModalFunctionPage; 