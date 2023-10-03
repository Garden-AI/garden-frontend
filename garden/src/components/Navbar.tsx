import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 flex justify-between px-8 py-3">
      <Link to="/home"><img
        src="img/normalColorIcon_Garden.jpg"
        alt="Garden AI Logo"
        className="w-28 object-contain"
      ></img>
      </Link>
      <ul className="flex items-center gap-8">
        <Link to="/search" className="no-underline hover:underline">Search</Link>
        <li>
          <a
            href="https://github.com/Garden-AI/garden-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
          >
            Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Garden-AI/matminer-example"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
          >
            Examples
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
