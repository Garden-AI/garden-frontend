import React from "react";
import { BasePanelHeaderActions } from "./BasePanelHeaderActions";
import { useGardenFiltering } from "../hooks/useGardenFiltering";

interface GardenPanelHeaderActionsProps {
  filtering: ReturnType<typeof useGardenFiltering>;
  searchPlaceholder?: string;
  showCreateButton?: boolean;
  CreateComponent?: React.ComponentType<{ onSuccess: () => void }>;
  createDialogTitle?: string;
  onCreateSuccess?: () => void;
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: (open: boolean) => void;
}

export const GardenPanelHeaderActions: React.FC<GardenPanelHeaderActionsProps> = (props) => {
  // Simply delegate to the generic component - they have the same interface
  return BasePanelHeaderActions({
    ...props,
    searchPlaceholder: props.searchPlaceholder || "Search gardens...",
    createDialogTitle: props.createDialogTitle || "Create New Garden",
  });
};