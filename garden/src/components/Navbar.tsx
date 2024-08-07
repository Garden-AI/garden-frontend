import { useState, useEffect, useRef, RefObject } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useGlobusAuth } from "./auth/useGlobusAuth";
import { ChevronDown, ChevronUp, LogOut, Plus, User } from "lucide-react";

const Navbar = () => {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

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

  function handleLogOut() {
    auth.authorization?.revoke();
    window.location.replace("/");
  }

  return (
    <nav className="flex justify-between gap-4 border-b border-gray-200 px-5 py-1 text-sm md:text-lg">
      <Link to="/" className="py-2">
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
        <div
          onClick={toggleMenuDropdown}
          className="relative text-sm transition-all duration-500"
          ref={dropdownRef}
        >
          {auth.isAuthenticated ? (
            <div>
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
                    <Link to="/UserProfilePage"> Your Profile </Link>{" "}
                    {/* add in actual link later once that branch is merged into staging*/}
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
            <div>

              <button
                className="bg-green-500 hover:bg-green-600 rounded px-4 py-1 text-sm shadow-md md:text-lg"
                onClick={() => auth.authorization?.login()}
              >
                Log In
              </button>
            </div>
          )}
        </div>



      </div>
    </nav>
  );
};

export default Navbar;