import { authorization } from "@globus/sdk/cjs";
import {
  Routes,
  Route,
  RouterProvider,
  createHashRouter,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import GardenPage from "./pages/GardenPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import EntrypointPage from "./pages/EntrypointPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TeamsPage from "./pages/TeamsPage";
import UserProfilePage from "./pages/UserProfilePage";
import useGoogleAnalytics from "./services/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 20,
    },
  },
});

/*
  We are not making calls that need authentication, but making a PKCEAuthorization 
  is the only way to trigger the createStorage() side effect. 
  That lets us use the Globus SDK to make search calls.
*/

const authManager = authorization.create({
  client: import.meta.env.VITE_GLOBUS_CLIENT_ID,
  redirect: import.meta.env.VITE_GLOBUS_REDIRECT_URI,
  scopes: import.meta.env.VITE_GLOBUS_SEARCH_SCOPE,
});

const router = createHashRouter([
  {
    path: "*",
    element: <Root />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
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

  const [isAuthenticated, setAuthenticated] = useState(authManager.authenticated);

    useEffect(() => {
        async function getToken() {
            await authManager.handleCodeRedirect();
            setAuthenticated(authManager.authenticated);
            console.log(authManager.tokens);
        }
        getToken();
    }, []);

    function handleLogin() {
      authManager.login();
    }

    function handleLogOut() {
        setAuthenticated(false);
        authManager.revoke();
        window.location.replace("/");
    }

  return (
    <Routes>
      <Route path="*" element={<RootLayout isAuthenticated={isAuthenticated} logIn={handleLogin} logOut={handleLogOut} />}>
        <Route index element={<HomePage />} />
        {/*  We should eventually eliminate this next route unless there is explicit need for it- can just use '/' as 'home' */}
        <Route path="home" element={<HomePage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="search" element={<SearchPage bread={breadcrumbs} />} />
        <Route
          path="garden/:doi"
          element={<GardenPage bread={breadcrumbs} />}
        />
        <Route
          path="entrypoint/:doi"
          element={<EntrypointPage bread={breadcrumbs} />}
        />
        <Route path="team" element={<TeamsPage />} />
        <Route path="userProfilePage" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
}

// TODO: Extract this to a separate file, perhaps in a 'layouts' folder
function RootLayout(
  {
    isAuthenticated,
    logIn,
    logOut,
  }: {
    isAuthenticated: boolean;
    logIn: () => void;
    logOut: () => void;
  }
) {
  useGoogleAnalytics();
  return (
    <>
      <ScrollToTop />
      <Navbar isAuthenticated={isAuthenticated} logIn={logIn} logOut={logOut} />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
