import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as useModalAppFormModule from "@/features/modal/api/useModalAppForm";
import { UploadModalAppForm } from "@/features/modal/components/UploadModalAppForm";

import { renderWithProviders } from "@tests/setupTests";

const createValidationResponse = (error: boolean, errorMessage: string) => ({
    form: {
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        clearErrors: vi.fn(),
        formState: { errors: {} }
    } as any,
    file: null,
    handleFileChange: vi.fn(),
    handleFunctionMetadataChange: vi.fn(),
    handleValidate: vi.fn(),
    handleSubmit: vi.fn(),
    modalMetadata: null,
    isValidating: false,
    isValidated: error,
    isDeploying: false,
    validationError: error ? {
        message: errorMessage,
        isApiError: false
    } : null,
    deploymentError: null,
});

const fakeModalMetadata = {
    app_name: "Test App",
    original_app_name: null,
    modal_functions: [
        {
            function_name: "test_function",
            description: "Test function description",
            is_archived: false,
            function_text: "def test_function(): pass",
            title: "Test Function",
            year: "2023",
            example_usage: "",
        }
    ],
    file_contents: "def test_function(): pass",
    requirements: [],
    conda_requirements: [],
    base_image_name: "test-image",
    modal_function_names: ["test_function"],
};

const createDeploymentErrorResponse = (errorMessage: string, isTimeout: boolean = false, isApiError: boolean = false) => ({
    form: {
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        clearErrors: vi.fn(),
        formState: { errors: {} }
    } as any,
    file: null,
    handleFileChange: vi.fn(),
    handleFunctionMetadataChange: vi.fn(),
    handleValidate: vi.fn(),
    handleSubmit: vi.fn(),
    modalMetadata: fakeModalMetadata, // Needs metadata to show deployment happened after validation
    isValidating: false,
    isValidated: true, // Must be true for deployment to have been attempted
    isDeploying: false, // Set to false to show deployment finished (with error)
    validationError: null,
    deploymentError: {
        message: errorMessage,
        isTimeout: isTimeout,
        isApiError: isApiError
    },
});

const createDeployingResponse = () => ({
    form: {
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        clearErrors: vi.fn(),
        formState: { errors: {} }
    } as any,
    file: null,
    handleFileChange: vi.fn(),
    handleFunctionMetadataChange: vi.fn(),
    handleValidate: vi.fn(),
    handleSubmit: vi.fn(),
    modalMetadata: fakeModalMetadata,
    isValidating: false,
    isValidated: true,
    isDeploying: true, // This is what we're testing - the component in deploying state
    validationError: null,
    deploymentError: null,
});

describe("UploadModalAppForm", () => {
    describe("when there is a validation error", () => {
        it("should render the error message", () => {
            vi.spyOn(useModalAppFormModule, "useModalAppForm")
                .mockReturnValue(createValidationResponse(true, "VALIDATION_ERROR FOR TESTING"));

            renderWithProviders(
                <MemoryRouter>
                    <UploadModalAppForm />
                </MemoryRouter>
            );

            expect(screen.getByText("VALIDATION_ERROR FOR TESTING")).toBeInTheDocument();
        });
    });

    describe("when validation succeeds", () => {
        it("should enable the deploy button", () => {
            vi.spyOn(useModalAppFormModule, "useModalAppForm")
                .mockReturnValue({
                    ...createValidationResponse(false, ""),
                    isValidated: true,
                    modalMetadata: fakeModalMetadata
                });

            renderWithProviders(
                <MemoryRouter>
                    <UploadModalAppForm />
                </MemoryRouter>
            );

            // Core assertion: After successful validation, the deploy button should be enabled
            const deployButton = screen.getByRole('button', { name: /Deploy Modal App & Continue/i });
            expect(deployButton).toBeEnabled();
        });
    });

    describe("when deployment fails", () => {
        it("should render the deployment error message", () => {
            const errorMessage = "DEPLOYMENT_ERROR FOR TESTING";
            
            vi.spyOn(useModalAppFormModule, "useModalAppForm")
                .mockReturnValue(createDeploymentErrorResponse(errorMessage));

            renderWithProviders(
                <MemoryRouter>
                    <UploadModalAppForm />
                </MemoryRouter>
            );

            // Check for error message content
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            
            // Check for deployment error alert title
            expect(screen.getByText("Deployment Error")).toBeInTheDocument();
        });
    });

    describe("when deployment succeeds", () => {
        it("should show the deployment loading state", () => {
            vi.spyOn(useModalAppFormModule, "useModalAppForm")
                .mockReturnValue(createDeployingResponse());

            renderWithProviders(
                <MemoryRouter>
                    <UploadModalAppForm />
                </MemoryRouter>
            );
            
            // When deployment is in progress, we should see the loading component
            expect(screen.getByText("Deploying your Modal app...")).toBeInTheDocument();
            expect(screen.getByText("Deployment in Progress")).toBeInTheDocument();
        });

        it("should enable the deploy button after validation succeeds", () => {
            // Create a spy for the handleSubmit function that returns a Promise
            const handleSubmitSpy = vi.fn((e) => {
                // Prevent actual form submission
                e.preventDefault();
                return Promise.resolve();
            });
            
            // We need to mock the form object's handleSubmit too
            const formHandleSubmitSpy = vi.fn(() => handleSubmitSpy);
            
            vi.spyOn(useModalAppFormModule, "useModalAppForm")
                .mockReturnValue({
                    ...createValidationResponse(false, ""),
                    isValidated: true,
                    modalMetadata: fakeModalMetadata,
                    handleSubmit: handleSubmitSpy,
                    form: {
                        ...createValidationResponse(false, "").form,
                        handleSubmit: formHandleSubmitSpy
                    }
                });

            renderWithProviders(
                <MemoryRouter>
                    <UploadModalAppForm />
                </MemoryRouter>
            );
            
            // Get the deploy button and verify it's enabled
            const deployButton = screen.getByRole('button', { name: /Deploy Modal App & Continue/i });
            expect(deployButton).toBeEnabled();
        });
    });
});