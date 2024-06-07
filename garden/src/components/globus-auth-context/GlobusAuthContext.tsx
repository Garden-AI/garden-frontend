import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the type for the context props
export type GlobusAuthContextProps = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

// Create the context
const GlobusAuthContext = createContext<GlobusAuthContextProps | undefined>(undefined);

// Create the provider component
export function GlobusAuthContextProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <GlobusAuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </GlobusAuthContext.Provider>
  );
}

// Custom hook for accessing the context
export const useAuth = () => {
  const context = useContext(GlobusAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a GlobusAuthContextProvider");
  }
  return context;
};

export default GlobusAuthContext;
