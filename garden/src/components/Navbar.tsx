import React from "react";
import { Link } from "react-router-dom";

const Navbar = (
  {
    isAuthenticated,
    logIn,
    logOut,
  }: {
    isAuthenticated: boolean;
    logIn: () => void;
    logOut: () => void;
  }
) => {
  return (
    <nav className="flex justify-between gap-4 border-b border-gray-200 px-5 py-1 text-sm md:text-lg">
      <Link to="/home" className="py-2">
        <div className="relative w-28 pb-[27%]">
          <div className="absolute inset-0">
            <img
              src="img/normalColorIcon_Garden.jpg"
              alt="Garden AI Logo"
              className=""
            />
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:mr-6 sm:gap-6">
        <Link to="/search" className="no-underline hover:underline">
          Search
        </Link>
        <a
          href="https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline hover:underline"
        >
          Documentation
        </a>
        <a
          href="https://github.com/Garden-AI/matminer-example"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline hover:underline"
        >
          Examples
        </a>
        {isAuthenticated ? (
          <button onClick={logOut} className="hover:underline">
            Log Out
          </button>
        ) : (
          <button onClick={logIn} className="hover:underline">
            Log In
          </button>
        )}  
      </div>
    </nav>
  );
};

export default Navbar;