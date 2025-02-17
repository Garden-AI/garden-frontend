import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "@/app/app";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";

// Mock the auth hook
vi.mock("@/hooks/useGlobusAuth");

it("renders", () => {
  // Setup mock return value
  vi.mocked(useGlobusAuth).mockReturnValue({
    isAuthenticated: false,
    authorization: null
  } as any);

  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
});
