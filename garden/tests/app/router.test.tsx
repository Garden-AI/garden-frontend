import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "@/app/router";
import * as authHook from "@/hooks/useGlobusAuth";

// Mock the auth hook
vi.mock("@/hooks/useGlobusAuth");
const createMockAuthState = (overrides?: Partial<ReturnType<typeof authHook.useGlobusAuth>>) => ({
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

// Test component to capture current location
const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe("Router", () => {
    describe("When navigating to a private route", () => {
        it("should redirect to the login page if the user is not authenticated", () => {
            // Mock the auth hook to return unauthenticated state
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                authorization: { authenticated: false } as any
            }));

            // Render router with a private route path
            renderWithProviders(
                <MemoryRouter initialEntries={["/garden/create"]}>
                    <Router />
                    <LocationDisplay />
                </MemoryRouter>
            );

            // Verify we're redirected to login
            expect(screen.getByTestId("location-display")).toHaveTextContent("/login");
        });

        it("should show loading state while auth is being checked", () => {
            // Mock the auth hook to return loading state
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                isLoading: true
            }));

            // Render router with a private route path
            renderWithProviders(
                <MemoryRouter initialEntries={["/garden/create"]}>
                    <Router />
                </MemoryRouter>
            );

            // Verify loading state is shown
            expect(screen.getByRole("status", { name: "loading" })).toBeInTheDocument();
        });
    });
});
