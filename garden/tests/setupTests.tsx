import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as authHook from "@/hooks/useGlobusAuth";


// this gets rid of warning about window.scrollTo not being implemented
window.scrollTo = vi.fn();

export const createMockAuthState = (overrides?: Partial<ReturnType<typeof authHook.useGlobusAuth>>) => ({
    isLoading: false,
    isAuthenticated: false,
    authorization: undefined,
    error: undefined,
    events: {} as any,
    ...overrides
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

export const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};