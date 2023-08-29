import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 flex gap-4 justify-between py-1 mx-3 text-xs sm:text-lg">
      <div className="flex-shrink-0">
        <Link to="/home"><img
          src="img/smallColorIcon_Garden.png"
          alt="Garden AI Logo"
          className="w-24 sm:w-28 flex object-contain ml-2 sm:m-2"
        ></img>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-6 sm:mr-6">
        <Link to="/search">Search</Link>
        <a
          href="https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <a
          href="https://github.com/Garden-AI/matminer-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a></div>
    </nav>
  );
};

export default Navbar;
