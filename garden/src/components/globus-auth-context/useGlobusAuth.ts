import React from "react";
import Context, { GlobusAuthContextProps } from "./Context";

export const useGlobusAuth = () => {
  const context = React.useContext(Context);
  return context as unknown as GlobusAuthContextProps;
};
