import React from 'react';
import PlaceholderPage from './PlaceholderPage'
import RealStuff from './RealStuff'
import { HashRouter, Routes, Route } from "react-router-dom";

// The App.css styles conflict with the placeholder,
// but we can bring them back once we get rid of the placeholder.
// import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlaceholderPage />}/>
        <Route path="secret" element={<RealStuff />}/>
      </Routes>
    </HashRouter>
      
  )
}


export default App;

