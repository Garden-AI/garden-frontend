import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="mx-1 flex justify-between gap-4 border-b border-gray-200 py-1 text-xs sm:mx-3 sm:text-lg">
      <div className="flex-shrink-0">
        <Link to="/home">
          <img
            src="img/normalColorIcon_Garden.jpg"
            alt="Garden AI Logo"
            className="ml-2 flex w-24 object-contain sm:m-2 sm:w-28"
          ></img>
        </Link>
      </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
