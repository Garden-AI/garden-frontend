import { createContext } from "react";
import type { GlobusAuthState } from "./GlobusAuthState";

export type GlobusAuthContextProps = GlobusAuthState;

export default createContext<GlobusAuthContextProps | undefined>(undefined);
