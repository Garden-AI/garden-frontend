import React from 'react';
import PlaceholderPage from './pages/PlaceholderPage'
import RealStuff from './RealStuff'
import { HashRouter, Routes, Route } from "react-router-dom";
import GardenPage from './pages/GardenPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import PipelinePage from './pages/PipelinePage';
import Navbar from './components/Navbar';

// The App.css styles conflict with the placeholder,
// but we can bring them back once we get rid of the placeholder.
// import './App.css';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<PlaceholderPage />}/>
        <Route path="secret" element={<RealStuff />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/about" element={<AboutPage />}/>
        {/* <Route path="/search" element={<SearchPage />}/> */}
        <Route path="/garden/:uuid" element={<GardenPage />}/>
        <Route path="/pipeline/:uuid" element={<PipelinePage />}/>
      </Routes>
    </HashRouter>
  )
}


export default App;

