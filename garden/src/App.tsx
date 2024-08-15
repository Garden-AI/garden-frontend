import {
  Routes,
  Route,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { useEffect } from "react";

/* Pages */
import RootLayout from "./pages/RootLayout";
import GardenPage from "./pages/GardenPage";
import TermsPage from "./pages/TermsPage";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";

import EntrypointPage from "./pages/EntrypointPage";
import TeamsPage from "./pages/TeamsPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import MetadataEditing from "./pages/MetadataEditing";
import useGoogleAnalytics from "./services/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EntrypointEditing from "./pages/EntrypointEditing";

import { Toaster } from "sonner";

/* Components */
import CreateGardenPage from "./components/form/CreateGarden/CreateGardenPage";
import LoadingSpinner from "./components/LoadingSpinner";
import PrivateRoutes from "./components/PrivateRoutes";

/* Lib */
import { useGlobusAuth } from "./components/auth/useGlobusAuth";

export default function App() {
  return (
    <RouterProvider
      router={createHashRouter([
        {
          path: "*",
          element: <Root />,
        },
      ])}
    />
  );
}

function Root() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Garden Routes */}
        <Route path="garden">
          <Route element={<PrivateRoutes />}>
            <Route path="create" element={<CreateGardenPage />} />
            <Route path=":doi/edit" element={<CreateGardenPage />} />
            <Route path=":doi/metadataEditing" element={<MetadataEditing />} />
            <Route path=":doi/entrypointEditing" element={<EntrypointEditing />} />
          </Route>
          <Route path=":doi" element={<GardenPage />} />
        </Route>

        {/* Entrypoint Routes */}
        <Route path="entrypoint">
          <Route path=":doi" element={<EntrypointPage />} />
        </Route>

        {/* Misc Routes */}
        <Route path="team" element={<TeamsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="auth" element={<LoadingSpinner />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="userProfilePage" element={<UserProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
