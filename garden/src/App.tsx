import React from 'react';
import PlaceholderPage from './pages/PlaceholderPage'
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
  return (
    <div>
      <HashRouter>
      <ScrollToTop/>
        {isAuthenticated ? <Navbar /> : null}
        <Routes>
          <Route path="/" element={isAuthenticated ? MainApp() : <PlaceholderPage />}/>
          <Route path="secret" element={MainApp()}/>
          <Route path="/home" element={<HomePage />}/>
          <Route path="/about" element={<AboutPage />}/>
          {/* <Route path="/search" element={<SearchPage />}/> */}
          <Route path="/garden/:uuid" element={<GardenPage />}/>
          <Route path="/pipeline/:uuid" element={<PipelinePage />}/>
        </Routes>
      </HashRouter>
    </div>
  )
}


export default App;
