import { authorization } from "@globus/sdk/cjs";
/*import { AuthorizationManager } from "@globus/sdk/lib/core/authorization/AuthorizationManager";*/
import { SEARCH_SCOPE, GLOBUS_NATIVE_CLIENT_ID } from "./constants";
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

console.log('Authorization module exports:', authorization);

/*
  We are not making calls that need authentication, but making a PKCEAuthorization 
  is the only way to trigger the createStorage() side effect. 
  That lets us use the Globus SDK to make search calls.
*/
new authorization.PKCEAuthorization({
  client_id: GLOBUS_NATIVE_CLIENT_ID,
  redirect_uri: "http://localhost:3000/",
  requested_scopes: `openid profile email ${SEARCH_SCOPE}`,
});

const router = createHashRouter([
  {
    path: "*",
    element: <Root />,
  },
]);

function App() {
  const breadcrumbs: { home: string; search: string; garden: Array<string>; entrypoint: Array<string>; } = {
    home: 'Home',
    search: '',
    garden: [],
    entrypoint: []

// TODO: Extract this to a separate file, perhaps in a 'layouts' folder
function RootLayout() {
  useGoogleAnalytics();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
