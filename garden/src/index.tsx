import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobusAuthorizationManagerProvider } from "./components/auth/Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GardenProvider } from "./components/garden/Context";

async function enableMocking() {
  if (
    import.meta.env.MODE !== "development" ||
    import.meta.env.VITE_APP_SHOULD_MOCK == "false"
  ) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 20,
      retry: 1,
    },
  },
});

enableMocking().then(() => {
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
        <QueryClientProvider client={queryClient}>
          <GardenProvider>
            <App />
          </GardenProvider>
        </QueryClientProvider>
      </GlobusAuthorizationManagerProvider>
    </React.StrictMode>,
  );
});
