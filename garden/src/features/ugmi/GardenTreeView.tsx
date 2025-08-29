import React from "react";
import { Garden, ModalFunction } from "@/types";
import { Sprout } from "lucide-react";
import { useCreateGarden } from "../gardens/api/useCreateGarden";
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
  isLoading?: boolean;
  onSelect?: (entity: Garden | ModalFunction) => void;
  onDoubleClick?: () => void;
  onGardenCreated?: (garden: Garden) => void;
  selectedItem?: SelectedItem;
  // Create configuration
  allowCreate?: boolean;
  // Header configuration
  showHeader?: boolean;
  headerIcon?: React.ReactNode;
  headerTitle?: string;
  headerThemeColors?: ThemeColors;
  emptyTitle?: string;
  emptyDescription?: string;
};

export const GardenTreeView = ({
  gardens,
  isLoading = false,
  onSelect,
  onDoubleClick = () => { },
  onGardenCreated,
  selectedItem,
  allowCreate = false,
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
  emptyTitle = "No Gardens Found",
  emptyDescription = "",
}: GardenTreeViewProps) => {
  const { mutateAsync: createGarden, isPending: isCreating } = useCreateGarden();

  const handleCreateGarden = async () => {
    try {
      const newGarden = await createGarden({
        title: "New Garden",
        description: null,
        doi_is_draft: true,
        publisher: "Garden-AI",
      });

      if (onGardenCreated) {
        onGardenCreated(newGarden);
      }
      if (onSelect) {
        onSelect(newGarden);
      }
    } catch (error) {
      console.error("Failed to create garden:", error);
    }
  };
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

  const filterConfigs: FilterConfig[] = [
    { label: "Published", key: "published", defaultChecked: true },
    { label: "Draft", key: "draft", defaultChecked: true },
    { label: "Archived", key: "archived", defaultChecked: false },
  ];

  const searchFunction: SearchFunction<Garden, ModalFunction> = (node, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      node.parent.title.toLowerCase().includes(searchLower) ||
      (node.parent.description?.toLowerCase().includes(searchLower) ?? false) ||
      (node.parent.authors?.some((author) => author.toLowerCase().includes(searchLower)) ?? false)
    );
  };

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
      isLoading={isLoading || (allowCreate && isCreating)}
      ParentNodeComponent={GardenParentNode}
      ChildNodeComponent={GardenFunctionNode}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
      onCreate={allowCreate ? handleCreateGarden : undefined}
      selectedItem={selectedItem}
      showHeader={showHeader}
      headerIcon={headerIcon}
      headerTitle={headerTitle}
      headerThemeColors={headerThemeColors}
      searchPlaceholder="Search by doi, name, description, or author..."
      searchFunction={searchFunction}
      sortOptions={sortOptions}
      filterConfigs={filterConfigs}
      filterFunction={filterFunction}
      emptyIcon={<Sprout className="h-12 w-12" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
};
