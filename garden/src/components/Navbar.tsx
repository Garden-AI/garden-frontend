import React from "react";
import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/shadcn/separator";
import { useGlobusAuth } from "@globus/react-auth-context";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  Plus,
  User,
  BarChart3,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./shadcn/tooltip";
import { SUPER_USERS } from "@/utils/utils";

const Navbar = () => {
  const auth = useGlobusAuth();
  const navigate = useNavigate();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const queryClient = useQueryClient();
  const isSuperUser = SUPER_USERS.includes(auth.authorization?.user?.sub || "");

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenMenuDropdown(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenuDropdown = () => {
    setOpenMenuDropdown(!openMenuDropdown);
  };

  const handleLogOut = async () => {
    await auth.authorization?.revoke();
    navigate("/");
    toast.success("Logged out successfully!");
    queryClient.removeQueries();
  };

  const handleLogin = async () => {
    await auth.authorization?.login();
  };

  const Links = [
    { name: "Explore", link: "/search" },
    { name: "Docs", link: "https://garden-ai.readthedocs.io/en/latest/" },
  ];

  return (
    <div className="sticky left-0 top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 md:px-10">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center py-1">
            <img src="img/garden-logo-small.png" alt="Garden AI Logo" className="h-8" />
          </Link>
        </div>

        {/* Nav links + actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  className="hidden rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 md:block"
                  onClick={() => navigate("/search")}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search models</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {Links.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.name === "Docs" ? "_blank" : ""}
              className="hidden whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 no-underline transition-colors hover:bg-gray-50 hover:text-gray-900 md:block"
            >
              {link.name}
            </Link>
          ))}

          <div className="ml-2 hidden h-5 w-px bg-gray-200 md:block" />

          {/* Auth section */}
          <div
            onClick={auth.isAuthenticated ? toggleMenuDropdown : undefined}
            className="relative ml-1 flex items-center gap-2"
            ref={dropdownRef}
          >
            {auth.isAuthenticated ? (
              <>
                <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                  <User size={16} />
                  {openMenuDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <div
                  className={`absolute ${openMenuDropdown ? "block" : "hidden"} right-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg`}
                >
                  <div className="px-4 py-2 text-sm text-gray-500">{user?.email}</div>
                  <Separator className="my-1" />
                  <div className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                    <User size={15} />
                    <Link to="/dashboard" className="no-underline">
                      My Dashboard
                    </Link>
                  </div>
                  {isSuperUser && (
                    <div className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                      <BarChart3 size={15} />
                      <Link to="/metrics" className="no-underline">
                        Metrics Dashboard
                      </Link>
                    </div>
                  )}
                  <div
                    className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal"
                    onClick={handleLogOut}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                  onClick={handleLogin}
                >
                  Log In
                </button>
                <button
                  className="rounded-md bg-teal px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-deepTeal"
                  onClick={handleLogin}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  className="ml-1 hidden rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-teal md:block"
                  onClick={() => navigate("/garden/create")}
                >
                  <Plus size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Make a Garden</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile menu toggle */}
          <button
            className="ml-1 rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {Links.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.name === "Docs" ? "_blank" : ""}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/garden/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-2 py-2.5 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Make a Garden
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
