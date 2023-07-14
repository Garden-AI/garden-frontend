import React from 'react';
import RealStuff from './RealStuff'
import { HashRouter, Routes, Route } from "react-router-dom";
import GardenPage from './pages/GardenPage';
import AboutPage from './pages/AboutPage';
import ScrollToTop from './components/ScrollToTop'
// import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import PipelinePage from './pages/PipelinePage';
import Navbar from './components/Navbar';

// The App.css styles conflict with the placeholder,
// but we can bring them back once we get rid of the placeholder.
// import './App.css';

import { useEffect, useState } from "react";
import { authorization } from "@globus/sdk";
import { GLOBUS_NATIVE_CLIENT_ID, SEARCH_SCOPE } from './constants';

const pkce = authorization.pkce({
  client_id: GLOBUS_NATIVE_CLIENT_ID,
  /**
   * The redirect URI Globus Auth will send requests to after authorization.
   */
  redirect_uri: "http://localhost:3000/",
  /**
   * Any supported Globus scopes required by your application.
   */
  requested_scopes: `openid profile email ${SEARCH_SCOPE}`,
});

function App() {
  const [isAuthenticated, setAuthenticated] = useState(pkce.hasToken());

    useEffect(() => {
        async function getToken() {
            await pkce.handleCodeRedirect();
            setAuthenticated(pkce.hasToken());
        }
        getToken();
    }, []);

    function handleLogin() {
        pkce.redirect();
    }

    function handleLogOut() {
        setAuthenticated(false);
        pkce.revoke();
        window.location.replace("/");
    }

    const MainApp = () => <RealStuff isAuthenticated={isAuthenticated} handleLogOut={handleLogOut} handleLogin={handleLogin} />

  const breadcrumbs: {home: string; garden: Array<string>; pipeline: Array<string>;} = {
    home: '',
    garden: [],
    pipeline: []

  }
  return (
    <div>
      <HashRouter>
      <ScrollToTop/>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage bread={breadcrumbs}/>}/>
          <Route path="secret" element={MainApp()}/>
          <Route path="/home" element={<HomePage bread={breadcrumbs}/>}/>
          <Route path="/about" element={<AboutPage />}/>
          {/* <Route path="/search" element={<SearchPage />}/> */}
          <Route path="/garden/:doi" element={<GardenPage bread={breadcrumbs}/>}/>
          <Route path="/pipeline/:doi" element={<PipelinePage bread={breadcrumbs}/>}/>
        </Routes>
      </HashRouter>
    </div>
  )
}


export default App;
