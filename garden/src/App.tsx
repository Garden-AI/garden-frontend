import { authorization } from "@globus/sdk/cjs";
import {
  Routes,
  Route,
  RouterProvider,
  createHashRouter,
  Outlet,
} from "react-router-dom";
import GardenPage from "./pages/GardenPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import EntrypointPage from "./pages/EntrypointPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TeamsPage from "./pages/TeamsPage";
import useGoogleAnalytics from "./services/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import NotFoundPage from "./pages/NotFoundPage";

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

authorization.create({
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
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
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
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// TODO: Extract this to a separate file, perhaps in a 'layouts' folder
function RootLayout() {
  useGoogleAnalytics();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
