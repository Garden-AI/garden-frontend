import { GlobusAuthState } from "./GlobusAuthState";

type Action = { type: "AUTHENTICATED"; payload: boolean } | { type: "REVOKE" };

export const reducer = (
  state: GlobusAuthState,
  action: Action,
): GlobusAuthState => {
  switch (action.type) {
    case "AUTHENTICATED":
      console.log(action.payload);
      console.log(action);

      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case "REVOKE":
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
