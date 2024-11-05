import { Routes, Route } from "react-router-dom";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useGlobusAuth } from "@/features/auth/hooks/useGlobusAuth";
import RootLayout from "../features/root/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFoundPage from "@/components/NotFoundPage";
import LoginPage from "@/features/auth/components/LoginPage";
import EditEntrypointPage from "@/features/entrypoints/edit/components/EditEntrypointPage";
import EntrypointPage from "@/features/entrypoints/view/EntrypointPage";

import EditGardenPage from "@/features/gardens/edit/EditGardenPage";
import GardenPage from "@/features/gardens/view/GardenPage";
import HomePage from "@/features/home/HomePage";
import ModalFunctionPage from "@/features/modal/view/ModalFunctionPage";
import SearchPage from "@/features/search/SearchPage";
import TeamsPage from "@/features/team/TeamsPage";
import CreateGardenPage from "@/features/gardens/create/CreateGardenPage";
import UserProfilePage from "@/features/users/view/UserProfilePage";

const Router = () => {
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
        <Route path="modal">
          <Route path=":id" element={<ModalFunctionPage />} />
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
