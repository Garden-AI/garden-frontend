import { useState } from "react";
import GlobusAuthContext, {useAuth} from "./globus-auth-context/GlobusAuthContext";
import { authorization } from "@globus/sdk/cjs";
// import { useRouter } from "next/router";

function LoggedIn({}) {
  const { loggedIn, setLoggedIn } = useAuth(); 
  // const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic here
    setLoggedIn(false);
  };

/*
  const createRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomArray = new Uint8Array(36);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
      result += chars[number % chars.length];
    });
    return result;
  }; 
*/

  const handleLogin = () => {
    // Save the state to session storage to validate it later
    // sessionStorage.setItem('oauth_state', createRandomString());

    const manager = authorization.create({
      // Your registered Globus Application client ID.
      client: 'd3fdef00-2827-4dcc-a071-6e4b30459b49',
      // The redirect URL for your application; Where you will call `manager.handleCodeRedirect()`
      redirect: `http://localhost:3000/authenticate`, 
      // Known scopes required by your application.
      scopes: 'urn:globus:auth:scope:transfer.api.globus.org:all'
   });
    manager.login();
  };

 // const authorizationUrl = `https://auth.globus.org/v2/oauth2/authorize?response_type=code&client_id=d3fdef00-2827-4dcc-a071-6e4b30459b49&redirect_uri=${encodeURIComponent('http://localhost:3000/#/callback')}&scope=${encodeURIComponent('urn:globus:auth:scope:transfer.api.globus.org:all')}&state=${createRandomString()}`;

  return (
    <button
      className="bg-green-500 px-4 py-1 rounded shadow-md hover:bg-green-600"
      onClick={handleLogin} 
    >
      {loggedIn ? "TEMPORARY" : "Login"}
    </button>
  );
  }

  export default LoggedIn;