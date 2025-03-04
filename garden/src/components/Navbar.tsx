import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/shadcn/separator";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { ChevronDown, ChevronUp, LogOut, Plus, User, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const auth = useGlobusAuth();
  const navigate = useNavigate();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const queryClient = useQueryClient();

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

  const handleLogOut = () => {
    auth.authorization?.revoke();
    navigate("/");
    toast.success("Logged out successfully!");
    queryClient.removeQueries();
  };

  const handleLogin = () => {
    auth.authorization?.login();
  };

  let Links = [{ name: "Documentation", link: "https://garden-ai.readthedocs.io/en/latest/" }];

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative left-0 top-0 z-10 w-full shadow-md">
      <div className="items-center justify-between bg-white px-7 py-2 md:flex md:px-10 md:py-1">
        {/* logo */}
        <Link to="/" className="py-1">
          <div className="relative w-32">
            <img src="img/garden-logo-small.png" alt="Garden AI Logo" className="h-8" />
          </div>
        </Link>

        {/* menu */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-8 top-3 h-8 w-8 cursor-pointer md:hidden"
        >
          {isOpen ? <X /> : <Menu />}
        </div>

        {/* links */}

        <div className={`md:flex md:items-center`}>
          <ul
            className={`absolute left-0 z-[-1] w-full bg-white pb-6 pl-9 pt-10 transition-all duration-300 ease-in md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 md:pl-0 md:pt-0 ${isOpen ? "top-10" : "top-[-490px]"}`}
          >
            <li>
              <Link to="/search" className="my-5 no-underline hover:underline md:my-0 md:ml-8">
                Search
              </Link>
            </li>
            {Links.map((link) => (
              <li key={link.name} className="my-5 no-underline hover:underline md:my-0 md:ml-8">
                <a href={link.link} target="_blank">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div
            onClick={toggleMenuDropdown}
            className="relative text-sm transition-all duration-500"
            ref={dropdownRef}
          >
            {auth.isAuthenticated ? (
              <div className="md:ml-4 absolute right-12 top-0 md:static">
                <button className="bg-green-500 hover:bg-green-600 px-4 py-1">
                  <div className="flex items-center space-x-2">
                    <User size={20} />
                    {openMenuDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                <div
                  className={`absolute ${openMenuDropdown ? "block" : "hidden"} right-0 z-50 mt-1 justify-between rounded bg-white py-3 shadow-md `}
                >
                  <div className="flex flex-col gap-3 p-3">
                    <p>{user?.email} </p>
                    <Separator />
                    <div className="flex flex-row gap-2 hover:text-green hover:underline">
                      <User size={18} />
                      <Link to="/user"> Your Profile </Link>
                    </div>
                    <div className="flex flex-row gap-2 hover:text-green hover:underline">
                      <Plus size={18} />
                      <Link to="/garden/create">Create a Garden</Link>
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
              <div className={`absolute right-16 top-0 bg-white transition-all duration-300 ease-in md:static`}>
                <button
                  className="transform rounded bg-green px-4 py-1 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-darkgreen md:static md:ml-8"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
