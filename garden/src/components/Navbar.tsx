import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useGlobusAuth } from "./auth/useGlobusAuth";
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

  /*
  useEffect(() => {
    if (auth.isAuthenticated) {
      toast.success("Logged in successfully!");
    }
  }, [auth.isAuthenticated]);
  */

  const toggleMenuDropdown = () => {
    setOpenMenuDropdown(!openMenuDropdown);
  };

  function handleLogOut() {
    auth.authorization?.revoke();
    navigate("/");
    toast.success("Logged out successfully!");
    queryClient.removeQueries();
  }

  function handleLogin() {
    auth.authorization?.login();
    /*
    if (auth.isAuthenticated) {
      toast.success("Logged in successfully!");
    }
    */
  }

  let Links = [{ name: "Documentation", link: "https://garden-ai.readthedocs.io/en/latest/" }];

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative left-0 top-0 z-10 w-full shadow-md">
      <div className="items-center justify-between bg-white px-7 py-4 md:flex md:px-10 md:py-2">
        {/* logo */}
        <Link to="/" className="py-2">
          <div className="absolute relative inset-0 w-32">
            <img src="img/normalColorIcon_Garden.jpg" alt="Garden AI Logo" className="" />
          </div>
        </Link>

        {/* menu */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-8 top-5 h-8 w-8 cursor-pointer md:hidden"
        >
          {isOpen ? <X /> : <Menu />}
        </div>

        {/* links */}

        <div className={`md:flex`}>
          <ul
            className={`absolute left-0 z-[-1] w-full bg-white pb-8 pl-9 pt-12 transition-all duration-300 ease-in md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 md:pl-0 md:pt-0 ${isOpen ? "top-12" : "top-[-490px]"}`}
          >
            <li>
              <Link to="/search" className="my-7 no-underline hover:underline md:my-0 md:ml-8">
                Search
              </Link>
            </li>
            {Links.map((link) => (
              <li key={link.name} className="my-7 no-underline hover:underline md:my-0 md:ml-8">
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
              <div className="absolute -top-8 right-12 ml-4 md:static">
                <button className="bg-green-500 hover:bg-green-600 px-4 py-1">
                  <div className="flex items-center space-x-2">
                    <User size={24} />
                    {openMenuDropdown ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>
                <div
                  className={`absolute ${openMenuDropdown ? "block" : "hidden"} right-0 z-50 mt-5 justify-between rounded bg-white py-5 shadow-md `}
                >
                  <div className="flex flex-col gap-4 p-4">
                    <p>{user?.email} </p>
                    <Separator />
                    <div className="flex flex-row gap-2 hover:text-green hover:underline">
                      <User />
                      <Link to="/user"> Your Profile </Link>{" "}
                    </div>
                    <div className="flex flex-row gap-2 hover:text-green hover:underline">
                      <Plus />
                      <Link to="/garden/create">Create a Garden</Link>{" "}
                      {/* add in actual link later once that branch is merged into staging*/}
                    </div>
                    <div
                      className="flex flex-row gap-2 hover:cursor-pointer hover:text-green hover:underline"
                      onClick={handleLogOut}
                    >
                      <LogOut />
                      <p> Log Out </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`absolute -top-8 right-16 bg-white transition-all duration-300 ease-in md:static`}
              >
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
