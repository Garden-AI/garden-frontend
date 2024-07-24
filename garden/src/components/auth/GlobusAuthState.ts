import type { AuthorizationManager } from "@globus/sdk/cjs/lib/core/authorization/AuthorizationManager";

export type GlobusAuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | undefined;
  authorization: AuthorizationManager | undefined;
  events: AuthorizationManager["events"] | undefined;
};

export const initialState: GlobusAuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: undefined,
  authorization: undefined,
  events: undefined,
};
