import React from "react";
import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/shadcn/separator";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ChevronDown, ChevronUp, LogOut, Menu, Plus, User, BarChart3, Search, X } from "lucide-react";
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
    { name: "Use Cases", link: "/use-cases/mlips" },
    { name: "Benchmarks", link: "/benchmarks" },
    { name: "Docs", link: "https://garden-ai.readthedocs.io/en/latest/" },
  ];

  return (
    <div className="sticky top-0 left-0 z-10 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-2 md:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <div>
          <Link to="/" className="py-1 flex items-center">
            <img src="img/garden-logo-small.png" alt="Garden AI Logo" className="h-8" />
          </Link>
        </div>

        {/* Nav links + actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  className="hidden md:block p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
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
              className="hidden md:block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors no-underline whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}

          <div className="ml-2 h-5 w-px bg-gray-200 hidden md:block" />

          {/* Auth section */}
          <div
            onClick={auth.isAuthenticated ? toggleMenuDropdown : undefined}
            className="relative flex items-center gap-2 ml-1"
            ref={dropdownRef}
          >
            {auth.isAuthenticated ? (
              <>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <User size={16} />
                  {openMenuDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <div
                  className={`absolute ${openMenuDropdown ? "block" : "hidden"} right-0 top-full z-50 mt-1 min-w-[200px] rounded-lg bg-white border border-gray-200 py-2 shadow-lg`}
                >
                  <div className="px-4 py-2 text-sm text-gray-500">{user?.email}</div>
                  <Separator className="my-1" />
                  <div className="flex flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal cursor-pointer">
                    <User size={15} />
                    <Link to="/dashboard" className="no-underline">My Dashboard</Link>
                  </div>
                  {isSuperUser && (
                    <div className="flex flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal cursor-pointer">
                      <BarChart3 size={15} />
                      <Link to="/metrics" className="no-underline">Metrics Dashboard</Link>
                    </div>
                  )}
                  <div
                    className="flex flex-row items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal cursor-pointer"
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
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={handleLogin}
                >
                  Log In
                </button>
                <button
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-teal hover:bg-deepTeal rounded-md transition-colors"
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
                  className="ml-1 hidden md:block p-2 text-gray-500 hover:text-teal hover:bg-gray-100 rounded-md transition-colors"
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
            className="md:hidden ml-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          {Links.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.name === "Docs" ? "_blank" : ""}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors no-underline"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/garden/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors no-underline"
          >
            Make a Garden
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
