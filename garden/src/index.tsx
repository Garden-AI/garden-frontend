import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobusAuthorizationManagerProvider } from "./components/globus-auth-context/Provider";

async function enableMocking() {
  console.log(Boolean(import.meta.env.VITE_APP_SHOULD_MOCK));
  if (
    import.meta.env.MODE !== "development" ||
    import.meta.env.VITE_APP_SHOULD_MOCK == "false"
  ) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <GlobusAuthorizationManagerProvider
        client={import.meta.env.VITE_GLOBUS_CLIENT_ID}
        redirect={import.meta.env.VITE_GLOBUS_REDIRECT_URI}
        scopes={import.meta.env.VITE_GLOBUS_SCOPES}
      >
        <App />
      </GlobusAuthorizationManagerProvider>
    </React.StrictMode>,
  );
});
