import React from "react";
import { Garden, ModalFunction } from "@/types";
import { Sprout } from "lucide-react";
import { CreateGardenForm } from "../gardens/components/create/CreateGardenForm";
import {
  BaseTreeView,
  TreeNode,
  SortOption,
  FilterConfig,
  ThemeColors,
  SearchFunction,
  FilterFunction,
} from "./components/BaseTreeView";
import { GardenParentNode, GardenFunctionNode } from "./components/GardenTreeNodes";

type SelectedItem = Garden | ModalFunction | null;

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Garden | ModalFunction) => void;
  onDoubleClick?: () => void;
  onGardenCreated?: (garden: Garden) => void;
  selectedItem?: SelectedItem;
  // Header configuration
  showHeader?: boolean;
  headerIcon?: React.ReactNode;
  headerTitle?: string;
  headerThemeColors?: ThemeColors;
};

export const GardenTreeView = ({
  gardens,
  onSelect,
  onDoubleClick = () => {},
  onGardenCreated,
  selectedItem,
  showHeader = false,
  headerIcon,
  headerTitle = "Gardens",
  headerThemeColors = {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-900",
    iconColor: "text-emerald-700",
    hoverColor: "hover:bg-emerald-200",
    activeColor: "bg-emerald-200",
  },
}: GardenTreeViewProps) => {
  // Transform gardens into tree node structure
  const treeData: TreeNode<Garden, ModalFunction>[] = gardens.map((garden) => ({
    parent: garden,
    children: garden.modal_functions || [],
  }));

  // Define sorting options
  const sortOptions: SortOption<Garden>[] = [
    {
      label: "Title (A-Z)",
      value: "title",
      sortFn: (a, b) => a.title.localeCompare(b.title),
    },
    {
      label: "Title (Z-A)",
      value: "title-desc",
      sortFn: (a, b) => b.title.localeCompare(a.title),
    },
    {
      label: "State (Published First)",
      value: "state-published",
      sortFn: (a, b) => {
        const getStateOrder = (garden: Garden) => {
          if (garden.is_archived) return 2;
          if (garden.doi_is_draft) return 1;
          return 0; // Published
        };
        return getStateOrder(a) - getStateOrder(b);
      },
    },
    {
      label: "State (Draft First)",
      value: "state-draft",
      sortFn: (a, b) => {
        const getStateOrder = (garden: Garden) => {
          if (garden.doi_is_draft) return 0;
          if (garden.is_archived) return 2;
          return 1; // Published
        };
        return getStateOrder(a) - getStateOrder(b);
      },
    },
  ];

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    { label: "Published", key: "published", defaultChecked: true },
    { label: "Draft", key: "draft", defaultChecked: true },
    { label: "Archived", key: "archived", defaultChecked: true },
  ];

  // Define search function
  const searchFunction: SearchFunction<Garden, ModalFunction> = (node, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      node.parent.title.toLowerCase().includes(searchLower) ||
      (node.parent.description?.toLowerCase().includes(searchLower) ?? false) ||
      (node.parent.authors?.some((author) => author.toLowerCase().includes(searchLower)) ?? false)
    );
  };

  // Define filter function
  const filterFunction: FilterFunction<Garden, ModalFunction> = (node, filterState) => {
    const garden = node.parent;
    if (garden.is_archived && !filterState.archived) return false;
    if (garden.doi_is_draft && !filterState.draft) return false;
    if (!garden.is_archived && !garden.doi_is_draft && !filterState.published) return false;
    return true;
  };

  return (
    <BaseTreeView
      data={treeData}
      ParentNodeComponent={GardenParentNode}
      ChildNodeComponent={GardenFunctionNode}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
      onCreateSuccess={onGardenCreated}
      selectedItem={selectedItem}
      showHeader={showHeader}
      headerIcon={headerIcon}
      headerTitle={headerTitle}
      headerThemeColors={headerThemeColors}
      searchPlaceholder="Search gardens by name, description, or author..."
      searchFunction={searchFunction}
      sortOptions={sortOptions}
      filterConfigs={filterConfigs}
      filterFunction={filterFunction}
      emptyIcon={<Sprout className="h-12 w-12" />}
      emptyTitle="No Gardens"
      emptyDescription="Create one to get started"
      CreateFormComponent={onGardenCreated ? CreateGardenFormWrapper : undefined}
      createDialogTitle="Create New Garden"
    />
  );
};

// Wrapper component to match the expected onSuccess signature
const CreateGardenFormWrapper: React.FC<{ onSuccess: (garden: Garden) => void }> = ({
  onSuccess,
}) => <CreateGardenForm onFormStateChange={() => {}} onSuccess={onSuccess} />;
