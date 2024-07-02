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
import auth from "./lib/auth";

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
  const breadcrumbs: {
    home: string;
    search: string;
    garden: Array<string>;
    entrypoint: Array<string>;
  } = {
    home: "Home",
    search: "",
    garden: [],
    entrypoint: [],
  };

  useEffect(() => {
    async function getToken() {
      await auth.handleCodeRedirect();
      const tokens = auth.tokens.auth as any;
      console.log(tokens);
      if (tokens) {
        localStorage.setItem(
          "accessToken",
          tokens.other_tokens[0]?.access_token,
        );
      }
    }
    getToken();
  }, []);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="search" element={<SearchPage bread={breadcrumbs} />} />
        <Route element={<PrivateRoutes />}>
          <Route path="garden/create" element={<CreateGardenForm />} />
        </Route>
        <Route
          path="garden/:doi"
          element={<GardenPage bread={breadcrumbs} />}
        />
        <Route path="entrypoint/:doi" element={<EntrypointPage />} />
        <Route path="team" element={<TeamsPage />} />
        <Route path="auth" element={<LoadingSpinner />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
