import React from "react";
import { Link } from "react-router-dom";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

/*
const Navbar = () => {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;

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
        {auth.isAuthenticated && user ? (
            <button onClick={async () => await auth.authorization?.revoke()}
            className="bg-green-500 px-4 py-1 rounded shadow-md hover:bg-green-600"
            >logout TEMP
          </button>
        ) : (
          <button
            className="bg-green-500 px-4 py-1 rounded shadow-md hover:bg-green-600"
            onClick={() => auth.authorization?.login()}
            >login
          </button>
          )}
      </div>
    </nav>
  );
};
*/

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
          <button 
          className="bg-green-500 px-4 py-1 hover:bg-green-600"
          onClick={logOut}>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          </button>
        ) : (
          <button 
          className="bg-green-500 px-4 py-1 rounded shadow-md hover:bg-green-600"
          onClick={logIn}>
            Log In
          </button>
        )}  
      </div>
    </nav>
  );
};


export default Navbar;