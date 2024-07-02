import { authorization } from "@globus/sdk/cjs";

const authManager = authorization.create({
  client: import.meta.env.VITE_GLOBUS_CLIENT_ID,
  redirect: import.meta.env.VITE_GLOBUS_REDIRECT_URI,
  scopes: import.meta.env.VITE_GLOBUS_SCOPES,
});

export default authManager;
