import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/shadcn/separator";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ChevronDown, ChevronUp, LogOut, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const auth = useGlobusAuth();
  const navigate = useNavigate();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openCreateDropdown, setOpenCreateDropdown] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const createDropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const queryClient = useQueryClient();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenMenuDropdown(false);
    }
    if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
      setOpenCreateDropdown(false);
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

  const toggleCreateDropdown = () => {
    setOpenCreateDropdown(!openCreateDropdown);
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

  let Links = [
    { name: "Search", link: "/search"},
    { name: "Documentation", link: "https://garden-ai.readthedocs.io/en/latest/" },
  ];

  return (
    <div className="relative left-0 top-0 z-10 w-full shadow-md">
      <div className="flex items-center justify-between bg-white px-7 py-2 md:px-10 md:py-1">
        {/* logo */}
        <div>
          <Link to="/" className="py-1">
            <div className="relative w-32">
              <img src="img/garden-logo-small.png" alt="Garden AI Logo" className="h-8" />
            </div>
          </Link>
        </div>

        {/* Everything under this div is on the right side of the nav bar */}
        <div className="flex items-center justify-end">
          <div className="flex items-center">
            {/* Create Garden Menu */}
            <div
              className="relative mr-5 hover:text-green"
              ref={createDropdownRef}
            >
              <button 
                className="flex items-center" 
                onClick={toggleCreateDropdown}
                aria-label="Create options"
              >
                <Plus size={24} />
                {openCreateDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <div
                className={`absolute ${openCreateDropdown ? "block" : "hidden"} right-0 top-full z-50 mt-1 w-64 justify-between rounded bg-white py-3 shadow-md`}
              >
                <div className="flex flex-col gap-3 p-3">
                  <h3 className="font-semibold">Create</h3>
                  <Separator />
                  <Link 
                    to="/garden/create" 
                    className="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded"
                    onClick={() => setOpenCreateDropdown(false)}
                  >
                    <span className="font-medium">Create Garden</span>
                    <span className="text-xs text-gray-500">Create a garden with existing functions</span>
                  </Link>
                  <Link 
                    to="/garden/deploy-and-create" 
                    className="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded"
                    onClick={() => setOpenCreateDropdown(false)}
                  >
                    <span className="font-medium">Deploy Model & Create Garden</span>
                    <span className="text-xs text-gray-500">Upload a model, then create a garden</span>
                  </Link>
                  <Link 
                    to="/modal-app/create" 
                    className="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded"
                    onClick={() => setOpenCreateDropdown(false)}
                  >
                    <span className="font-medium">Deploy Model Only</span>
                    <span className="text-xs text-gray-500">Upload and deploy a model</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Auth/user section */}
            <div
              onClick={toggleMenuDropdown}
              className="relative text-sm transition-all duration-500 flex items-center"
              ref={dropdownRef}
            >
              {auth.isAuthenticated ? (
                <div className="flex items-center">
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-1">
                    <div className="flex items-center space-x-2">
                      <User size={20} />
                      {openMenuDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  <div
                    className={`absolute ${openMenuDropdown ? "block" : "hidden"} right-0 top-full z-50 mt-1 justify-between rounded bg-white py-3 shadow-md`}
                  >
                    <div className="flex flex-col gap-3 p-3">
                      <p>{user?.email} </p>
                      <Separator />
                      <div className="flex flex-row gap-2 hover:text-green hover:underline">
                        <User size={18} />
                        <Link to="/user"> Your Profile </Link>
                      </div>
                      <div
                        className="flex flex-row gap-2 hover:cursor-pointer hover:text-green hover:underline"
                        onClick={handleLogOut}
                      >
                        <LogOut size={18} />
                        <p> Log Out </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="transform rounded bg-green px-4 py-1 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-darkgreen"
                  onClick={handleLogin}
                >
                  Login
                </button>
              )}
            </div>

            {/* Links menu */}
            <div className="flex items-center justify-between">
              {Links.map((link) => (
                  <Link key={link.name} to={link.link} target={link.name === "Documentation" ? "_blank" : ""} className="flex my-5 no-underline hover:underline md:my-0 ml-4">
                    {link.name}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
