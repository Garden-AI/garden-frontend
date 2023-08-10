import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 flex justify-between px-8 py-2">
      <Link to="/home"><img
        src="img/smallColorIcon_Garden.png"
        alt="Garden AI Logo"
        className="w-28 object-contain"
      ></img>
      </Link>
      <ul className="flex items-center gap-8">
        <Link to="/home">Home</Link>
        <Link to="/search">Search</Link>
        <li>
          <a
            href="https://github.com/Garden-AI/garden-frontend"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Garden-AI/matminer-example"
            target="_blank"
            rel="noopener noreferrer"
          >
            Examples
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
