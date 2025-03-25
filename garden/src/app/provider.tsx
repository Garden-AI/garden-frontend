import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import { GlobusAuthProvider } from "@/app/GlobusAuthProvider";
import queryClient from "@/lib/react-query";
import App from "./app";

async function enableMocking() {
  if (import.meta.env.MODE !== "development" || import.meta.env.VITE_APP_SHOULD_MOCK == "false") {
    return;
  }

  const { worker } = await import("../lib/browser");

  return worker.start();
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <GlobusAuthProvider
        client={import.meta.env.VITE_GLOBUS_CLIENT_ID}
        redirect={import.meta.env.VITE_GLOBUS_REDIRECT_URI}
        scopes={import.meta.env.VITE_GLOBUS_SCOPES}
        storage={localStorage}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </GlobusAuthProvider>
    </React.StrictMode>,
  );
});
