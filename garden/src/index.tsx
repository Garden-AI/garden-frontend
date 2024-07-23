import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobusAuthorizationManagerProvider } from "./components/globus-auth-context/Provider";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

async function deferRender() {
  if (import.meta.env.VITE_APP_SHOULD_MOCK !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

deferRender().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <GlobusAuthorizationManagerProvider
        client={import.meta.env.VITE_GLOBUS_CLIENT_ID}
        redirect={import.meta.env.VITE_GLOBUS_REDIRECT_URI}
        scopes={import.meta.env.VITE_GLOBUS_GARDEN_SCOPE}
      >
        <App />
      </GlobusAuthorizationManagerProvider>
    </React.StrictMode>,
  );
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});