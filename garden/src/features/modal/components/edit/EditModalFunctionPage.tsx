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
    <div className="mx-auto max-w-7xl px-8 pt-16 font-display">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: modalFunction.title, link: `/modal-functions/${modalFunction.id}` },
          { label: "Edit" },
        ]}
      />
      <div className="my-8">
        <h1 className="text-2xl sm:text-3xl">Edit Modal Function Metadata</h1>
      </div>
      <EditModalFunctionForm modalFunction={modalFunction} />
    </div>
  );
};

export default EditModalFunctionPage; 