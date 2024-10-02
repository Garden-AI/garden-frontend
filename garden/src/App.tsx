import { Routes, Route, RouterProvider, createHashRouter } from "react-router-dom";

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

import CreateGardenPage from "./components/form/garden/create/CreateGardenPage";
import EditEntrypointPage from "./components/form/entrypoint/edit/EditEntrypointPage";
import EditGardenPage from "./components/form/garden/edit/EditGardenPage";

/* Components */
import LoadingSpinner from "./components/LoadingSpinner";
import PrivateRoutes from "./components/PrivateRoutes";

/* Lib */
import { ModalUploadPage } from "./components/form/modal/create/ModalUploadPage";

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
          <Route element={<PrivateRoutes />}>
            <Route path="upload" element={<ModalUploadPage />} />
          </Route>
        </Route>

        {/* Misc Routes */}
        <Route path="team" element={<TeamsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="auth" element={<LoadingSpinner />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="user" element={<UserProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
