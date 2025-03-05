import { vi, describe, it, expect } from "vitest";

import { renderWithProviders } from "@tests/setupTests";
import GardenPage from "@/features/gardens/components/GardenPage";
import * as authHook from "@/hooks/useGlobusAuth";
import { screen, within } from "@testing-library/react";
import * as getGardenHook from "@/features/gardens/api/useGetGarden";
import { createMockAuthState } from "@tests/setupTests";
import { MemoryRouter } from "react-router-dom";

// Test data for all tests
const fakeGarden = {
    doi: "10.1234/test-garden",
    title: "Test Garden",
    description: "Test garden description",
    owner_identity_id: "user-123",
    is_archived: false,
    entrypoints: [],
    modal_functions: [],
    is_test: false
};

// Create a variable to control the search params mock
let searchParams = new URLSearchParams();

// Mock useParams and usePatchGarden to avoid router dependency issues
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ doi: "10.1234/test-garden" }),
        useSearchParams: () => [searchParams, vi.fn()]
    };
});

vi.mock("@/features/gardens/api/usePatchGarden", () => ({
    usePatchGarden: () => ({
        mutate: vi.fn(),
        isLoading: false
    })
}));

describe("GardenPage", () => {
    describe("When the logged in user is the owner of the garden", () => {
        describe("When the garden is newly created", () => {
            it("should display a notice to review the generated metadata", () => {
                // Set search params to simulate a newly created garden
                searchParams = new URLSearchParams({ newlyCreated: "true" });
                
                // Mock the auth hook to return the garden owner
                vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                    isAuthenticated: true,
                    authorization: {
                        user: { sub: "user-123" }, // same as garden owner_identity_id
                        authenticated: true
                    } as any
                }));

                // Mock the garden API to return our test garden
                vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
                    data: fakeGarden,
                    isLoading: false,
                    isError: false
                } as any);

                // Render the GardenPage component
                renderWithProviders(
                    <MemoryRouter>
                        <GardenPage />
                    </MemoryRouter>
                );

                // Check that the notice to review the generated metadata is displayed
                expect(screen.getByText(/Please review/i)).toBeInTheDocument();
            });
        });

        it("should allow the user to edit the garden's metadata", () => {
            // Reset search params for this test
            searchParams = new URLSearchParams();
            
            // Mock the auth hook to return the garden owner
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                isAuthenticated: true,
                authorization: {
                    user: { sub: "user-123" }, // same as garden owner_identity_id
                    authenticated: true
                } as any
            }));
            
            // Mock the garden API to return our test garden
            vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
                data: fakeGarden,
                isLoading: false,
                isError: false
            } as any);
            
            // Render the GardenPage component
            renderWithProviders(
                <MemoryRouter>
                    <GardenPage />
                </MemoryRouter>
            );
            
            // Check that the garden title is displayed
            expect(screen.getByRole("heading", { name: "Test Garden" })).toBeInTheDocument();
            
            // Verify that edit controls are visible to the owner
            const editTitleButton = screen.getByLabelText("Edit title");
            expect(editTitleButton).toBeInTheDocument();
            
            // Check for other edit controls around the title
            const titleContainer = screen.getByRole("heading", { name: "Test Garden" }).closest('div');
            if (titleContainer) {
                const editButtons = within(titleContainer).getAllByRole("button");
                expect(editButtons.length).toBeGreaterThan(0);
            }
        });
    });

    describe("When the logged in user is not the owner of the garden", () => {
        it("should not allow the user to edit the garden's metadata", () => {
            // Reset search params for this test
            searchParams = new URLSearchParams();
            
            // Mock the auth hook to return a different user than the garden owner
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                isAuthenticated: true,
                authorization: {
                    user: { sub: "different-user-456" }, // different from garden owner_identity_id
                    authenticated: true
                } as any
            }));
            
            // Mock the garden API to return our test garden
            vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
                data: fakeGarden,
                isLoading: false,
                isError: false
            } as any);

            // Render the GardenPage component
            renderWithProviders(
                <MemoryRouter>
                    <GardenPage />
                </MemoryRouter>
            );

            // Check that the garden title is displayed
            expect(screen.getByRole("heading", { name: "Test Garden" })).toBeInTheDocument();

            // Verify that edit controls are NOT visible to non-owners
            expect(screen.queryByLabelText("Edit title")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
        });
    });
});
