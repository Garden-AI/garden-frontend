import { useState } from "react";
import GlobusAuthContext, {useAuth} from "./globus-auth-context/GlobusAuthContext";


function LoggedIn({}) {

  const { loggedIn, setLoggedIn } = useAuth(); 
  
  const handleLogout = () => {
    // Handle logout logic here
    setLoggedIn(false);
  };


    if (loggedIn) {
      return (
        <button className="bg-green-500 text-white px-4 py-1 rounded shadow-md hover:bg-green-600">
          Logout
        </button>
      );
    }
    return (
      // Replace TEMPORARY with the actual user profile icon component or JSX
      <button className="bg-green-500 text-white px-4 py-1 rounded shadow-md hover:bg-green-600">
        TEMPORARY
      </button>
    );
  }

  export default LoggedIn;