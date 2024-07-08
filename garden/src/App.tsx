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
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";

/* Components */
import CreateGardenForm from "./components/form/CreateGardenForm";
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
  const auth = useGlobusAuth();
  useEffect(() => {
    async function getToken() {
      await auth.authorization?.handleCodeRedirect();
    }
    getToken();
  }, [auth]);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Garden Routes */}
        <Route path="garden">
          <Route element={<PrivateRoutes />}>
            <Route path="create" element={<CreateGardenForm />} />
            <Route path=":doi/edit" element={<CreateGardenForm />} />
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
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
