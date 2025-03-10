import { Switch } from "@/components/shadcn/switch";
import { Label } from "@/components/shadcn/label";

interface ShowAllMaterialsToggleProps {
  showAll: boolean;
  onChange: (value: boolean) => void;
}

const ShowAllMaterialsToggle: React.FC<ShowAllMaterialsToggleProps> = ({ showAll, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch 
        id="show-all-materials" 
        checked={showAll}
        onCheckedChange={onChange}
        aria-label="Show all"
        role="checkbox"
        aria-checked={showAll}
      />
      <Label htmlFor="show-all-materials" className="text-sm text-gray-700">
        {showAll 
          ? "Showing all materials (garden + functions)" 
          : "Include materials from functions"}
      </Label>
    </div>
  );
};

export default ShowAllMaterialsToggle; 