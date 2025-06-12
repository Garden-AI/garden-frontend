import React, { Suspense } from "react";
import { lazy } from "react";
import { Navigate, Outlet, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import NotFoundPage from "@/components/NotFoundPage";
import RootLayout from "@/components/Layout";

import { useGlobusAuth } from "@globus/react-auth-context";

const EntrypointTombstonePage = lazy(() => import("@/components/EntrypointTombstonePage"));
const CreateGardenPage = lazy(() => import("@/features/gardens/components/create/CreateGardenPage"));
const GardenPage = lazy(() => import("@/features/gardens/components/GardenPage"));
const HomePage = lazy(() => import("@/components/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage"));
const ModalFunctionPage = lazy(() => import("@/features/modal/components/ModalFunctionPage"));
const SearchPage = lazy(() => import("@/features/search/components/SearchPage"));
const TeamsPage = lazy(() => import("@/features/team/components/TeamsPage"));
const UserProfilePage = lazy(() => import("@/features/users/components/UserProfilePage"));
const ModelDeploymentPage = lazy(() => import("@/features/model-deployments/ModelDeploymentPage"));
const CreateModelDeploymentPage = lazy(() => import("@/features/model-deployments/CreateModelDeploymentPage"));
const ModalAppUploadPage = lazy(() => import("@/features/modal/components/ModalAppUploadPage"));
const BenchmarksPage = lazy(() => import("@/features/benchmarks/BenchmarksPage"));

const WrappedLazyComponent = ({ child }: { child: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      {child}
    </Suspense>
  )
}

const Router: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<WrappedLazyComponent child={<HomePage />} />} />
        <Route path="search" element={<WrappedLazyComponent child={<SearchPage />} />} />

        {/* Garden Routes */}
        <Route path="garden">
          <Route element={<PrivateRoutes />}>
            <Route path="create" element={<WrappedLazyComponent child={<CreateGardenPage />} />} />
          </Route>
          <Route path=":doi" element={<WrappedLazyComponent child={<GardenPage />} />} />
          <Route path=":doi/modal-functions/:id" element={<WrappedLazyComponent child={<ModalFunctionPage />} />} />
        </Route>

        {/* Entrypoint Routes - All archived */}
        <Route path="entrypoint/*" element={<WrappedLazyComponent child={<EntrypointTombstonePage />} />} />

        {/* Modal Routes */}
        <Route path="modal-functions">
          <Route path=":id" element={<WrappedLazyComponent child={<ModalFunctionPage />} />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="modal-app/create" element={
            <WrappedLazyComponent child={
              <CreateModelDeploymentPage
                form={<ModalAppUploadPage onSuccess={(id: number) => { navigate(`/model-deployments/${id}`) }} />}
                onSuccess={(id: number) => { navigate(`/model-deployments/${id}`) }}
              />
            } />
          } />
        </Route>

        {/* Model Deployment Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="model-deployments/:id" element={<WrappedLazyComponent child={<ModelDeploymentPage />} />} />
        </Route>

        {/* Misc Routes */}
        <Route path="team" element={<WrappedLazyComponent child={<TeamsPage />} />} />
        <Route path="login" element={<WrappedLazyComponent child={<LoginPage />} />} />
        <Route path="user" element={<WrappedLazyComponent child={<UserProfilePage />} />} />
        <Route path="benchmarks" element={<WrappedLazyComponent child={<BenchmarksPage />} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes >
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
