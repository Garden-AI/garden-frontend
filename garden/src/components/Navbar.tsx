import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";
import { Separator } from "@/components/ui/separator";

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

  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);

  const toggleMenuDropdown = () => {
    setOpenMenuDropdown(!openMenuDropdown);
  };

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
        <div onClick={toggleMenuDropdown} className="relative transition-all duration-500 text-sm">
          {isAuthenticated ? (
            <div>
              <button 
              className="bg-green-500 px-4 py-1 hover:bg-green-600"
              >
              <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {openMenuDropdown ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
              )}
              </div>
              </button>
              <div className={`absolute ${openMenuDropdown ? 'block' : 'hidden'} mt-5 bg-white rounded shadow-md justify-between py-5 right-0 z-50 `}>
                  <div className='p-4 flex flex-col gap-4'>
                    <p> @insertUsernameHere </p>
                    <Separator />
                    <div 
                    className = "flex flex-row gap-2 hover:underline hover:text-green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <Link to="/UserProfilePage"> Your Profile </Link> {/* add in actual link later once that branch is merged into staging*/}
                    </div>
                    <div 
                    className = "flex flex-row gap-2 hover:underline hover:cursor-pointer hover:text-green"
                    onClick={logOut}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      <p> Log Out </p>
                    </div>
                  </div>
              </div>
            </div>
          ) : (
            <button 
            className="bg-green-500 px-4 py-1 rounded shadow-md hover:bg-green-600 text-sm md:text-lg"
            onClick={logIn}>
              Log In
            </button>
          )}  
  
        </div>
      </div>
    </nav>
  );
};

export default Navbar;