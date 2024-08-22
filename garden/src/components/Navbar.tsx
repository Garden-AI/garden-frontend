import { useState, useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useGlobusAuth } from "./auth/useGlobusAuth";
import { ChevronDown, ChevronUp, LogOut, Plus, User, Menu, X } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const auth = useGlobusAuth();
  const navigate = useNavigate();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
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
  }

  function handleLogin() {
    auth.authorization?.login();
    /*
    if (auth.isAuthenticated) {
      toast.success("Logged in successfully!");
    }
    */
  }

  let Links = [
    { name: 'Documentation', link: "https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/" },
    { name: 'Examples', link: "https://github.com/Garden-AI/matminer-example" },
  ]

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:px-10 py-4 px-7 md:flex justify-between items-center bg-white">
        {/* logo */}
        <Link to="/" className="py-2">
          <div className="relative w-28 absolute inset-0">
            <img
              src="img/normalColorIcon_Garden.jpg"
              alt="Garden AI Logo"
              className=""
            />
          </div>
        </Link>

        {/* menu */}
        <div onClick={() => setIsOpen(!isOpen)} className="w-8 h-8 absolute right-8 top-6 cursor-pointer md:hidden">
          {
            isOpen ? <X /> : <Menu />
          }
        </div>

        {/* links */}
        <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-300 ease-in ${isOpen ? 'top-24' : 'top-[-490px]'}`}>
          <li>
            <Link to="/search" className="no-underline hover:underline my-7 md:my-0 md:ml-8">
              Search
            </Link>
          </li>

          {
            Links.map(link => (
              <li className="no-underline hover:underline my-7 md:my-0 md:ml-8">
                <a href={link.link} target="_blank">{link.name}</a>
              </li>
            ))
          }

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
                  className="bg-green hover:bg-darkgreen rounded px-4 py-1 text-white transition-all duration-300 ease-in-out transform hover:scale-105 md:ml-8 md:static"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>


  );
};

export default Navbar;
