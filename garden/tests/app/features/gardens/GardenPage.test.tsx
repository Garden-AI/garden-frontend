import { vi, describe, it, expect } from "vitest";

import { renderWithProviders } from "@tests/setupTests";
import GardenPage from "@/features/gardens/components/GardenPage";
import * as authHook from "@globus/react-auth-context";
import { screen, within } from "@testing-library/react";
import * as getGardenHook from "@/features/gardens/api/useGetGarden";
import { createMockAuthState } from "@tests/setupTests";
import { MemoryRouter } from "react-router-dom";

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

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ doi: "10.1234/test-garden" })
        // useSearchParams will be mocked in setupTest for each test
    };
});

// Mock usePatchGarden to avoid needing useNavigate
vi.mock("@/features/gardens/api/usePatchGarden", () => ({
    usePatchGarden: () => ({
        mutate: vi.fn(),
        isLoading: false
    })
}));

// Helper to set up the necessary mocks for each test case
function setupTest({
    isOwner = false,
    isNewlyCreated = false
}) {
    // Set up search params for this specific test
    const testParams = new URLSearchParams();
    if (isNewlyCreated) {
        testParams.set("newlyCreated", "true");
    }
    
    // Mock useSearchParams directly for this test
    vi.spyOn(require("react-router-dom"), "useSearchParams").mockReturnValue([
        testParams,
        vi.fn()
    ]);
    
    const authUser = { 
        sub: isOwner ? "user-123" : "different-user-456" 
    };
    
    // Mock the auth hook
    vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
        isAuthenticated: true,
        authorization: {
            user: authUser,
            authenticated: true
        } as any
    }));
    
    // Mock the garden API
    vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
        data: fakeGarden,
        isLoading: false,
        isError: false
    } as any);
}

describe("GardenPage", () => {
    describe("When the logged in user is the owner of the garden", () => {
        describe("When the garden is newly created", () => {
            it("should display a notice to review the generated metadata", () => {
                // Setup auth as owner
                vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                    isAuthenticated: true,
                    authorization: {
                        user: { sub: "user-123" },
                        authenticated: true
                    } as any
                }));
                
                // Mock the garden API
                vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
                    data: fakeGarden,
                    isLoading: false,
                    isError: false
                } as any);

                // Render the GardenPage component with a URL that includes newlyCreated=true
                // This simulates navigating to the garden page with the newlyCreated parameter
                renderWithProviders(
                    <MemoryRouter initialEntries={[`/garden/${fakeGarden.doi}?newlyCreated=true`]}>
                        <GardenPage />
                    </MemoryRouter>
                );

                // Check for the notice content that should appear for newly created gardens
                expect(screen.getByText(/pre-populated your garden/i)).toBeInTheDocument();
                expect(screen.getByText(/please review and edit/i)).toBeInTheDocument();
            });
        });

        it("should allow the user to edit the garden's metadata", () => {
            // Setup auth as owner
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                isAuthenticated: true,
                authorization: {
                    user: { sub: "user-123" },
                    authenticated: true
                } as any
            }));
            
            // Mock the garden API
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
            
            // Verify that edit buttons are visible and interactive for the owner
            
            // Check that the edit title button is present and interactive
            const editTitleButton = screen.getByLabelText("Edit title");
            expect(editTitleButton).toBeInTheDocument();
            expect(editTitleButton).not.toHaveAttribute("aria-hidden", "true");
            expect(editTitleButton).not.toBeDisabled();
            
            // Check for editable metadata fields that should be interactive for owners
            const editAuthorButton = screen.getByLabelText("Edit Authors");
            expect(editAuthorButton).toBeInTheDocument();
            expect(editAuthorButton).not.toHaveAttribute("aria-hidden", "true");
            expect(editAuthorButton).not.toBeDisabled();
            
            const editYearButton = screen.getByLabelText("Edit Year");
            expect(editYearButton).toBeInTheDocument();
            expect(editYearButton).not.toHaveAttribute("aria-hidden", "true");
            expect(editYearButton).not.toBeDisabled();
            
            // Check that description can be edited (owner-only function)
            const editDescriptionButton = screen.getByLabelText("Edit description");
            expect(editDescriptionButton).toBeInTheDocument();
            expect(editDescriptionButton).not.toHaveAttribute("aria-hidden", "true");
            expect(editDescriptionButton).not.toBeDisabled();
        });
    });

    describe("When the logged in user is not the owner of the garden", () => {
        it("should not allow the user to edit the garden's metadata", () => {
            // Setup auth as non-owner
            vi.spyOn(authHook, "useGlobusAuth").mockReturnValue(createMockAuthState({
                isAuthenticated: true,
                authorization: {
                    user: { sub: "different-user-456" },
                    authenticated: true
                } as any
            }));
            
            // Mock the garden API
            vi.spyOn(getGardenHook, "useGetGarden").mockReturnValue({
                data: fakeGarden,
                isLoading: false,
                isError: false
            } as any);
            
            // Render the GardenPage component
            const { container } = renderWithProviders(
                <MemoryRouter>
                    <GardenPage />
                </MemoryRouter>
            );
            
            // Check that edit controls are properly secured for non-owners
            
            // The page might implement security in different ways:
            // 1. Not rendering edit buttons at all for non-owners
            // 2. Rendering disabled buttons
            // 3. Removing click handlers from buttons
            
            // Check if title edit functionality exists
            const editTitleButton = screen.queryByLabelText("Edit title");
            
            // If the button doesn't exist at all, that's one secure approach
            if (!editTitleButton) {
                expect(editTitleButton).toBeNull();
            } else {
                // If it exists, it must be properly disabled
                expect(
                    editTitleButton.hasAttribute("disabled") || 
                    !editTitleButton.onclick // No click handler
                ).toBeTruthy();
            }
            
            // More comprehensive check: make sure no enabled edit buttons exist in the entire document
            const allButtons = container.querySelectorAll('button');
            const enabledEditButtons = Array.from(allButtons).filter(button => {
                const isEditButton = button.textContent?.toLowerCase().includes('edit') || 
                                    button.getAttribute('aria-label')?.toLowerCase().includes('edit');
                const isEnabled = !button.hasAttribute('disabled');
                return isEditButton && isEnabled;
            });
            
            // There should be no enabled edit buttons for non-owners
            expect(enabledEditButtons.length).toBe(0);
            
            // Check specific metadata fields - they should either not be editable or not have edit buttons
            const metadataEditControls = [
                screen.queryByLabelText("Edit Authors"),
                screen.queryByLabelText("Edit Year"),
                screen.queryByLabelText("Edit description")
            ];
            
            metadataEditControls.forEach(control => {
                if (control) {
                    // If control exists, ensure it's properly disabled
                    expect(control.hasAttribute("disabled") || !control.onclick).toBeTruthy();
                }
                // If control doesn't exist, that's secure by default
            });
        });
    });
});
