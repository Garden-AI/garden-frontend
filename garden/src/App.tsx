import { authorization } from "@globus/sdk";
import { HashRouter, Routes, Route } from "react-router-dom";
import GardenPage from "./pages/GardenPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import EntrypointPage from "./pages/EntrypointPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TeamsPage from "./pages/TeamsPage";

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

function App() {
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
    <div>
      <HashRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/search" element={<SearchPage bread={breadcrumbs} />} />
          <Route
            path="/garden/:doi"
            element={<GardenPage bread={breadcrumbs} />}
          />
          <Route
            path="/entrypoint/:doi"
            element={<EntrypointPage bread={breadcrumbs} />}
          />
          <Route path="/team" element={<TeamsPage />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
