import { useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useGlobusAuth } from "./auth/useGlobusAuth";
import { ChevronDown, ChevronUp, LogOut, Plus, User } from "lucide-react";

const Navbar = () => {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);

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
                  <p> @insertUsernameHere </p>
                  <Separator />
                  <div className="flex flex-row gap-2 hover:text-green hover:underline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <Link to="/userProfilePage"> Your Profile </Link>{" "}
                    {/* add in actual link later once that branch is merged into staging*/}
                  </div>
                  <div className="flex flex-row gap-2 hover:cursor-pointer hover:text-green hover:underline">
                    <Link
                      to="/garden/create"
                      className="no-underline hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-sprout"
                      >
                        <path d="M7 20h10" />
                        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                      </svg>
                      <p>Create New Garden</p>
                    </Link>
                  </div>
                  <div
                    className="flex flex-row gap-2 hover:cursor-pointer hover:text-green hover:underline"
                    onClick={handleLogOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-log-out"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    <p> Log Out </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 rounded px-4 py-1 text-sm shadow-md md:text-lg"
              onClick={() => auth.authorization?.login()}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
