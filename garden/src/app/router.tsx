import { Navigate, Outlet, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import RootLayout from "@/components/Layout";

import EditEntrypointPage from "@/features/entrypoints/components/EditEntrypointPage";
import EntrypointPage from "@/features/entrypoints/components/EntrypointPage";
import CreateGardenPage from "@/features/gardens/components/create/CreateGardenPage";
import GardenPage from "@/features/gardens/components/GardenPage";
import HomePage from "@/components/HomePage";
import LoginPage from "@/features/auth/components/LoginPage";
import ModalFunctionPage from "@/features/modal/components/ModalFunctionPage";
import SearchPage from "@/features/search/components/SearchPage";
import TeamsPage from "@/features/team/components/TeamsPage";
import UserProfilePage from "@/features/users/components/UserProfilePage";
import { useGlobusAuth } from "@globus/react-auth-context";
import ModelDeploymentPage from "@/features/model-deployments/ModelDeploymentPage";
import { CreateModelDeploymentPage } from "@/features/model-deployments/CreateModelDeploymentPage";
import ModalAppUploadPage from "@/features/modal/components/ModalAppUploadPage";

const Router: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Garden Routes */}
        <Route path="garden">
          <Route element={<PrivateRoutes />}>
            <Route path="create" element={<CreateGardenPage />} />
          </Route>
          <Route path=":doi" element={<GardenPage />} />
          <Route path=":doi/modal-functions/:id" element={<ModalFunctionPage />} />
        </Route>

        {/* Entrypoint Routes */}
        <Route path="entrypoint">
          <Route path=":doi" element={<EntrypointPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path=":doi/edit" element={<EditEntrypointPage />} />
          </Route>
        </Route>

        {/* Modal Routes */}
        <Route path="modal-functions">
          <Route path=":id" element={<ModalFunctionPage />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="modal-app/create" element={
            <CreateModelDeploymentPage 
              form={<ModalAppUploadPage onSuccess={(id: number) => {navigate(`/model-deployments/${id}`)}} />} 
              onSuccess={(id: number) => {navigate(`/model-deployments/${id}`)}}
            />
          } />
        </Route>

        {/* Model Deployment Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="model-deployments/:id" element={<ModelDeploymentPage />} />
        </Route>

        {/* Misc Routes */}
        <Route path="team" element={<TeamsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="user" element={<UserProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const PrivateRoutes = () => {
  const { authorization } = useGlobusAuth();
  const location = useLocation();

  if (authorization === undefined) {
    return <LoadingOverlay />;
  }

  if (!authorization.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Router;
