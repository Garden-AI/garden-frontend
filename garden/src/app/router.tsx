import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFoundPage from "@/components/NotFoundPage";
import RootLayout from "@/components/Layout";

import EditEntrypointPage from "@/features/entrypoints/components/EditEntrypointPage";
import EntrypointPage from "@/features/entrypoints/components/EntrypointPage";
import CreateGardenPage from "@/features/gardens/components/create/CreateGardenPage";
import EditGardenPage from "@/features/gardens/components/edit/EditGardenPage";
import GardenPage from "@/features/gardens/components/GardenPage";
import HomePage from "@/components/HomePage";
import LoginPage from "@/features/auth/components/LoginPage";
import ModalFunctionPage from "@/features/modal/components/ModalFunctionPage";
import SearchPage from "@/features/search/components/SearchPage";
import TeamsPage from "@/features/team/components/TeamsPage";
import UserProfilePage from "@/features/users/components/UserProfilePage";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { EditModalFunctionForm } from "@/features/modal/components/edit/EditModalFunctionForm";
import EditModalFunctionPage from "@/features/modal/components/edit/EditModalFunctionPage";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Garden Routes */}
        <Route path="garden">
          <Route element={<PrivateRoutes />}>
            <Route path="create" element={<CreateGardenPage />} />
            <Route path=":doi/edit" element={<EditGardenPage />} />
          </Route>
          <Route path=":doi" element={<GardenPage />} />
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
          <Route element={<PrivateRoutes />}>
            <Route path=":id/edit" element={<EditModalFunctionPage />} />
          </Route>
        </Route>

        {/* Misc Routes */}
        <Route path="team" element={<TeamsPage />} />
        <Route path="auth" element={<LoadingSpinner />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="user" element={<UserProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const PrivateRoutes = () => {
  const { isLoading, authorization } = useGlobusAuth();
  const location = useLocation();

  if (isLoading || authorization === undefined) {
    return <LoadingOverlay />;
  }

  if (!authorization.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Router;
