import { describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

import FunctionManager from "@/features/gardens/components/garden-page/FunctionManager";
import {
  Garden,
  ModalFunction,
  HpcFunctionMetadataResponse,
  User,
} from "@/types";

// Mock API hooks and libraries
vi.mock("@/features/users/api/useGetUserInfo");
vi.mock("@/features/functions/modal/api/useGetAllModalFunctions");
vi.mock("@/features/hpc-admin/api/useHpcFunctions");
vi.mock("@/features/gardens/api/usePatchGarden");
vi.mock("@/features/model-deployments/api/useGetModelDeployments");
vi.mock("sonner");

// Import mocked hooks for type-safe mocking
import { useGetUserInfo } from "@/features/users/api/useGetUserInfo";
import { useGetAllModalFunctions } from "@/features/functions/modal/api/useGetAllModalFunctions";
import { useHpcFunctions } from "@/features/hpc-admin/api/useHpcFunctions";
import { usePatchGarden } from "@/features/gardens/api/usePatchGarden";
import { useGetModelDeployments } from "@/features/model-deployments/api/useGetModelDeployments";

// --- Mock Data ---

const mockOwner: User = {
  identity_id: "owner-uuid",
  username: "owner",
  name: "Owner User",
  email: "owner@garden.ai",
};

const mockNonOwner: User = {
  identity_id: "non-owner-uuid",
  username: "nonowner",
  name: "Non-Owner User",
  email: "nonowner@garden.ai",
};

const mockModalFunctions: ModalFunction[] = [
  {
    id: 1,
    title: "Modal Func 1",
    function_name: "modal_func_1",
    authors: ["Author One"],
    description: "desc 1",
    is_archived: false,
    function_text: "",
    year: "2025",
    example_usage: "",
    modal_app_id: 1,
    owner: "owner-uuid",
    owner_identity_id: "owner-uuid",
    hardware_spec: {},
  },
  {
    id: 2,
    title: "Modal Func 2",
    function_name: "modal_func_2",
    authors: ["Author Two"],
    description: "desc 2",
    is_archived: false,
    function_text: "",
    year: "2025",
    example_usage: "",
    modal_app_id: 1,
    owner: "owner-uuid",
    owner_identity_id: "owner-uuid",
    hardware_spec: {},
  },
];

const mockHpcFunctions: HpcFunctionMetadataResponse[] = [
  {
    id: 1,
    title: "HPC Func 1",
    function_name: "hpc_func_1",
    authors: ["Author Three"],
    description: "desc 3",
    is_archived: false,
    function_text: "",
    year: "2025",
    num_invocations: 0,
  },
  {
    id: 2,
    title: "HPC Func 2",
    function_name: "hpc_func_2",
    authors: ["Author One"],
    description: "desc 4",
    is_archived: false,
    function_text: "",
    year: "2025",
    num_invocations: 0,
  },
];

const mockGarden: Garden = {
  doi: "10.23677/test-garden",
  title: "Test Garden",
  authors: ["Owner User"],
  owner_identity_id: "owner-uuid",
  modal_functions: [mockModalFunctions[0]],
  hpc_functions: [mockHpcFunctions[0]],
  description: "A test garden",
  year: "2025",
  language: "en",
  version: "1.0",
  publisher: "Garden-AI",
  contributors: [],
  entrypoint_ids: [],
  entrypoints: [],
  doi_is_draft: false,
  marked_for_deletion: null,
  state: "PUBLISHED",
  modal_function_ids: [1],
  hpc_function_ids: [1],
  owner: "owner-uuid",
  id: 1,
  is_archived: false,
} as Garden;

const mockPatchGarden = vi.fn();

// --- Test Setup ---

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

const renderFunctionManager = (garden: Garden) => {
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <FunctionManager garden={garden} />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

// --- Test Suite ---

describe("FunctionManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    // Default mocks for happy paths
    (useGetUserInfo as Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      isError: false,
    });
    (useGetAllModalFunctions as Mock).mockReturnValue({
      data: mockModalFunctions,
      isLoading: false,
      isError: false,
    });
    (useHpcFunctions as Mock).mockReturnValue({
      data: mockHpcFunctions,
      isLoading: false,
      isError: false,
    });
    (usePatchGarden as Mock).mockReturnValue({
      mutateAsync: mockPatchGarden,
      isPending: false,
    });
    (useGetModelDeployments as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    (toast.error as Mock) = vi.fn();
    (toast.info as Mock) = vi.fn();
    (toast.success as Mock) = vi.fn();
  });

  // --- Task 2: Permissions ---

  it("should show the 'Add/Remove Functions' button for the garden owner", () => {
    renderFunctionManager(mockGarden);
    expect(
      screen.getByRole("button", { name: /add\/remove functions/i })
    ).toBeInTheDocument();
  });

  it("should not show the 'Add/Remove Functions' button for a non-owner", () => {
    (useGetUserInfo as Mock).mockReturnValue({
      data: mockNonOwner,
      isLoading: false,
      isError: false,
    });
    renderFunctionManager(mockGarden);
    expect(
      screen.queryByRole("button", { name: /add\/remove functions/i })
    ).not.toBeInTheDocument();
  });

  // --- Task 3: Data Fetching and Display ---

  it("should display merged functions in the table when data is loaded", async () => {
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(async () => {
      const table = await screen.findByRole("table");
      expect(within(table).getByText("Modal Func 1")).toBeInTheDocument();
      expect(within(table).getByText("HPC Func 1")).toBeInTheDocument();
      expect(within(table).getByText("Modal Func 2")).toBeInTheDocument();
      expect(within(table).getByText("HPC Func 2")).toBeInTheDocument();
    });
  });

  it("should show an error toast if fetching modal functions fails", async () => {
    (useGetAllModalFunctions as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load Modal functions."
      );
    });
  });

  it("should show a loading spinner while fetching functions", async () => {
    (useGetAllModalFunctions as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    (useHpcFunctions as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await screen.findByRole("status");
  });

  it("should show an error toast if fetching HPC functions fails", async () => {
    (useHpcFunctions as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load HPC functions.");
    });
  });

  // --- Task 4: Selection and Save Logic ---

  it("should pre-select functions already in the garden", async () => {
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      const modalRow = screen.getByRole("row", { name: /modal func 1/i });
      const hpcRow = screen.getByRole("row", { name: /hpc func 1/i });
      expect(within(modalRow).getByRole("checkbox")).toBeChecked();
      expect(within(hpcRow).getByRole("checkbox")).toBeChecked();
    });
  });

  it("should call patchGarden with correct payload on save", async () => {
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      // Check "Modal Func 2"
      const modal2Row = screen.getByRole("row", { name: /modal func 2/i });
      fireEvent.click(within(modal2Row).getByRole("checkbox"));
      
      // Check "HPC Func 2"
      const hpc2Row = screen.getByRole("row", { name: /hpc func 2/i });
      fireEvent.click(within(hpc2Row).getByRole("checkbox"));
    });

    fireEvent.click(screen.getByRole("button", { name: /update garden/i }));

    await waitFor(() => {
      const expectedAuthors = ["Author One", "Author Two", "Author Three"];
      expect(mockPatchGarden).toHaveBeenCalledWith(expect.objectContaining({
        doi: mockGarden.doi,
        garden: expect.objectContaining({
          modal_function_ids: [1, 2],
          hpc_function_ids: [1, 2],
        }),
      }));
      const actualAuthors = mockPatchGarden.mock.calls[0][0].garden.authors;
      expect(new Set(actualAuthors)).toEqual(new Set(expectedAuthors));
    });
  });

  it("should call patchGarden with correct payload on function removal", async () => {
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      // Un-check "Modal Func 1" which was pre-selected
      const modal1Row = screen.getByRole("row", { name: /modal func 1/i });
      fireEvent.click(within(modal1Row).getByRole("checkbox"));
    });

    fireEvent.click(screen.getByRole("button", { name: /update garden/i }));

    await waitFor(() => {
      expect(mockPatchGarden).toHaveBeenCalledWith(
        expect.objectContaining({
          doi: mockGarden.doi,
          garden: expect.objectContaining({
            modal_function_ids: [], // Was [1], now empty
            authors: ["Author Three"],
          }),
        })
      );

      // Check that hpc_function_ids was not sent
      const patchPayload = mockPatchGarden.mock.calls[0][0].garden;
      expect(patchPayload).not.toHaveProperty("hpc_function_ids");
    });
  });

  it("should not call patchGarden if no changes were made", async () => {
    renderFunctionManager(mockGarden);
    fireEvent.click(
      screen.getByRole("button", { name: /add\/remove functions/i })
    );

    await waitFor(() => {
      // Open and immediately close
      fireEvent.click(screen.getByRole("button", { name: /update garden/i }));
    });

    expect(mockPatchGarden).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith("No changes to save.");
  });
});