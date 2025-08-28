import React from "react";
import { Bookmark } from "lucide-react";
import { GardenTreeView } from "../GardenTreeView";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

type SavedGardensPanelProps = {
  savedGardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
};

export const SavedGardensPanel = ({
  savedGardens,
  onSelect,
  onDoubleClick = () => {},
  selectedItem,
}: SavedGardensPanelProps) => {
  return (
    <div className="h-full w-full bg-amber-50">
      <GardenTreeView
        gardens={savedGardens}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        selectedItem={
          selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
            ? (selectedItem as Garden | ModalFunction)
            : null
        }
        showHeader={true}
        headerIcon={<Bookmark className="h-4 w-4" />}
        headerTitle={`Saved Gardens (${savedGardens.length})`}
        headerThemeColors={{
          bg: "bg-amber-100",
          border: "border-amber-300",
          text: "text-amber-900",
          iconColor: "text-amber-700",
          hoverColor: "hover:bg-amber-200",
          activeColor: "bg-amber-200",
        }}
      />
    </div>
  );
};
