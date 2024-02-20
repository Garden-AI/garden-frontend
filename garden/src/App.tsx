import React from 'react';
import { authorization } from "@globus/sdk/cjs";
import { SEARCH_SCOPE, GLOBUS_NATIVE_CLIENT_ID } from "./constants";
import { HashRouter, Routes, Route } from "react-router-dom";
import GardenPage from './pages/GardenPage';
import TermsPage from './pages/TermsPage';
import ScrollToTop from './components/ScrollToTop'
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import PipelinePage from './pages/PipelinePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TeamsPage from './pages/TeamsPage';

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

function App() {
  const breadcrumbs: { home: string; search: string; garden: Array<string>; pipeline: Array<string>; } = {
    home: 'Home',
    search: '',
    garden: [],
    pipeline: []

  }
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
          <Route path="/garden/:doi" element={<GardenPage bread={breadcrumbs} />} />
          <Route path="/pipeline/:doi" element={<PipelinePage bread={breadcrumbs} />} />
          <Route path="/team" element={<TeamsPage/>}/>
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  )
}


export default App;
