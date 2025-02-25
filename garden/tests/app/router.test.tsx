import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Router from "@/app/router";
import * as authHook from "@/hooks/useGlobusAuth";
import { createMockAuthState, renderWithProviders } from "@tests/setupTests";
import { MemoryRouter, useLocation } from "react-router-dom";

// Helper component to capture current location
const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
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

        it("should show the private route content if the user is authenticated", () => {
            // Mock the auth hook to return authenticated state
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                authorization: { authenticated: true } as any
            }));

            // Render router with a private route path
            renderWithProviders(
                <MemoryRouter initialEntries={["/garden/create"]}>
                    <Router />
                    <LocationDisplay />
                </MemoryRouter>
            );

            expect(screen.getByTestId("location-display")).toHaveTextContent("/garden/create");
        });

    });
});
