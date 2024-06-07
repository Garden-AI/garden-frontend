import React, {
  useState,
  useReducer,
  useEffect,
  type PropsWithChildren,
} from "react";

import Context from "./Context";
import { initialState } from "./GlobusAuthState";
import { reducer } from "./reducer";

import { authorization } from "@globus/sdk/cjs";

export const GlobusAuthorizationManagerProvider = ({
  redirect,
  scopes,
  client,
  children,
}: PropsWithChildren<{
  redirect: string;
  scopes: string;
  client: string;
}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [instance, setInstance] = useState<
    ReturnType<typeof authorization.create> | undefined
  >(undefined);

  useEffect(() => {
    const manager = authorization.create({
      redirect,
      scopes,
      client,
      useRefreshTokens: true,
    });
    setInstance(manager);
  }, [redirect, scopes, client]);

  /**
   * Register event listeners for the authorization instance.
   */
  useEffect(() => {
    if (!instance) return;

    const handleRevoke = () => {
      dispatch({ type: "REVOKE" });
    };

    instance.events.revoke.addListener(handleRevoke);

    const handleAuthenticated = ({
      isAuthenticated,
    }: {
      isAuthenticated: boolean;
    }) => {
      dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
    };
    instance.events.authenticated.addListener(handleAuthenticated);

    return () => {
      instance.events.revoke.removeListener(handleRevoke);
      instance.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [instance]);

  return (
    <Context.Provider
      value={{
        ...state,
        authorization: instance,
        events: instance?.events,
      }}
    >
      {children}
    </Context.Provider>
  );
};