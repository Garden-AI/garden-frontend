import React, { createContext, useState, useContext, ReactNode } from "react";

export type GlobusAuthContextProps = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

const GlobusAuthContext = createContext<GlobusAuthContextProps | undefined>(undefined);

export function GlobusAuthContextProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <GlobusAuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </GlobusAuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(GlobusAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a GlobusAuthContextProvider");
  }
  return context;
};

export default GlobusAuthContext;